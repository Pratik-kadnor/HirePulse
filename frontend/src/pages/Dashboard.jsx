import React from "react";

export default function Dashboard() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF5E9] via-[#FFF8E7] to-[#FAF5E9] p-6 space-y-6">
      {/* Header */}
      <h1 className="text-3xl font-bold bg-gradient-to-r from-[#009B4D] to-[#00C962] bg-clip-text text-transparent drop-shadow-sm">
        👋 Welcome, Pratik!
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Resume Score" value="82%" />
        <StatCard title="Interviews Given" value="5" />
        <StatCard title="Past Interview Score" value="74%" />
        <StatCard title="Courses Completed" value="3" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* AI Interview */}
        <div className="bg-white/80 backdrop-blur-sm border-2 border-[#009B4D]/20 p-6 rounded-2xl shadow-xl hover:shadow-2xl hover:border-[#009B4D]/40 transition-all duration-300 col-span-2 group">
          <h2 className="text-2xl font-bold mb-3 text-[#009B4D] flex items-center gap-2">
            🤖 AI Interview
          </h2>
          <p className="text-gray-700 mb-4">
            Your last score: <span className="font-bold text-[#FFCC00] text-xl">74%</span>
          </p>
          <button className="bg-gradient-to-r from-[#009B4D] to-[#00C962] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
            Start Mock Interview
          </button>
        </div>

        {/* Calendar */}
        <div className="bg-white/80 backdrop-blur-sm border-2 border-[#FFCC00]/30 p-6 rounded-2xl shadow-xl hover:shadow-2xl hover:border-[#FFCC00]/50 transition-all duration-300">
          <h2 className="text-xl font-bold mb-3 text-[#009B4D]">🗓️ Calendar</h2>
          <p className="text-gray-600 text-sm">Mini calendar or upcoming deadlines will appear here.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Course Recommendations */}
        <div className="bg-white/80 backdrop-blur-sm border-2 border-[#009B4D]/20 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 col-span-2">
          <h2 className="text-2xl font-bold mb-6 text-[#009B4D] flex items-center gap-2">
            📚 Course Recommendations
          </h2>
          <ul className="space-y-4">
            {["DSA Mastery", "System Design Basics", "Resume Writing Workshop", "Mock Interview Bootcamp"].map((course, i) => (
              <li key={i} className="flex items-center justify-between border-b-2 border-[#FAF5E9] pb-3 hover:border-[#FFCC00]/30 transition-colors">
                <span className="text-gray-800 font-medium">{course}</span>
                <button className="text-sm bg-gradient-to-r from-[#FFCC00] to-[#FFD633] text-gray-900 px-4 py-2 rounded-lg font-semibold hover:shadow-md hover:scale-105 transition-all duration-200">
                  Enroll
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Todo List */}
        <div className="bg-white/80 backdrop-blur-sm border-2 border-[#FFCC00]/30 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
          <h2 className="text-xl font-bold mb-4 text-[#009B4D]">✅ Todo</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center gap-2 hover:text-[#009B4D] transition-colors cursor-pointer">
              <span className="text-lg">📄</span> Update Resume
            </li>
            <li className="flex items-center gap-2 hover:text-[#009B4D] transition-colors cursor-pointer">
              <span className="text-lg">🎯</span> Practice 2 DSA problems
            </li>
            <li className="flex items-center gap-2 hover:text-[#009B4D] transition-colors cursor-pointer">
              <span className="text-lg">🎙️</span> Attempt Mock Interview
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-gradient-to-br from-white to-[#FAF5E9] border-2 border-[#009B4D]/20 p-6 rounded-2xl shadow-lg hover:shadow-xl hover:border-[#009B4D]/40 transition-all duration-300 text-center group">
      <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">{title}</h3>
      <p className="text-4xl font-bold bg-gradient-to-r from-[#009B4D] to-[#FFCC00] bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">{value}</p>
    </div>
  );
}