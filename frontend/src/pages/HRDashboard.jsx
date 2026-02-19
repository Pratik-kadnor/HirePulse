import React from "react";
import { Users, Calendar, FileText, TrendingUp, Briefcase, UserCheck } from "lucide-react";

export default function HRDashboard() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] p-6 space-y-6">
            {/* Header */}
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent drop-shadow-sm">
                👔 HR Dashboard
            </h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Total Candidates" value="142" icon={<Users className="w-6 h-6" />} />
                <StatCard title="Active Interviews" value="23" icon={<Calendar className="w-6 h-6" />} />
                <StatCard title="Job Postings" value="8" icon={<Briefcase className="w-6 h-6" />} />
                <StatCard title="Hired This Month" value="12" icon={<UserCheck className="w-6 h-6" />} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Recent Candidates */}
                <div className="bg-white/10 backdrop-blur-sm border-2 border-blue-500/20 p-6 rounded-2xl shadow-xl hover:shadow-2xl hover:border-blue-500/40 transition-all duration-300 col-span-2 group">
                    <h2 className="text-2xl font-bold mb-3 text-blue-400 flex items-center gap-2">
                        <Users className="w-6 h-6" />
                        Recent Candidates
                    </h2>
                    <div className="space-y-3">
                        {[
                            { name: "John Doe", position: "Software Engineer", score: "85%", status: "Pending" },
                            { name: "Jane Smith", position: "Product Manager", score: "92%", status: "Interview Scheduled" },
                            { name: "Mike Johnson", position: "Data Analyst", score: "78%", status: "Under Review" },
                            { name: "Sarah Williams", position: "UX Designer", score: "88%", status: "Shortlisted" }
                        ].map((candidate, i) => (
                            <div key={i} className="bg-white/5 p-4 rounded-lg border border-white/10 hover:border-blue-500/30 transition-all">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-white font-semibold">{candidate.name}</h3>
                                        <p className="text-gray-400 text-sm">{candidate.position}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-blue-400 font-bold">{candidate.score}</p>
                                        <p className="text-gray-400 text-xs">{candidate.status}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white/10 backdrop-blur-sm border-2 border-indigo-500/30 p-6 rounded-2xl shadow-xl hover:shadow-2xl hover:border-indigo-500/50 transition-all duration-300">
                    <h2 className="text-xl font-bold mb-3 text-indigo-400">⚡ Quick Actions</h2>
                    <div className="space-y-3">
                        <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
                            Post New Job
                        </button>
                        <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
                            Schedule Interview
                        </button>
                        <button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
                            View Analytics
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Upcoming Interviews */}
                <div className="bg-white/10 backdrop-blur-sm border-2 border-blue-500/20 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
                    <h2 className="text-2xl font-bold mb-6 text-blue-400 flex items-center gap-2">
                        <Calendar className="w-6 h-6" />
                        Upcoming Interviews
                    </h2>
                    <ul className="space-y-4">
                        {[
                            { candidate: "Alice Brown", position: "Frontend Developer", time: "Today, 2:00 PM" },
                            { candidate: "Bob Wilson", position: "Backend Engineer", time: "Tomorrow, 10:00 AM" },
                            { candidate: "Carol Davis", position: "DevOps Engineer", time: "Feb 18, 3:00 PM" }
                        ].map((interview, i) => (
                            <li key={i} className="flex items-center justify-between border-b-2 border-white/10 pb-3 hover:border-blue-500/30 transition-colors">
                                <div>
                                    <span className="text-white font-medium block">{interview.candidate}</span>
                                    <span className="text-gray-400 text-sm">{interview.position}</span>
                                </div>
                                <span className="text-blue-400 text-sm font-semibold">{interview.time}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Performance Metrics */}
                <div className="bg-white/10 backdrop-blur-sm border-2 border-indigo-500/30 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
                    <h2 className="text-xl font-bold mb-4 text-indigo-400 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6" />
                        Performance Metrics
                    </h2>
                    <div className="space-y-4">
                        <MetricBar label="Candidate Quality" percentage={85} color="blue" />
                        <MetricBar label="Interview Success Rate" percentage={72} color="indigo" />
                        <MetricBar label="Time to Hire" percentage={68} color="purple" />
                        <MetricBar label="Offer Acceptance Rate" percentage={91} color="pink" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon }) {
    return (
        <div className="bg-gradient-to-br from-white/10 to-white/5 border-2 border-blue-500/20 p-6 rounded-2xl shadow-lg hover:shadow-xl hover:border-blue-500/40 transition-all duration-300 text-center group">
            <div className="flex justify-center mb-2 text-blue-400 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">{title}</h3>
            <p className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">{value}</p>
        </div>
    );
}

function MetricBar({ label, percentage, color }) {
    const colorClasses = {
        blue: "from-blue-500 to-blue-600",
        indigo: "from-indigo-500 to-indigo-600",
        purple: "from-purple-500 to-purple-600",
        pink: "from-pink-500 to-pink-600"
    };

    return (
        <div>
            <div className="flex justify-between mb-1">
                <span className="text-gray-300 text-sm">{label}</span>
                <span className="text-gray-300 text-sm font-semibold">{percentage}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2.5">
                <div
                    className={`bg-gradient-to-r ${colorClasses[color]} h-2.5 rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
}
