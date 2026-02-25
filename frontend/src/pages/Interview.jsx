import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { Mic, MicOff, Video, VideoOff, Play, Square, Send, FileText } from "lucide-react";

const Interview = () => {
    const [isInterviewing, setIsInterviewing] = useState(false);
    const [webcamEnabled, setWebcamEnabled] = useState(true); // always attempt to show camera
    const [camPermission, setCamPermission] = useState("pending"); // pending | granted | denied
    const [transcript, setTranscript] = useState("");
    const [currentResponse, setCurrentResponse] = useState("");
    const [aiResponse, setAiResponse] = useState("AI interviewer is ready.");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [conversationHistory, setConversationHistory] = useState([]);
    const [report, setReport] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const [interviewerState, setInterviewerState] = useState("idle");

    const webcamRef = useRef(null);
    const recognitionRef = useRef(null);

    // On unmount: stop all camera tracks so the browser clears its stream reference.
    // This causes the permission prompt to appear again on the NEXT visit.
    useEffect(() => {
        return () => {
            // Stop webcam stream cleanly when leaving the page
            if (webcamRef.current && webcamRef.current.stream) {
                webcamRef.current.stream.getTracks().forEach(t => t.stop());
            }
        };
    }, []);

    // react-webcam permission callbacks
    const handleUserMedia = () => {
        setCamPermission("granted");
        setErrorMsg(""); // clear any previous error
    };

    const handleUserMediaError = (err) => {
        console.warn("Camera error:", err);
        setCamPermission("denied");
        setWebcamEnabled(false);
    };

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const lastResult = event.results[event.results.length - 1];
                if (lastResult.isFinal) {
                    const text = lastResult[0].transcript;
                    setCurrentResponse(text);
                    handleUserSubmit(text);
                }
            };
            recognitionRef.current.onerror = (event) => {
                if (event.error === 'not-allowed') { setErrorMsg("Mic access denied."); setIsListening(false); }
            };
            recognitionRef.current.onend = () => { setIsListening(false); };
        }
    }, []);

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            try { recognitionRef.current.start(); setIsListening(true); setInterviewerState("listening"); setErrorMsg(""); } catch (e) { console.error(e); }
        }
    };
    const stopListening = () => {
        if (recognitionRef.current) { recognitionRef.current.stop(); setIsListening(false); if (interviewerState === "listening") setInterviewerState("idle"); }
    };

    const startInterview = () => {
        setIsInterviewing(true); setReport(null); setConversationHistory([]);
        setTranscript(""); setErrorMsg("");
        const opening = "Hello! I'm your AI interviewer today. Tell me about yourself and your background.";
        setAiResponse(opening);
        speak(opening);
    };

    const stopInterview = async () => {
        setIsInterviewing(false); stopListening();
        if (conversationHistory.length === 0) { setErrorMsg("No conversation to analyze. Speak first!"); return; }
        setAiResponse("Generating your feedback report… please wait.");
        setErrorMsg("");
        try {
            const historyText = conversationHistory.map(idx => `${idx.role}: ${idx.content}`).join("\n");
            const response = await fetch(`http://127.0.0.1:8000/interview/report`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ conversation: historyText })
            });
            if (!response.ok) throw new Error(`Server error ${response.status}`);
            const data = await response.json();
            if (data.report) {
                setReport(data.report);
                setAiResponse("Report ready! Click to view your feedback.");
            } else if (data.error) {
                setErrorMsg(`Report Error: ${data.error}`);
            }
        } catch (e) {
            console.error(e);
            setErrorMsg("Could not connect to report server. Is the Python backend running?");
        }
    };

    const toggleWebcam = () => setWebcamEnabled(!webcamEnabled);
    const toggleMic = () => { if (isListening) stopListening(); else startListening(); };

    const handleUserSubmit = async (text) => {
        if (!text.trim()) return;
        setConversationHistory(prev => [...prev, { role: "User", content: text }]);
        setTranscript(prev => prev + "\nYou: " + text);
        setCurrentResponse(""); setLoading(true); setErrorMsg(""); stopListening();
        try {
            const response = await fetch(`http://127.0.0.1:8000/interview/chat`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text })
            });
            if (!response.ok) throw new Error(`Server error ${response.status}`);
            const data = await response.json();

            // data.response is always set by the backend now (even on fallback)
            const aiText = data.response ||
                "Thank you for your answer. Could you elaborate a bit more on that?";

            setAiResponse(aiText);
            setTranscript(prev => prev + "\nAI: " + aiText);
            setConversationHistory(prev => [...prev, { role: "AI", content: aiText }]);
            // Show subtle note if backend used a local fallback
            if (data.fallback) {
                setErrorMsg("(AI quota busy – using backup question)");
                setTimeout(() => setErrorMsg(""), 4000);
            }
            speak(aiText);
        } catch (error) {
            console.error("Interview chat error:", error);
            // Use a local recovery message so the interview doesn't stall
            const recovery = "Could you please repeat or expand on your last answer?";
            setAiResponse(recovery);
            setTranscript(prev => prev + "\nAI: " + recovery);
            setConversationHistory(prev => [...prev, { role: "AI", content: recovery }]);
            speak(recovery);
            setErrorMsg("(Network hiccup – continuing)");
            setTimeout(() => setErrorMsg(""), 3000);
        } finally { setLoading(false); }
    };

    const handleManualSubmit = (e) => { e.preventDefault(); handleUserSubmit(currentResponse); };

    const speak = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onstart = () => setInterviewerState("speaking");
            utterance.onend = () => setInterviewerState("idle");
            window.speechSynthesis.speak(utterance);
        }
    };

    const stateColor = interviewerState === 'speaking' ? '#8b5cf6' : interviewerState === 'listening' ? '#06b6d4' : '#4f46e5';
    const stateLabel = interviewerState === 'speaking' ? '🗣️ Speaking' : interviewerState === 'listening' ? '👂 Listening' : loading ? '🤔 Thinking' : '💼 Ready';

    return (
        <div className="min-h-screen text-white p-6 flex flex-col gap-6 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #050818 0%, #0a0f2e 50%, #06081a 100%)" }}>

            {/* Ambient glows */}
            <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)" }} />
            <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)" }} />

            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg,#8b5cf6,#06b6d4)", boxShadow: "0 0 20px rgba(139,92,246,0.5)" }}>
                        🤖
                    </div>
                    <h1 className="text-3xl font-extrabold"
                        style={{ background: "linear-gradient(90deg,#a78bfa,#06b6d4)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        AI Mock Interview
                    </h1>
                </div>
                <div className="flex gap-3">
                    {!isInterviewing ? (
                        <button onClick={startInterview}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105"
                            style={{ background: "linear-gradient(135deg,#8b5cf6,#06b6d4)", boxShadow: "0 4px 20px rgba(139,92,246,0.45)" }}>
                            <Play className="w-4 h-4" /> Start Interview
                        </button>
                    ) : (
                        <button onClick={stopInterview}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105"
                            style={{ background: "linear-gradient(135deg,#ef4444,#b91c1c)", boxShadow: "0 4px 20px rgba(239,68,68,0.4)" }}>
                            <Square className="w-4 h-4" /> End & Get Report
                        </button>
                    )}
                </div>
            </div>

            {/* Report Modal */}
            {report && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(5,8,24,0.92)", backdropFilter: "blur(8px)" }}>
                    <div className="rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                        style={{ background: "linear-gradient(135deg,#0f1035,#0a0f2e)", border: "1px solid rgba(139,92,246,0.4)", boxShadow: "0 0 60px rgba(139,92,246,0.2)" }}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <FileText style={{ color: "#a78bfa" }} /> Interview Analysis
                            </h2>
                            <button onClick={() => setReport(null)}
                                className="px-3 py-1 rounded-lg text-slate-400 hover:text-white transition-colors"
                                style={{ background: "rgba(255,255,255,0.06)" }}>
                                Close
                            </button>
                        </div>
                        {typeof report === 'object' ? (
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 p-4 rounded-xl"
                                    style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)" }}>
                                    <div className="text-4xl font-bold"
                                        style={{ background: "linear-gradient(90deg,#a78bfa,#06b6d4)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                        {report.score}/10
                                    </div>
                                    <div className="text-slate-400 text-sm">Overall Performance Score</div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Feedback</h3>
                                    <p className="text-slate-300 leading-relaxed">{report.overall_feedback}</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-4 rounded-xl" style={{ background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.2)" }}>
                                        <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: "#22d3ee" }}>✅ Strengths</h3>
                                        <ul className="list-disc list-inside text-slate-300 space-y-1 text-sm">
                                            {report.strengths?.map((item, i) => <li key={i}>{item}</li>)}
                                        </ul>
                                    </div>
                                    <div className="p-4 rounded-xl" style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.2)" }}>
                                        <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: "#a78bfa" }}>🚀 Improvements</h3>
                                        <ul className="list-disc list-inside text-slate-300 space-y-1 text-sm">
                                            {report.improvements?.map((item, i) => <li key={i}>{item}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="whitespace-pre-wrap text-slate-300">{report}</div>
                        )}
                    </div>
                </div>
            )}

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow">
                {/* User Cam */}
                <div className="relative rounded-2xl overflow-hidden flex flex-col h-[400px] lg:h-auto"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(139,92,246,0.25)", backdropFilter: "blur(12px)" }}>
                    <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-sm font-semibold"
                        style={{ background: "rgba(5,8,24,0.7)", border: "1px solid rgba(139,92,246,0.3)", color: "#a78bfa" }}>
                        You {isListening && <span className="ml-2 animate-pulse" style={{ color: "#22d3ee" }}>● REC</span>}
                    </div>
                    <div className="flex-grow flex items-center justify-center bg-black relative">
                        {webcamEnabled ? (
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                className="w-full h-full object-cover"
                                videoConstraints={{ facingMode: "user" }}
                                onUserMedia={handleUserMedia}
                                onUserMediaError={handleUserMediaError}
                            />
                        ) : camPermission === "denied" ? (
                            <div className="flex flex-col items-center justify-center gap-4 p-6 text-center">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center"
                                    style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.3)" }}>
                                    <VideoOff className="w-8 h-8" style={{ color: "#a78bfa" }} />
                                </div>
                                <div>
                                    <p className="text-white font-semibold mb-1">Camera Blocked</p>
                                    <p className="text-slate-500 text-xs leading-relaxed max-w-[220px]">
                                        Click the 🔒 lock icon in your browser's address bar → Site settings → Camera → Allow
                                    </p>
                                </div>
                                <button
                                    onClick={() => { setCamPermission("pending"); setWebcamEnabled(true); }}
                                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105"
                                    style={{ background: "linear-gradient(135deg,#8b5cf6,#06b6d4)", boxShadow: "0 2px 12px rgba(139,92,246,0.4)" }}>
                                    🔄 Retry Camera
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-2" style={{ color: "#4f46e5" }}>
                                <VideoOff className="w-12 h-12" />
                                <p className="text-slate-500">Camera Off</p>
                            </div>
                        )}
                    </div>
                    {/* Controls */}
                    <div className="p-4 flex justify-center gap-4"
                        style={{ background: "rgba(5,8,24,0.6)", borderTop: "1px solid rgba(139,92,246,0.15)" }}>
                        <button onClick={toggleWebcam}
                            className="p-3 rounded-full transition-all duration-200 hover:scale-110"
                            style={webcamEnabled
                                ? { background: "linear-gradient(135deg,#8b5cf6,#06b6d4)", boxShadow: "0 0 14px rgba(139,92,246,0.5)" }
                                : { background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}>
                            {webcamEnabled ? <Video className="w-5 h-5 text-white" /> : <VideoOff className="w-5 h-5" />}
                        </button>
                        <button onClick={toggleMic}
                            className="p-3 rounded-full transition-all duration-200 hover:scale-110"
                            style={isListening
                                ? { background: "linear-gradient(135deg,#22d3ee,#06b6d4)", boxShadow: "0 0 14px rgba(6,182,212,0.5)", animation: "pulse 1s infinite" }
                                : { background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)" }}>
                            {isListening ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5" style={{ color: "#a78bfa" }} />}
                        </button>
                    </div>
                </div>

                {/* AI Area */}
                <div className="flex flex-col gap-5">
                    {/* AI Avatar */}
                    <div className="flex-grow rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[300px]"
                        style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${stateColor}40`, backdropFilter: "blur(12px)", boxShadow: `0 0 40px ${stateColor}15` }}>
                        <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold"
                            style={{ background: "rgba(139,92,246,0.15)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.3)" }}>
                            AI Interviewer
                        </div>
                        <div className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
                            style={{ background: `radial-gradient(circle, ${stateColor}20, transparent 70%)` }} />

                        {/* Avatar */}
                        <div className="relative mb-6">
                            <div className={`relative w-40 h-40 rounded-full overflow-hidden border-4 transition-all duration-500`}
                                style={{ borderColor: stateColor, boxShadow: `0 0 40px ${stateColor}60`, transform: interviewerState === 'speaking' ? 'scale(1.05)' : 'scale(1)' }}>
                                <img src="/ai_interviewer_avatar.png" alt="AI Interviewer"
                                    className={`w-full h-full object-cover ${interviewerState === 'speaking' ? 'animate-speaking' : interviewerState === 'listening' ? 'animate-listening' : 'animate-idle'}`} />
                                {interviewerState === 'speaking' && (
                                    <>
                                        <div className="absolute inset-0 rounded-full border-4 animate-ping opacity-50" style={{ borderColor: "#8b5cf6" }} />
                                        <div className="absolute inset-0 rounded-full border-2 animate-pulse" style={{ borderColor: "#06b6d4" }} />
                                    </>
                                )}
                                {interviewerState === 'listening' && (
                                    <div className="absolute inset-0 rounded-full border-4 animate-pulse" style={{ borderColor: "#06b6d4" }} />
                                )}
                            </div>
                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap"
                                style={{ background: `linear-gradient(135deg,${stateColor},${stateColor}bb)`, color: "white", boxShadow: `0 0 10px ${stateColor}50` }}>
                                {stateLabel}
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">
                            {isInterviewing ? (loading ? "Thinking..." : isListening ? "I'm listening..." : "Your turn to speak") : "Ready to start?"}
                        </h3>
                        <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed">{aiResponse}</p>
                        {errorMsg && <p className="text-red-400 text-sm mt-2 font-semibold">{errorMsg}</p>}
                    </div>

                    {/* Transcript */}
                    <div className="rounded-2xl p-4 flex flex-col min-h-[200px]"
                        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(6,182,212,0.2)", backdropFilter: "blur(12px)" }}>
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#22d3ee" }}>Conversation</h4>
                        <div className="flex-grow whitespace-pre-wrap text-slate-400 leading-relaxed font-mono text-xs mb-3 overflow-y-auto max-h-[150px]">
                            {transcript || "Start the interview to begin the conversation..."}
                        </div>
                        <form onSubmit={handleManualSubmit} className="flex gap-2 mt-auto">
                            <input type="text" value={currentResponse} onChange={(e) => setCurrentResponse(e.target.value)}
                                placeholder="Type answer or use Mic..."
                                className="flex-grow px-3 py-2 rounded-lg text-white text-sm focus:outline-none transition-all"
                                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(139,92,246,0.25)", color: "white" }}
                                disabled={loading || !isInterviewing} />
                            <button type="submit"
                                className="px-4 py-2 rounded-lg font-bold text-white transition-all duration-200 hover:scale-105"
                                style={loading || !isInterviewing
                                    ? { background: "rgba(255,255,255,0.05)", cursor: "not-allowed" }
                                    : { background: "linear-gradient(135deg,#8b5cf6,#06b6d4)", boxShadow: "0 2px 12px rgba(139,92,246,0.4)" }}
                                disabled={loading || !isInterviewing}>
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
