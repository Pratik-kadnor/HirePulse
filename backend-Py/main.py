import os
import re
import json
import time
import shutil
import tempfile
import requests
import pdfplumber
import pytesseract
from pdf2image import convert_from_path
from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv(override=True)

# Initialize FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────
#  Multi-model fallback chain
#  Tries each model in order; moves to the next
#  on 429 (rate limit) or any transient error.
# ─────────────────────────────────────────────
GEMINI_MODELS = [
    "gemini-1.5-flash",        # Primary – fastest, generous free quota
    "gemini-1.5-flash-8b",     # Fallback 1 – smaller, separate quota bucket
    "gemini-1.0-pro",          # Fallback 2 – stable, different quota pool
]

def call_gemini_with_fallback(prompt: str, api_key: str) -> str:
    """
    Tries GEMINI_MODELS in order.  On 429 / error it waits briefly and
    moves to the next model.  Returns the cleaned AI text.
    Raises if all models are exhausted.
    """
    last_error = None

    for model in GEMINI_MODELS:
        url = (
            f"https://generativelanguage.googleapis.com/v1beta/models/"
            f"{model}:generateContent?key={api_key}"
        )
        headers = {"Content-Type": "application/json"}
        data = {"contents": [{"parts": [{"text": prompt}]}]}

        for attempt in range(2):          # 2 attempts per model before switching
            try:
                resp = requests.post(url, headers=headers, json=data, timeout=30)

                if resp.status_code == 429:
                    print(f"[{model}] 429 rate-limit (attempt {attempt+1}). Switching model…")
                    time.sleep(1.5 ** attempt)   # 1 s, then 1.5 s
                    break                         # break inner loop → next model

                resp.raise_for_status()
                result = resp.json()

                candidates = result.get("candidates", [])
                if candidates:
                    raw = candidates[0]["content"]["parts"][0]["text"]
                    return clean_gemini_output(raw)

                # Empty response – try next model
                print(f"[{model}] empty candidates, trying next model…")
                break

            except requests.exceptions.Timeout:
                print(f"[{model}] timeout (attempt {attempt+1})")
                last_error = "Request timed out"
                time.sleep(1)

            except requests.exceptions.HTTPError as e:
                last_error = str(e)
                if resp.status_code == 429:
                    time.sleep(1.5 ** attempt)
                    break
                print(f"[{model}] HTTP error: {e}")
                break

            except Exception as e:
                last_error = str(e)
                print(f"[{model}] error: {e}")
                break

    raise Exception(f"All Gemini models exhausted. Last error: {last_error}")


# ---------- Utilities ----------

def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print("PDFPlumber error:", e)

    if not text.strip():
        images = convert_from_path(pdf_path)
        for image in images:
            text += pytesseract.image_to_string(image) + "\n"

    return text.strip()


def clean_gemini_output(text):
    text = re.sub(r"\*\*(.*?)\*\*", r"\1", text)
    text = re.sub(r"[*•📚⚠️💼✅🔹🔸📊🛠️📝⬇️🚀🔍]+", "", text)
    text = re.sub(r"#+\s?", "", text)
    text = re.sub(r"[-–—]{1,3}\s?", "", text)
    text = re.sub(r"\n{2,}", "\n\n", text)
    return text.strip()


# ---------- Resume Analysis ----------

def analyze_resume_text(resume_text, job_description=None):
    prompt = f"""
Assume you are a professional resume analyst and career coach.
Analyze the following resume and provide a report including:
- Overall profile strength
- Key skills
- Areas for improvement
- Recommended courses
- ATS Score (between 0 and 100)
- Job recommendations

Give brief and concise answers.

Resume:
{resume_text}
"""
    if job_description:
        prompt += f"\n\nCompare with this job description:\n{job_description}"

    api_key = os.getenv("GOOGLE_API_KEY")
    return call_gemini_with_fallback(prompt, api_key)


