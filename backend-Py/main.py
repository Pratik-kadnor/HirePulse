import os
import re
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
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


# ---------- Resume Analysis Logic ----------

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

def analyze_resume_text(resume_text, job_description=None):
    prompt = f"""
Assume you are a professional resume analyst and career coach.
You are tasked with analyzing a resume and providing a detailed report.

Analyze the following resume and provide report including:
- Overall profile strength
- Key skills
- Areas for improvement
- Recommended courses
- ATS Score (between 0 and 100)
- Job recommendations

give brief and concise answers.

Resume:
{resume_text}
"""

    if job_description:
        prompt += f"\n\nCompare with this job description:\n{job_description}"

    # Use Gemini REST API directly with retry logic
    api_key = os.getenv("GOOGLE_API_KEY")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={api_key}"
    
    headers = {
        "Content-Type": "application/json"
    }
    
    data = {
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }]
    }
    
    import time
    max_retries = 3
    retry_delay = 2 # seconds

    for attempt in range(max_retries):
        try:
            response = requests.post(url, headers=headers, json=data)
            response.raise_for_status()
            
            result = response.json()
            # Check if candidates exist
            if "candidates" not in result or not result["candidates"]:
                if "promptFeedback" in result:
                     raise Exception(f"Analysis blocked: {result['promptFeedback']}")
                raise Exception("No analysis result generated")
                
            text = result["candidates"][0]["content"]["parts"][0]["text"]
            return clean_gemini_output(text)
            
        except requests.exceptions.HTTPError as e:
            if response.status_code == 429:
                print(f"Rate limit hit (429). Retrying in {retry_delay} seconds... (Attempt {attempt+1}/{max_retries})")
                time.sleep(retry_delay)
                retry_delay *= 2 # Exponential backoff
                continue
            else:
                raise e
        except Exception as e:
            print(f"Error checking Gemini: {e}")
            raise e
            
    raise Exception("Failed to analyze resume after retries (Rate Limit)")

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

# ---------- Job Recommendations Logic ----------
# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

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

@app.post("/interview/chat")
async def interview_chat(request: dict):
    try:
        user_message = request.get("message", "")
        if not user_message:
            return {"error": "Message is required"}

        prompt = f"""
        You are an experienced HR interviewer conducting a job interview.
        User says: "{user_message}"
        
        Provide a professional, concise, and engaging response. 
        If the user answered a question, acknowledge it and ask the next relevant question.
        Keep your response short (under 50 words) so it can be spoken easily.
        """
        
        # Use retry logic for robustness
        api_key = os.getenv("GOOGLE_API_KEY")
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={api_key}"
        headers = { "Content-Type": "application/json" }
        data = { "contents": [{ "parts": [{ "text": prompt }] }] }
        
        import time
        max_retries = 3
        retry_delay = 2

        for attempt in range(max_retries):
            try:
                response = requests.post(url, headers=headers, json=data)
                response.raise_for_status()
                result = response.json()
                if "candidates" in result and result["candidates"]:
                    ai_text = result["candidates"][0]["content"]["parts"][0]["text"]
                    return {"response": clean_gemini_output(ai_text)}
                raise Exception("No analysis result")
            except Exception as e:
                if attempt < max_retries - 1:
                    time.sleep(retry_delay)
                    retry_delay *= 2
                    continue
                raise e
                
    except Exception as e:
        print(f"Error in interview chat: {str(e)}")
        return {"error": f"Failed to get response: {str(e)}"}

@app.post("/interview/report")
async def interview_report(request: dict):
    try:
        conversation = request.get("conversation", [])
        if not conversation:
            return {"error": "Conversation history is required"}

        prompt = f"""
        You are an expert Interview Coach.
        Analyze the following interview conversation and provide a structured feedback report.
        
        Conversation:
        {conversation}
        
        Provide feedback in JSON format with these fields:
        - score (0-10)
        - strengths (list of strings)
        - improvements (list of strings)
        - overall_feedback (string)
        
        Return ONLY valid JSON.
        """
        
        api_key = os.getenv("GOOGLE_API_KEY")
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={api_key}"
        headers = { "Content-Type": "application/json" }
        data = { "contents": [{ "parts": [{ "text": prompt }] }] }
        
        import time
        import json
        max_retries = 3
        retry_delay = 2

        for attempt in range(max_retries):
            try:
                response = requests.post(url, headers=headers, json=data)
                response.raise_for_status()
                result = response.json()
                if "candidates" in result and result["candidates"]:
                    ai_text = result["candidates"][0]["content"]["parts"][0]["text"]
                    
                    # Extract JSON
                    json_match = re.search(r"\{.*\}", ai_text, re.DOTALL)
                    if json_match:
                        try:
                            # Return parsed JSON object directly
                            return {"report": json.loads(json_match.group(0))}
                        except:
                            pass
                    
                    # Fallback if strict JSON fails but text is there
                    return {"report": {"overall_feedback": ai_text, "score": 0, "strengths": [], "improvements": []}}
                    
                raise Exception("No report generated")

            except requests.exceptions.HTTPError as e:
                # Handle 429 Too Many Requests specifically with a Mock Fallback
                if e.response.status_code == 429:
                    print("429 Rate Limit hit. Returning mock report.")
                    return {"report": {
                        "score": 8,
                        "strengths": [
                            "Clear communication style",
                            "Good connection of past experience to role",
                            "Maintained professional demeanor"
                        ],
                        "improvements": [
                            "Could provide more specific metrics for achievements",
                            "Try to keep answers slightly more concise",
                            "Use the STAR method more consistently"
                        ],
                        "overall_feedback": "You demonstrated strong potential for the role. Your answers were generally well-structured. (Note: This is a generated placeholder report because the AI Service is currently busy/rate-limited)."
                    }}
                
                if attempt < max_retries - 1:
                    time.sleep(retry_delay)
                    retry_delay *= 2
                    continue
                raise e

            except Exception as e:
                if attempt < max_retries - 1:
                    time.sleep(retry_delay)
                    retry_delay *= 2
                    continue
                raise e

    except Exception as e:
        print(f"Error generating report: {str(e)}")
        # If all else fails, return mock error report so UI doesn't break
        if "429" in str(e):
             return {"report": {
                        "score": 7,
                        "strengths": ["Resilience", "Patience"],
                        "improvements": ["Retry later"],
                        "overall_feedback": "AI Service is currently rate-limited. This is a placeholder report."
                    }}
        return {"error": f"Failed to generate report: {str(e)}"}

# Optional: Run server directly
if __name__ == "__main__":
    app.run(debug=True)
        