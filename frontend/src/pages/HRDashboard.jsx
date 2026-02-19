import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import {
    Users, Calendar, FileText, TrendingUp, Briefcase, UserCheck,
    X, MapPin, DollarSign, Clock, ChevronDown, BarChart2, PieChart,
    CheckCircle, AlertCircle, Activity, Target
} from "lucide-react";

/* ─────────────────────────────────────────────
   MOCK DATA
   ───────────────────────────────────────────── */
const CANDIDATES = [
    { id: 1, name: "Pratik Kadnor", position: "Software Engineer", score: "85%", status: "Pending" },
    { id: 2, name: "Neel Malpure", position: "Product Manager", score: "92%", status: "Interview Scheduled" },
    { id: 3, name: "Abhijeet Sawant", position: "Data Analyst", score: "78%", status: "Under Review" },
    { id: 4, name: "Sarah Williams", position: "UX Designer", score: "88%", status: "Shortlisted" },
    { id: 5, name: "Alice Brown", position: "Frontend Developer", score: "80%", status: "Pending" },
    { id: 6, name: "Bob Wilson", position: "Backend Engineer", score: "74%", status: "Under Review" },
];

const TIME_SLOTS = [
    "09:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "02:00 PM", "03:00 PM",
    "04:00 PM", "05:00 PM",
];

const analyticsData = {
    funnel: [
        { stage: "Applications Received", count: 248, color: "from-blue-500 to-blue-600" },
        { stage: "Screened", count: 142, color: "from-indigo-500 to-indigo-600" },
        { stage: "Interviews Scheduled", count: 56, color: "from-purple-500 to-purple-600" },
        { stage: "Offers Extended", count: 18, color: "from-pink-500 to-pink-600" },
        { stage: "Hired", count: 12, color: "from-rose-500 to-rose-600" },
    ],
    departments: [
        { name: "Engineering", hired: 5, open: 3 },
        { name: "Product", hired: 2, open: 2 },
        { name: "Design", hired: 2, open: 1 },
        { name: "Data", hired: 2, open: 2 },
        { name: "DevOps", hired: 1, open: 1 },
    ],
    monthly: [
        { month: "Sep", hires: 4 }, { month: "Oct", hires: 7 },
        { month: "Nov", hires: 5 }, { month: "Dec", hires: 3 },
        { month: "Jan", hires: 9 }, { month: "Feb", hires: 12 },
    ],
    metrics: [
        { label: "Avg. Days to Hire", value: "18 days", icon: <Clock className="w-5 h-5" />, color: "text-blue-400" },
        { label: "Offer Acceptance Rate", value: "91%", icon: <CheckCircle className="w-5 h-5" />, color: "text-green-400" },
        { label: "Interview Pass Rate", value: "72%", icon: <Target className="w-5 h-5" />, color: "text-indigo-400" },
        { label: "Active Job Postings", value: "8", icon: <Briefcase className="w-5 h-5" />, color: "text-purple-400" },
    ],
};

/* ─────────────────────────────────────────────
   MODAL WRAPPER
   ───────────────────────────────────────────── */