@app.post("/analyze-resume/")
async def analyze_resume_api(file: UploadFile = File(...), job_description: str = Form("")):
    try:
        temp_dir = tempfile.mkdtemp()
        file_path = os.path.join(temp_dir, file.filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        print(f"Processing file: {file.filename}")
        resume_text = extract_text_from_pdf(file_path)

        if not resume_text:
            raise Exception("Failed to extract text from PDF")

        print(f"Extracted text length: {len(resume_text)}")
        analysis = analyze_resume_text(resume_text, job_description)
        shutil.rmtree(temp_dir)
        return {"analysis": analysis}

    except Exception as e:
        print(f"Error analyzing resume: {str(e)}")
        if 'temp_dir' in locals():
            shutil.rmtree(temp_dir, ignore_errors=True)
        return {"error": f"Failed to analyze resume: {str(e)}"}


# ---------- Job Recommendations ----------

@app.get("/job-recommendations")
def get_jobs():
    url = "https://jsearch.p.rapidapi.com/search"
    querystring = {"query": "developer in India", "page": "1", "num_pages": "2"}
    headers = {
        "X-RapidAPI-Key": os.getenv("RAPIDAPI_KEY"),
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
    }
    response = requests.get(url, headers=headers, params=querystring)
    data = response.json()
    return {"jobs": data.get("data", [])}


# ---------- Interview Chat ----------

# Contextual follow-up fallback questions (used when AI is unavailable)
FALLBACK_QUESTIONS = [
    "That's interesting! Can you walk me through a challenging project you've worked on recently?",
    "Great answer. How do you handle pressure or tight deadlines in your work?",
    "Good. Can you describe a time when you had to learn a new technology quickly?",
    "Tell me about a situation where you disagreed with a team member — how did you handle it?",
    "What are your key strengths that make you a great fit for this role?",
    "Where do you see yourself professionally in the next 3 years?",
    "Can you give an example of how you've improved a process or workflow?",
    "How do you stay updated with the latest trends in your field?",
]
_fallback_index = 0


@app.post("/interview/chat")
async def interview_chat(request: dict):
    global _fallback_index
    try:
        user_message = request.get("message", "")
        if not user_message:
            return {"error": "Message is required"}

        prompt = f"""
You are an experienced HR interviewer conducting a professional job interview.
The candidate just said: "{user_message}"

Instructions:
- Acknowledge their answer briefly (1 sentence).
- Then ask ONE clear, relevant follow-up interview question.
- Keep the total response under 60 words so it can be spoken naturally.
- Do NOT use bullet points, markdown, or lists.
- Sound conversational and encouraging.
"""
        api_key = os.getenv("GOOGLE_API_KEY")

        try:
            ai_text = call_gemini_with_fallback(prompt, api_key)
            _fallback_index = 0  # reset on success
            return {"response": ai_text}

        except Exception as model_err:
            # All models exhausted → use a local fallback question so the
            # interview keeps going instead of showing "undefined".
            print(f"All models failed, using fallback question: {model_err}")
            question = FALLBACK_QUESTIONS[_fallback_index % len(FALLBACK_QUESTIONS)]
            _fallback_index += 1
            return {
                "response": question,
                "fallback": True          # frontend can optionally note this
            }

    except Exception as e:
        print(f"Error in interview chat: {str(e)}")
        return {
            "response": "I'm having a brief connectivity issue. Please repeat your answer or type it below.",
            "error": str(e)
        }


# ---------- Interview Report ----------

@app.post("/interview/report")
async def interview_report(request: dict):
    try:
        conversation = request.get("conversation", "")
        if not conversation:
            return {"error": "Conversation history is required"}

        prompt = f"""
You are an expert Interview Coach.
Analyze the following interview conversation and provide structured feedback.

Conversation:
{conversation}

Return ONLY valid JSON (no markdown, no backticks) with exactly these fields:
{{
  "score": <integer 0-10>,
  "strengths": [<string>, ...],
  "improvements": [<string>, ...],
  "overall_feedback": "<string>"
}}
"""
        api_key = os.getenv("GOOGLE_API_KEY")

        try:
            ai_text = call_gemini_with_fallback(prompt, api_key)

            # Extract JSON from response
            json_match = re.search(r"\{.*\}", ai_text, re.DOTALL)
            if json_match:
                try:
                    return {"report": json.loads(json_match.group(0))}
                except json.JSONDecodeError:
                    pass

            # Fallback: wrap raw text
            return {"report": {
                "score": 7,
                "strengths": ["Completed the interview session"],
                "improvements": ["Could not parse detailed feedback"],
                "overall_feedback": ai_text
            }}

        except Exception as model_err:
            print(f"Report generation failed, returning placeholder: {model_err}")
            return {"report": {
                "score": 7,
                "strengths": [
                    "Clear communication style",
                    "Good connection of past experience to the role",
                    "Maintained professional demeanor throughout"
                ],
                "improvements": [
                    "Provide more specific metrics for achievements",
                    "Keep answers slightly more concise",
                    "Use the STAR method more consistently"
                ],
                "overall_feedback": (
                    "You demonstrated strong potential for the role. Your answers were generally "
                    "well-structured. (Note: AI service was temporarily unavailable; this is an "
                    "auto-generated placeholder report.)"
                )
            }}

    except Exception as e:
        print(f"Error generating report: {str(e)}")
        return {"report": {
            "score": 6,
            "strengths": ["Participated in the interview"],
            "improvements": ["Please retry for a detailed AI analysis"],
            "overall_feedback": f"Report generation encountered an error: {str(e)}"
        }}


# Optional: Run server directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)