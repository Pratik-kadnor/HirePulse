import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { Mic, MicOff, Video, VideoOff, Play, Square, Send, FileText } from "lucide-react";

const Interview = () => {
    const [isInterviewing, setIsInterviewing] = useState(false);
    const [webcamEnabled, setWebcamEnabled] = useState(true);
    const [transcript, setTranscript] = useState("");
    const [currentResponse, setCurrentResponse] = useState("");
    const [aiResponse, setAiResponse] = useState("AI interviewer is ready.");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [conversationHistory, setConversationHistory] = useState([]);
    const [report, setReport] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const [interviewerState, setInterviewerState] = useState("idle"); // idle, listening, speaking

    const webcamRef = useRef(null);
    const recognitionRef = useRef(null);

    // Initialize Speech Recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false; // Changed to false for better control
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const lastResult = event.results[event.results.length - 1];
                if (lastResult.isFinal) {
                    const text = lastResult[0].transcript;
                    setCurrentResponse(text);
                    handleUserSubmit(text); // Auto-submit on silence
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech error:", event.error);
                if (event.error === 'not-allowed') {
                    setErrorMsg("Mic access denied.");
                    setIsListening(false);
                }
                if (event.error === 'no-speech') {
                    // Just silence, ignore
                }
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            try {
                recognitionRef.current.start();
                setIsListening(true);
                setInterviewerState("listening");
                setErrorMsg("");
            } catch (e) {
                console.error("Start error", e);
            }
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
            if (interviewerState === "listening") {
                setInterviewerState("idle");
            }
        }
    };

    const startInterview = () => {
        setIsInterviewing(true);
        setReport(null);
        setConversationHistory([]);
        setTranscript("");
        setAiResponse("Hello! I'm your AI interviewer today. Tell me about yourself.");
        speak("Hello! I'm your AI interviewer today. Tell me about yourself.");
    };

    const stopInterview = async () => {
        setIsInterviewing(false);
        stopListening();

        if (conversationHistory.length === 0) {
            setErrorMsg("No conversation to analyze. Speak first!");
            return;
        }

        setAiResponse("Generating feedback report... (This may take a few seconds)");

        try {
            // Generate Report
            const historyText = conversationHistory.map(idx => `${idx.role}: ${idx.content}`).join("\n");
            console.log("Sending history:", historyText);

            const response = await fetch(`http://127.0.0.1:8000/interview/report`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ conversation: historyText })
            });

            const data = await response.json();

            if (data.error) {
                console.error("Backend Error:", data.error);
                setErrorMsg(`Report Error: ${data.error}`);
                alert(`Report Generation Failed: ${data.error}`);
            } else if (data.report) {
                setReport(data.report);
            } else {
                setErrorMsg("No report returned.");
            }

        } catch (e) {
            console.error("Fetch Error:", e);
            setErrorMsg("Failed to connect to report server.");
            alert("Network Error: Could not generate report.");
        }
    };

    const toggleWebcam = () => setWebcamEnabled(!webcamEnabled);
    const toggleMic = () => {
        if (isListening) stopListening();
        else startListening();
    };

    const handleUserSubmit = async (text) => {
        if (!text.trim()) return;

        setConversationHistory(prev => [...prev, { role: "User", content: text }]);
        setTranscript(prev => prev + "\nYou: " + text);
        setCurrentResponse(""); // Clear input
        setLoading(true);

        // Stop listening while AI thinks
        stopListening();

        try {
            const response = await fetch(`http://127.0.0.1:8000/interview/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text })
            });

            if (!response.ok) throw new Error("Server Error");

            const data = await response.json();
            const aiText = data.response;

            setAiResponse(aiText);
            setTranscript(prev => prev + "\nAI: " + aiText);
            setConversationHistory(prev => [...prev, { role: "AI", content: aiText }]);

            speak(aiText);

        } catch (error) {
            console.error(error);
            setErrorMsg("AI Connect Error");
        } finally {
            setLoading(false);
        }
    };

    const handleManualSubmit = (e) => {
        e.preventDefault();
        handleUserSubmit(currentResponse);
    };

    const speak = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onstart = () => {
                setInterviewerState("speaking");
            };
            utterance.onend = () => {
                setInterviewerState("idle");
                // Auto-listen after AI finishes speaking?
                // startListening(); // Uncomment for auto-conversation flow
            };
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAF5E9] via-[#FFF8E7] to-[#FAF5E9] text-gray-900 p-6 flex flex-col gap-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#009B4D] to-[#00C962] bg-clip-text text-transparent">
                    AI Mock Interview
                </h1>
                <div className="flex gap-4">
                    {!isInterviewing ? (
                        <button
                            onClick={startInterview}
                            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#009B4D] to-[#00C962] text-white hover:shadow-xl rounded-xl font-semibold transition-all"
                        >
                            <Play className="w-4 h-4" /> Start Interview
                        </button>
                    ) : (
                        <button
                            onClick={stopInterview}
                            className="flex items-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-all shadow-lg shadow-red-900/20"
                        >
                            <Square className="w-4 h-4" /> End & Get Report
                        </button>
                    )}
                </div>
            </div>

            {/* Results Modal / View */}
            {/* Results Modal / View */}
            {report && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-[#1a1a1a] border border-purple-500 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <FileText className="text-purple-500" /> Interview Analysis
                            </h2>
                            <button onClick={() => setReport(null)} className="text-gray-400 hover:text-white bg-gray-800 px-3 py-1 rounded-lg">Close</button>
                        </div>

                        {typeof report === 'object' ? (
                            <div className="space-y-6">
                                {/* Score */}
                                <div className="flex items-center gap-4 bg-gray-900 p-4 rounded-xl border border-gray-800">
                                    <div className="text-4xl font-bold text-purple-400">{report.score}/10</div>
                                    <div className="text-gray-400 text-sm">Overall Performance Score</div>
                                </div>

                                {/* Feedback */}
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Feedback</h3>
                                    <p className="text-gray-300 leading-relaxed">{report.overall_feedback}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Strengths */}
                                    <div className="bg-green-900/10 border border-green-500/20 p-4 rounded-xl">
                                        <h3 className="text-green-400 font-semibold mb-3 flex items-center gap-2">✅ Strengths</h3>
                                        <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
                                            {report.strengths?.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Improvements */}
                                    <div className="bg-red-900/10 border border-red-500/20 p-4 rounded-xl">
                                        <h3 className="text-red-400 font-semibold mb-3 flex items-center gap-2">🚀 Improvements</h3>
                                        <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
                                            {report.improvements?.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="prose prose-invert max-w-none whitespace-pre-wrap text-gray-300">
                                {report}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow">

                {/* User Cam Area */}
                <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-[#009B4D]/20 overflow-hidden shadow-xl flex flex-col h-[400px] lg:h-auto">
                    <div className="absolute top-4 left-4 z-10 bg-black/50 px-3 py-1 rounded-full text-sm font-medium border border-white/10">
                        You {isListening && <span className="ml-2 text-red-500 animate-pulse">● REC</span>}
                    </div>

                    <div className="flex-grow flex items-center justify-center bg-black relative">
                        {webcamEnabled ? (
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                className="w-full h-full object-cover"
                                videoConstraints={{ facingMode: "user" }}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-gray-500 gap-2">
                                <VideoOff className="w-12 h-12" />
                                <p>Camera Off</p>
                            </div>
                        )}
                    </div>

                    {/* Controls Bar */}
                    <div className="p-4 bg-gradient-to-r from-[#FAF5E9] to-white border-t-2 border-[#009B4D]/10 flex justify-center gap-4">
                        <button
                            onClick={toggleWebcam}
                            className={`p-3 rounded-full transition-all ${webcamEnabled ? 'bg-[#009B4D] hover:bg-[#00C962] text-white' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'}`}
                        >
                            {webcamEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                        </button>
                        <button onClick={toggleMic} className={`p-3 rounded-full transition-all ${isListening ? 'bg-red-600 text-white animate-pulse' : 'bg-[#FFCC00] hover:bg-[#FFD633] text-gray-900'}`}>
                            {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* AI Area & Chat */}
                <div className="flex flex-col gap-6">

                    {/* AI Avatar Area */}
                    <div className="flex-grow bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-[#FFCC00]/30 p-6 flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden group min-h-[300px]">
                        <div className="absolute top-4 left-4 bg-[#009B4D]/10 text-[#009B4D] px-3 py-1 rounded-full text-sm font-bold border-2 border-[#009B4D]/30">
                            AI Interviewer
                        </div>

                        {/* Animated AI Interviewer Avatar */}
                        <div className="relative mb-6">
                            {/* Avatar Container with State-based Animations */}
                            <div className={`relative w-40 h-40 rounded-full overflow-hidden border-4 transition-all duration-500 ${interviewerState === 'speaking' ? 'border-[#009B4D] shadow-[0_0_40px_rgba(0,155,77,0.6)] scale-105' :
                                interviewerState === 'listening' ? 'border-[#FFCC00] shadow-[0_0_40px_rgba(255,204,0,0.6)] scale-102' :
                                    'border-[#009B4D]/30 shadow-lg scale-100'
                                }`}>
                                <img
                                    src="/ai_interviewer_avatar.png"
                                    alt="AI Interviewer"
                                    className={`w-full h-full object-cover transition-transform duration-300 ${interviewerState === 'speaking' ? 'animate-speaking' :
                                        interviewerState === 'listening' ? 'animate-listening' :
                                            'animate-idle'
                                        }`}
                                />

                                {/* Mouth Overlay for Realistic Lip Movement */}
                                {interviewerState === 'speaking' && (
                                    <div className="absolute bottom-[25%] left-0 right-0 h-[20%] mouth-overlay pointer-events-none">
                                        <div className="w-full h-full bg-gradient-to-b from-transparent via-black/5 to-transparent"></div>
                                    </div>
                                )}

                                {/* Speaking Indicator - Animated Rings */}
                                {interviewerState === 'speaking' && (
                                    <>
                                        <div className="absolute inset-0 rounded-full border-4 border-[#009B4D] animate-ping opacity-75"></div>
                                        <div className="absolute inset-0 rounded-full border-2 border-[#00C962] animate-pulse"></div>
                                    </>
                                )}

                                {/* Listening Indicator */}
                                {interviewerState === 'listening' && (
                                    <div className="absolute inset-0 rounded-full border-4 border-[#FFCC00] animate-pulse"></div>
                                )}
                            </div>

                            {/* Status Badge */}
                            <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ${interviewerState === 'speaking' ? 'bg-[#009B4D] text-white' :
                                interviewerState === 'listening' ? 'bg-[#FFCC00] text-gray-900' :
                                    'bg-gray-200 text-gray-600'
                                }`}>
                                {interviewerState === 'speaking' ? '🗣️ Speaking' :
                                    interviewerState === 'listening' ? '👂 Listening' :
                                        loading ? '🤔 Thinking' : '💼 Ready'}
                            </div>
                        </div>

                        <h3 className="text-xl font-semibold mb-2">
                            {isInterviewing ? (loading ? "Thinking..." : (isListening ? "I'm listening..." : "Your turn to speak")) : "Ready to start?"}
                        </h3>
                        <p className="text-gray-700 max-w-md mx-auto">
                            {aiResponse}
                        </p>
                        {errorMsg && <p className="text-red-500 text-sm mt-2 font-bold">{errorMsg}</p>}
                    </div>

                    {/* Transcript/Feedback Area */}
                    <div className="h-1/3 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-[#009B4D]/20 p-4 shadow-xl overflow-y-auto flex flex-col min-h-[200px]">
                        <h4 className="text-sm font-bold text-[#009B4D] uppercase tracking-wider mb-2">Conversation</h4>
                        <div className="flex-grow whitespace-pre-wrap text-gray-700 leading-relaxed font-mono text-sm mb-2 overflow-y-auto max-h-[150px]">
                            {transcript || "Start the interview to begin conversation..."}
                        </div>

                        {/* Manual Text Input */}
                        <form onSubmit={handleManualSubmit} className="flex gap-2 mt-auto">
                            <input
                                type="text"
                                value={currentResponse}
                                onChange={(e) => setCurrentResponse(e.target.value)}
                                placeholder="Type answer or use Mic..."
                                className="flex-grow bg-white border-2 border-[#009B4D]/20 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-[#009B4D]"
                                disabled={loading || !isInterviewing}
                            />
                            <button
                                type="submit"
                                className={`px-4 py-2 rounded-lg text-white font-bold transition-all ${loading || !isInterviewing ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-[#FFCC00] to-[#FFD633] text-gray-900 hover:shadow-lg'}`}
                                disabled={loading || !isInterviewing}
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Interview;