function Modal({ title, onClose, children }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-blue-500/30 rounded-2xl shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-white/10 bg-[#1a1a2e]/80 backdrop-blur-sm rounded-t-2xl">
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   INPUT COMPONENTS
   ───────────────────────────────────────────── */
function InputField({ label, icon, type = "text", value, onChange, placeholder, required }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
                {label} {required && <span className="text-red-400">*</span>}
            </label>
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all ${icon ? "pl-10" : ""}`}
                />
            </div>
        </div>
    );
}

function SelectField({ label, value, onChange, options, icon, required }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
                {label} {required && <span className="text-red-400">*</span>}
            </label>
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
                )}
                <select
                    value={value}
                    onChange={onChange}
                    className={`w-full appearance-none bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500/60 transition-all ${icon ? "pl-10" : ""}`}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-[#1a1a2e]">
                            {opt.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   POST JOB MODAL
   ───────────────────────────────────────────── */
function PostJobModal({ onClose }) {
    const [form, setForm] = useState({
        title: "", department: "", location: "", locationType: "hybrid",
        ctcMin: "", ctcMax: "", experience: "", jobType: "full-time",
        openings: "1", skills: "", description: "", deadline: "",
    });
    const [submitted, setSubmitted] = useState(false);

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <Modal title="✅ Job Posted Successfully" onClose={onClose}>
                <div className="text-center py-10 space-y-4">
                    <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{form.title}</h3>
                    <p className="text-gray-400">{form.department} · {form.location}</p>
                    <p className="text-green-400 font-semibold">
                        ₹{form.ctcMin}L – ₹{form.ctcMax}L · {form.openings} Opening(s)
                    </p>
                    <button
                        onClick={onClose}
                        className="mt-4 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg text-white font-semibold hover:scale-105 transition-all"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </Modal>
        );
    }

    return (
        <Modal title="📢 Post a New Job" onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                        <InputField label="Job Title" required icon={<Briefcase className="w-4 h-4" />}
                            value={form.title} onChange={set("title")} placeholder="e.g. Senior Software Engineer" />
                    </div>
                    <InputField label="Department" required value={form.department} onChange={set("department")} placeholder="e.g. Engineering" />
                    <InputField label="Location" required icon={<MapPin className="w-4 h-4" />}
                        value={form.location} onChange={set("location")} placeholder="e.g. Bangalore, India" />
                    <SelectField label="Work Type" required value={form.locationType} onChange={set("locationType")} options={[
                        { value: "onsite", label: "On-site" },
                        { value: "remote", label: "Remote" },
                        { value: "hybrid", label: "Hybrid" },
                    ]} />
                    <SelectField label="Job Type" required value={form.jobType} onChange={set("jobType")} options={[
                        { value: "full-time", label: "Full-time" },
                        { value: "part-time", label: "Part-time" },
                        { value: "contract", label: "Contract" },
                        { value: "internship", label: "Internship" },
                    ]} />
                </div>

                {/* CTC */}
                <div className="grid grid-cols-2 gap-4">
                    <InputField label="Min CTC (LPA)" required type="number" icon={<DollarSign className="w-4 h-4" />}
                        value={form.ctcMin} onChange={set("ctcMin")} placeholder="e.g. 8" />
                    <InputField label="Max CTC (LPA)" required type="number" icon={<DollarSign className="w-4 h-4" />}
                        value={form.ctcMax} onChange={set("ctcMax")} placeholder="e.g. 15" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <InputField label="Experience Required" value={form.experience} onChange={set("experience")} placeholder="e.g. 2-4 years" />
                    <InputField label="No. of Openings" type="number" value={form.openings} onChange={set("openings")} placeholder="1" />
                </div>

                <InputField label="Required Skills" value={form.skills} onChange={set("skills")} placeholder="e.g. React, Node.js, SQL (comma separated)" />

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Job Description <span className="text-red-400">*</span></label>
                    <textarea
                        rows={4}
                        value={form.description}
                        onChange={set("description")}
                        placeholder="Describe the role, responsibilities, and requirements..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/60 transition-all resize-none"
                    />
                </div>

                <InputField label="Application Deadline" type="date" value={form.deadline} onChange={set("deadline")} />

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-bold hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                >
                    🚀 Post Job
                </button>
            </form>
        </Modal>
    );
}

/* ─────────────────────────────────────────────
   SCHEDULE INTERVIEW MODAL
   ───────────────────────────────────────────── */
function ScheduleInterviewModal({ onClose }) {
    const [selectedCandidates, setSelectedCandidates] = useState([]);
    const [date, setDate] = useState("");
    const [slot, setSlot] = useState("");
    const [interviewType, setInterviewType] = useState("video");
    const [interviewer, setInterviewer] = useState("");
    const [notes, setNotes] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const toggleCandidate = (id) => {
        setSelectedCandidates((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedCandidates.length === 0 || !date || !slot) return;
        setSubmitted(true);
    };

    if (submitted) {
        const names = CANDIDATES.filter((c) => selectedCandidates.includes(c.id)).map((c) => c.name);
        return (
            <Modal title="✅ Interview Scheduled" onClose={onClose}>
                <div className="text-center py-10 space-y-4">
                    <div className="w-20 h-20 mx-auto rounded-full bg-indigo-500/20 flex items-center justify-center">
                        <Calendar className="w-10 h-10 text-indigo-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Interview Confirmed!</h3>
                    <div className="bg-white/5 rounded-xl p-4 text-left space-y-2">
                        <p className="text-gray-300"><span className="text-gray-500">Candidates:</span> {names.join(", ")}</p>
                        <p className="text-gray-300"><span className="text-gray-500">Date:</span> {date}</p>
                        <p className="text-gray-300"><span className="text-gray-500">Time:</span> {slot}</p>
                        <p className="text-gray-300"><span className="text-gray-500">Mode:</span> {interviewType.charAt(0).toUpperCase() + interviewType.slice(1)}</p>
                        {interviewer && <p className="text-gray-300"><span className="text-gray-500">Interviewer:</span> {interviewer}</p>}
                    </div>
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg text-white font-semibold hover:scale-105 transition-all"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </Modal>
        );
    }

    return (
        <Modal title="📅 Schedule Interview" onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Candidate Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Select Candidates <span className="text-red-400">*</span>
                        <span className="text-gray-500 text-xs ml-2">({selectedCandidates.length} selected)</span>
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {CANDIDATES.map((c) => {
                            const selected = selectedCandidates.includes(c.id);
                            return (
                                <div
                                    key={c.id}
                                    onClick={() => toggleCandidate(c.id)}
                                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${selected
                                        ? "border-indigo-500/60 bg-indigo-500/10"
                                        : "border-white/10 bg-white/5 hover:border-white/30"
                                        }`}
                                >
                                    <div>
                                        <p className="text-white font-medium text-sm">{c.name}</p>
                                        <p className="text-gray-400 text-xs">{c.position}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-blue-400 text-xs font-semibold">{c.score}</span>
                                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${selected ? "border-indigo-500 bg-indigo-500" : "border-white/30"
                                            }`}>
                                            {selected && <CheckCircle className="w-3 h-3 text-white fill-white" />}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Date & Slot */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Interview Date <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500/60 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Time Slot <span className="text-red-400">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-1 max-h-36 overflow-y-auto">
                            {TIME_SLOTS.map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setSlot(t)}
                                    className={`text-xs py-2 px-2 rounded-lg border transition-all ${slot === t
                                        ? "border-indigo-500 bg-indigo-500/20 text-indigo-300 font-semibold"
                                        : "border-white/10 bg-white/5 text-gray-400 hover:border-white/30 hover:text-white"
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Interview Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Interview Mode</label>
                    <div className="grid grid-cols-3 gap-2">
                        {["video", "phone", "in-person"].map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setInterviewType(type)}
                                className={`py-2 px-3 rounded-lg border text-sm capitalize transition-all ${interviewType === type
                                    ? "border-indigo-500 bg-indigo-500/20 text-indigo-300 font-semibold"
                                    : "border-white/10 bg-white/5 text-gray-400 hover:border-white/30"
                                    }`}
                            >
                                {type === "video" ? "🎥" : type === "phone" ? "📞" : "🏢"} {type}
                            </button>
                        ))}
                    </div>
                </div>

                <InputField
                    label="Interviewer Name"
                    icon={<UserCheck className="w-4 h-4" />}
                    value={interviewer}
                    onChange={(e) => setInterviewer(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                />

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Notes / Instructions</label>
                    <textarea
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add any instructions or notes for the candidate..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/60 transition-all resize-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={selectedCandidates.length === 0 || !date || !slot}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg font-bold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
                >
                    📅 Confirm Interview
                </button>
            </form>
        </Modal>
    );
}

