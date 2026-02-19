import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Mic, Eye, User, Brain, ArrowRight, Play } from "lucide-react";
import Blackhole from "../assets/blackhole.webm";
import { Button } from "@/components/ui/button";
import TechMarquee from "../components/TechMarquee";

const Interviewee = "https://images.unsplash.com/photo-1607746882042-944635dfe10e";

const Hero = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState({
    speech: "Analyzing...",
    eye: "Analyzing...",
    posture: "Analyzing...",
    confidence: "Analyzing..."
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setFeedback({
        speech: "Clear and steady",
        eye: "Good eye contact",
        posture: "Straight posture",
        confidence: "Confident tone"
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full min-h-screen pt-32 pb-20 overflow-hidden bg-background">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none opacity-50" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-20">
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI-Powered Interview Coach</span>
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6 tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 perspective-1000">
            Master Your Interview <br />
            <span
              className="inline-block relative cursor-pointer transition-transform duration-500 hover:rotate-x-12 hover:rotate-y-12 hover:scale-110"
              style={{ transformStyle: "preserve-3d" }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500 drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]">
                Hire Pulse
              </span>
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Practice with our advanced AI, get real-time feedback on your speech, body language, and confidence, and land your dream job.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 mb-12">
            <Button size="lg" onClick={() => navigate("/register")} className="text-lg h-12 px-8 rounded-full shadow-xl shadow-primary/20">
              Try It for Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg h-12 px-8 rounded-full border-2 hover:bg-secondary/50">
              <Play className="mr-2 h-4 w-4 fill-current" /> Watch Demo
            </Button>
          </div>

          <div className="w-full animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            <TechMarquee />
          </div>
        </div>

        {/* Demo Interface */}
        <div className="w-full max-w-5xl mx-auto animate-in fade-in zoom-in duration-1000 delay-500">
          <div className="rounded-2xl overflow-hidden border border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl ring-1 ring-white/10 relative group">
            {/* Glow effect under the card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-purple-600/30 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />

            <div className="relative flex flex-col md:flex-row h-auto md:h-[500px]">
              {/* Main Video Area */}
              <div className="w-full md:w-3/4 relative bg-black/80">
                <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
                  <div className="bg-red-500/90 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" /> REC
                  </div>
                  <span className="text-white/80 text-sm font-medium backdrop-blur-sm px-2 py-0.5 rounded">Richard Gomez</span>
                </div>

                <div className="flex justify-center items-center h-full p-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full opacity-50 animate-pulse" />
                    <img
                      src={Interviewee}
                      alt="Interviewee"
                      className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-full border-4 border-primary/50 shadow-2xl relative z-10"
                    />
                  </div>
                </div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
                  <div className="p-2 rounded-full hover:bg-white/10 cursor-pointer transition text-white/70 hover:text-white"><Mic size={20} /></div>
                  <div className="p-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer text-white shadow-lg shadow-red-500/30"><Play size={20} className="fill-current ml-0.5" /></div>
                  <div className="p-2 rounded-full hover:bg-white/10 cursor-pointer transition text-white/70 hover:text-white"><Eye size={20} /></div>
                </div>
              </div>

              {/* Sidebar Analysis */}
              <div className="w-full md:w-1/4 bg-card/80 border-l border-border/50 p-6 flex flex-col gap-5 backdrop-blur-sm">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">Live Analysis</h3>

                {[
                  { icon: Mic, label: "Speech", value: feedback.speech, color: "text-green-500" },
                  { icon: Eye, label: "Eye Contact", value: feedback.eye, color: "text-blue-500" },
                  { icon: User, label: "Posture", value: feedback.posture, color: "text-purple-500" },
                  { icon: Brain, label: "Confidence", value: feedback.confidence, color: "text-orange-500" }
                ].map((item, index) => (
                  <div key={index} className="space-y-1.5 p-3 rounded-lg bg-secondary/50 border border-border/50 transition hover:bg-secondary">
                    <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                      <span className="flex items-center gap-1.5"><item.icon size={13} /> {item.label}</span>
                    </div>
                    <div className={`text-sm font-semibold ${item.color} truncate`}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
