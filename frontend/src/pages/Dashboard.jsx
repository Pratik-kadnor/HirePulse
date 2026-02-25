import React, { useState } from "react";
import { useUser } from "@/context/UserContext";

export default function Dashboard() {
  const { user } = useUser();
  const firstName = user?.name?.split(" ")[0] || "Student";

  return (
    <div className="min-h-screen p-6 space-y-6 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #050818 0%, #0a0f2e 50%, #06081a 100%)" }}>

      {/* Ambient glow blobs */}
      <div className="fixed top-[-80px] right-[-80px] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)" }} />
      <div className="fixed bottom-[-100px] left-[-100px] w-[450px] h-[450px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)" }} />
      <div className="fixed top-1/2 left-1/2 w-[600px] h-[600px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{ background: "radial-gradient(circle, rgba(79,70,229,0.06) 0%, transparent 70%)" }} />

      {/* Header */}
      <div className="relative flex items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #06b6d4)", boxShadow: "0 0 20px rgba(139,92,246,0.5)" }}>
            👋
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-extrabold"
            style={{ background: "linear-gradient(90deg, #a78bfa, #06b6d4, #818cf8)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Welcome back, {firstName}!
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Here's your performance overview today ✨</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: "Resume Score", value: "82%", icon: "📄", from: "#8b5cf6", to: "#6366f1" },
          { title: "Interviews Given", value: "5", icon: "🎙️", from: "#06b6d4", to: "#0891b2" },
          { title: "Past Interview Score", value: "74%", icon: "📊", from: "#a78bfa", to: "#8b5cf6" },
          { title: "Courses Completed", value: "3", icon: "🎓", from: "#22d3ee", to: "#06b6d4" },
        ].map((card, i) => (
          <div key={i} className="p-6 rounded-2xl text-center group hover:scale-[1.04] transition-all duration-300 relative overflow-hidden cursor-default"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.2)", backdropFilter: "blur(12px)" }}>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: `radial-gradient(circle at top, rgba(139,92,246,0.1), transparent 60%)` }} />
            <span className="text-2xl mb-2 block">{card.icon}</span>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">{card.title}</h3>
            <p className="text-4xl font-extrabold"
              style={{ background: `linear-gradient(135deg, ${card.from}, ${card.to})`, backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* AI Interview */}
        <div className="col-span-2 p-6 rounded-2xl relative overflow-hidden group cursor-pointer"
          style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(6,182,212,0.06))", border: "1px solid rgba(139,92,246,0.25)", backdropFilter: "blur(12px)" }}>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(6,182,212,0.08))" }} />
          {/* Decorative corner lines */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10"
            style={{ background: "radial-gradient(circle, #06b6d4, transparent 70%)" }} />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                style={{ background: "linear-gradient(135deg, #8b5cf6, #06b6d4)", boxShadow: "0 0 16px rgba(139,92,246,0.5)" }}>🤖</div>
              <h2 className="text-2xl font-bold text-white">AI Interview</h2>
              <span className="ml-auto text-xs px-2.5 py-1 rounded-full font-semibold"
                style={{ background: "rgba(6,182,212,0.15)", color: "#22d3ee", border: "1px solid rgba(6,182,212,0.3)" }}>
                ● Live
              </span>
            </div>
            <p className="text-slate-400 mb-5">Your last score:{" "}
              <span className="font-bold text-xl" style={{ background: "linear-gradient(90deg,#a78bfa,#06b6d4)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>74%</span>
            </p>
            <button className="px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105"
              style={{ background: "linear-gradient(135deg, #8b5cf6, #06b6d4)", boxShadow: "0 4px 24px rgba(139,92,246,0.45)" }}>
              🚀 Start Mock Interview
            </button>
          </div>
        </div>

        {/* Calendar */}
        <div className="p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(6,182,212,0.2)", backdropFilter: "blur(12px)" }}>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
            <span style={{ color: "#22d3ee" }}>🗓️</span> Calendar
          </h2>
          <div className="space-y-2">
            {["Mock Interview — Today 3PM", "Resume Submit — Tomorrow", "DSA Practice — Ongoing"].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-400 rounded-lg px-3 py-2.5"
                style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.15)" }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#8b5cf6", boxShadow: "0 0 6px #8b5cf6" }} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Course Recommendations */}
        <div className="col-span-2 p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.2)", backdropFilter: "blur(12px)" }}>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
            <span style={{ color: "#a78bfa" }}>📚</span> Course Recommendations
          </h2>
          <ul className="space-y-3">
            {["DSA Mastery", "System Design Basics", "Resume Writing Workshop", "Mock Interview Bootcamp"].map((course, i) => (
              <li key={i} className="flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-200 group/item"
                style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.15)" }}>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full" style={{ background: "linear-gradient(135deg,#8b5cf6,#06b6d4)", boxShadow: "0 0 6px #8b5cf6" }} />
                  <span className="text-slate-300 font-medium group-hover/item:text-white transition-colors">{course}</span>
                </div>
                <button className="text-sm px-4 py-1.5 rounded-lg font-semibold text-white transition-all duration-200 hover:scale-105"
                  style={{ background: "linear-gradient(135deg,#8b5cf6,#6366f1)", boxShadow: "0 2px 12px rgba(139,92,246,0.35)" }}>
                  Enroll
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Todo List */}
        <div className="p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(6,182,212,0.2)", backdropFilter: "blur(12px)" }}>
          <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
            <span style={{ color: "#22d3ee" }}>✅</span> Todo
          </h2>
          <ul className="space-y-3">
            {[{ icon: "📄", text: "Update Resume" }, { icon: "🎯", text: "Practice 2 DSA problems" }, { icon: "🎙️", text: "Attempt Mock Interview" }].map((item, i) => (
              <li key={i} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 group/todo"
                style={{ background: "rgba(6,182,212,0.05)", border: "1px solid rgba(6,182,212,0.15)" }}>
                <span className="text-lg">{item.icon}</span>
                <span className="text-slate-400 group-hover/todo:text-white transition-colors text-sm">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}