/* ─────────────────────────────────────────────
   VIEW ANALYTICS MODAL
   ───────────────────────────────────────────── */
function ViewAnalyticsModal({ onClose }) {
    const maxHires = Math.max(...analyticsData.monthly.map((m) => m.hires));

    return (
        <Modal title="📊 Hiring Analytics" onClose={onClose}>
            <div className="space-y-6">
                {/* Key Metrics */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Key Metrics</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {analyticsData.metrics.map((m, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                                <div className={m.color}>{m.icon}</div>
                                <div>
                                    <p className="text-white font-bold text-lg">{m.value}</p>
                                    <p className="text-gray-400 text-xs">{m.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Hiring Funnel */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Activity className="w-4 h-4" /> Recruitment Funnel
                    </h3>
                    <div className="space-y-2">
                        {analyticsData.funnel.map((stage, i) => {
                            const pct = Math.round((stage.count / analyticsData.funnel[0].count) * 100);
                            return (
                                <div key={i}>
                                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                                        <span>{stage.stage}</span>
                                        <span className="font-semibold text-white">{stage.count} <span className="text-gray-500">({pct}%)</span></span>
                                    </div>
                                    <div className="w-full bg-white/10 rounded-full h-3">
                                        <div
                                            className={`bg-gradient-to-r ${stage.color} h-3 rounded-full transition-all duration-700`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Monthly Hires Bar Chart */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <BarChart2 className="w-4 h-4" /> Monthly Hires (Last 6 Months)
                    </h3>
                    <div className="flex items-end gap-2 h-28">
                        {analyticsData.monthly.map((m, i) => {
                            const pct = Math.round((m.hires / maxHires) * 100);
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                    <span className="text-white text-xs font-semibold">{m.hires}</span>
                                    <div
                                        className="w-full rounded-t-md bg-gradient-to-t from-blue-600 to-indigo-400 transition-all duration-700"
                                        style={{ height: `${pct}%` }}
                                    />
                                    <span className="text-gray-500 text-xs">{m.month}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Department Breakdown */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <PieChart className="w-4 h-4" /> Department Breakdown
                    </h3>
                    <div className="overflow-hidden rounded-xl border border-white/10">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    <th className="text-left px-4 py-2 text-gray-400 font-medium">Department</th>
                                    <th className="text-center px-4 py-2 text-gray-400 font-medium">Hired</th>
                                    <th className="text-center px-4 py-2 text-gray-400 font-medium">Open Roles</th>
                                    <th className="text-center px-4 py-2 text-gray-400 font-medium">Fill Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analyticsData.departments.map((d, i) => {
                                    const fillRate = Math.round((d.hired / (d.hired + d.open)) * 100);
                                    return (
                                        <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-3 text-white font-medium">{d.name}</td>
                                            <td className="px-4 py-3 text-center text-green-400 font-semibold">{d.hired}</td>
                                            <td className="px-4 py-3 text-center text-yellow-400">{d.open}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${fillRate >= 70 ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                                                    {fillRate}%
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

/* ─────────────────────────────────────────────
   MAIN DASHBOARD
   ───────────────────────────────────────────── */
export default function HRDashboard() {
    const [modal, setModal] = useState(null);
    const { user } = useUser();
    const hrName = user?.name || "HR";

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] p-6 space-y-6">
            {/* Modals */}
            {modal === "postJob" && <PostJobModal onClose={() => setModal(null)} />}
            {modal === "scheduleInterview" && <ScheduleInterviewModal onClose={() => setModal(null)} />}
            {modal === "analytics" && <ViewAnalyticsModal onClose={() => setModal(null)} />}

            {/* Header */}
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent drop-shadow-sm">
                👔 HR Dashboard — {hrName}
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
                <div className="bg-white/10 backdrop-blur-sm border-2 border-blue-500/20 p-6 rounded-2xl shadow-xl hover:shadow-2xl hover:border-blue-500/40 transition-all duration-300 col-span-2">
                    <h2 className="text-2xl font-bold mb-3 text-blue-400 flex items-center gap-2">
                        <Users className="w-6 h-6" /> Recent Candidates
                    </h2>
                    <div className="space-y-3">
                        {CANDIDATES.map((candidate) => (
                            <div key={candidate.id} className="bg-white/5 p-4 rounded-lg border border-white/10 hover:border-blue-500/30 transition-all">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-white font-semibold">{candidate.name}</h3>
                                        <p className="text-gray-400 text-sm">{candidate.position}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-blue-400 font-bold">{candidate.score}</p>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${candidate.status === "Shortlisted" ? "bg-green-500/20 text-green-400" :
                                            candidate.status === "Interview Scheduled" ? "bg-indigo-500/20 text-indigo-300" :
                                                "bg-white/10 text-gray-400"
                                            }`}>{candidate.status}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white/10 backdrop-blur-sm border-2 border-indigo-500/30 p-6 rounded-2xl shadow-xl hover:shadow-2xl hover:border-indigo-500/50 transition-all duration-300">
                    <h2 className="text-xl font-bold mb-4 text-indigo-400">⚡ Quick Actions</h2>
                    <div className="space-y-3">
                        <button
                            onClick={() => setModal("postJob")}
                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <Briefcase className="w-4 h-4" /> Post New Job
                        </button>
                        <button
                            onClick={() => setModal("scheduleInterview")}
                            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <Calendar className="w-4 h-4" /> Schedule Interview
                        </button>
                        <button
                            onClick={() => setModal("analytics")}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <BarChart2 className="w-4 h-4" /> View Analytics
                        </button>
                    </div>

                    {/* Status Legend */}
                    <div className="mt-6 pt-4 border-t border-white/10">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Status</p>
                        <div className="space-y-1.5">
                            {[
                                { label: "Shortlisted", color: "bg-green-400" },
                                { label: "Interview Scheduled", color: "bg-indigo-400" },
                                { label: "Under Review", color: "bg-yellow-400" },
                                { label: "Pending", color: "bg-gray-400" },
                            ].map((s) => (
                                <div key={s.label} className="flex items-center gap-2 text-xs text-gray-400">
                                    <div className={`w-2 h-2 rounded-full ${s.color}`} />
                                    {s.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Upcoming Interviews */}
                <div className="bg-white/10 backdrop-blur-sm border-2 border-blue-500/20 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
                    <h2 className="text-2xl font-bold mb-6 text-blue-400 flex items-center gap-2">
                        <Calendar className="w-6 h-6" /> Upcoming Interviews
                    </h2>
                    <ul className="space-y-4">
                        {[
                            { candidate: "Alice Brown", position: "Frontend Developer", time: "Today, 2:00 PM", mode: "🎥 Video" },
                            { candidate: "Bob Wilson", position: "Backend Engineer", time: "Tomorrow, 10:00 AM", mode: "🏢 In-person" },
                            { candidate: "Carol Davis", position: "DevOps Engineer", time: "Feb 22, 3:00 PM", mode: "📞 Phone" },
                        ].map((interview, i) => (
                            <li key={i} className="flex items-center justify-between border-b-2 border-white/10 pb-3 hover:border-blue-500/30 transition-colors">
                                <div>
                                    <span className="text-white font-medium block">{interview.candidate}</span>
                                    <span className="text-gray-400 text-sm">{interview.position}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-blue-400 text-sm font-semibold block">{interview.time}</span>
                                    <span className="text-gray-500 text-xs">{interview.mode}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Performance Metrics */}
                <div className="bg-white/10 backdrop-blur-sm border-2 border-indigo-500/30 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
                    <h2 className="text-xl font-bold mb-4 text-indigo-400 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6" /> Performance Metrics
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

/* ─────────────────────────────────────────────
   HELPER COMPONENTS
   ───────────────────────────────────────────── */
function StatCard({ title, value, icon }) {
    return (
        <div className="bg-gradient-to-br from-white/10 to-white/5 border-2 border-blue-500/20 p-6 rounded-2xl shadow-lg hover:shadow-xl hover:border-blue-500/40 transition-all duration-300 text-center group">
            <div className="flex justify-center mb-2 text-blue-400 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">{title}</h3>
            <p className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                {value}
            </p>
        </div>
    );
}

function MetricBar({ label, percentage, color }) {
    const colorClasses = {
        blue: "from-blue-500 to-blue-600",
        indigo: "from-indigo-500 to-indigo-600",
        purple: "from-purple-500 to-purple-600",
        pink: "from-pink-500 to-pink-600",
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
                />
            </div>
        </div>
    );
}
