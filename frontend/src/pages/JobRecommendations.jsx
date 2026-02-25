import React, { useEffect, useState } from "react";
import axios from "axios";
import { ExternalLink, MapPin, Briefcase, Search, IndianRupee, Building2 } from "lucide-react";

const CITIES = ["All", "Bengaluru", "Mumbai", "Hyderabad", "Pune", "Chennai", "Gurugram"];

const formatCTC = (min, max) => {
  if (!min && !max) return null;
  const toL = (n) => `₹${(n / 100000).toFixed(0)}L`;
  if (min && max) return `${toL(min)} – ${toL(max)} / yr`;
  if (max) return `Up to ${toL(max)} / yr`;
  return `From ${toL(min)} / yr`;
};

const JobRecommendations = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL_NODE}/job-recommendations`)
      .then((res) => { setJobs(res.data.jobs || []); setLoading(false); })
      .catch((err) => { setError("Failed to load jobs. Make sure the backend is running."); setLoading(false); console.error(err); });
  }, []);

  const filtered = jobs.filter((job) => {
    const q = search.toLowerCase();
    const matchSearch = !q || job.job_title.toLowerCase().includes(q) || job.employer_name.toLowerCase().includes(q) ||
      job.job_city?.toLowerCase().includes(q) || job.job_description?.toLowerCase().includes(q);
    const matchCity = cityFilter === "All" || job.job_city === cityFilter;
    return matchSearch && matchCity;
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #050818 0%, #0a0f2e 50%, #06081a 100%)" }}>
      <div className="text-center space-y-4">
        <div className="w-14 h-14 rounded-full border-4 border-t-transparent animate-spin mx-auto"
          style={{ borderColor: "#8b5cf6 transparent transparent transparent", boxShadow: "0 0 20px rgba(139,92,246,0.5)" }} />
        <p className="text-slate-500 font-medium">Loading job recommendations…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#050818" }}>
      <p className="text-red-400 font-medium">{error}</p>
    </div>
  );

  return (
    <div className="min-h-screen p-6 space-y-6 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #050818 0%, #0a0f2e 50%, #06081a 100%)" }}>

      {/* Ambient blobs */}
      <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%)" }} />
      <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)" }} />

      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#8b5cf6,#06b6d4)", boxShadow: "0 0 20px rgba(139,92,246,0.5)" }}>
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold"
            style={{ background: "linear-gradient(90deg,#a78bfa,#06b6d4)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Job Recommendations
          </h1>
        </div>
        <p className="text-slate-500 text-sm mt-1">
          <span className="font-bold" style={{ color: "#8b5cf6" }}>{filtered.length}</span> openings at top Indian tech companies
        </p>
      </div>

      {/* Search + City Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, company or skill…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-slate-300 placeholder-slate-600 focus:outline-none transition-all"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(139,92,246,0.22)" }} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CITIES.map((city) => (
            <button key={city} onClick={() => setCityFilter(city)}
              className="px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
              style={cityFilter === city
                ? { background: "linear-gradient(135deg,#8b5cf6,#06b6d4)", color: "white", boxShadow: "0 2px 14px rgba(139,92,246,0.45)" }
                : { background: "rgba(255,255,255,0.04)", color: "#64748b", border: "1px solid rgba(255,255,255,0.08)" }}>
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Job Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-600">
          <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="text-lg font-medium">No jobs match your search 😕</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((job, i) => {
            const ctc = formatCTC(job.job_min_salary, job.job_max_salary);
            const postedDate = job.job_posted_at_datetime_utc
              ? new Date(job.job_posted_at_datetime_utc).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
              : null;

            return (
              <div key={i} className="flex flex-col rounded-2xl overflow-hidden transition-all duration-300 group"
                style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.05), rgba(6,182,212,0.03))", border: "1px solid rgba(139,92,246,0.15)", backdropFilter: "blur(12px)", boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
                onMouseEnter={e => { e.currentTarget.style.border = "1px solid rgba(139,92,246,0.45)"; e.currentTarget.style.boxShadow = "0 8px 40px rgba(139,92,246,0.2)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.border = "1px solid rgba(139,92,246,0.15)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.4)"; e.currentTarget.style.transform = "translateY(0)"; }}>

                {/* Card Header */}
                <div className="p-5 flex items-start gap-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(139,92,246,0.2)" }}>
                    {job.employer_logo ? (
                      <img src={job.employer_logo} alt={job.employer_name} className="w-full h-full object-contain p-1"
                        onError={(e) => { e.target.style.display = "none"; e.target.parentNode.innerHTML = `<div style="color:#a78bfa;font-weight:bold;font-size:1.2rem;width:100%;height:100%;display:flex;align-items:center;justify-content:center;">${job.employer_name.charAt(0)}</div>`; }} />
                    ) : (
                      <div className="font-bold text-xl" style={{ color: "#a78bfa" }}>{job.employer_name.charAt(0)}</div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base font-bold text-white leading-tight line-clamp-2">{job.job_title}</h2>
                    <p className="text-sm font-semibold mt-0.5 flex items-center gap-1" style={{ color: "#8b5cf6" }}>
                      <Building2 className="w-3.5 h-3.5" />{job.employer_name}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(255,255,255,0.05)", color: "#64748b" }}>
                      <MapPin className="w-3 h-3" />{job.job_city}, {job.job_country}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium capitalize"
                      style={{ background: "rgba(6,182,212,0.1)", color: "#22d3ee", border: "1px solid rgba(6,182,212,0.2)" }}>
                      {job.job_employment_type?.toLowerCase().replace("_", " ")}
                    </span>
                  </div>
                  {ctc && (
                    <p className="flex items-center gap-1 text-sm font-semibold" style={{ color: "#34d399" }}>
                      <IndianRupee className="w-3.5 h-3.5" />{ctc}
                    </p>
                  )}
                  {job.job_description && <p className="text-xs line-clamp-3 leading-relaxed text-slate-600">{job.job_description}</p>}
                  {postedDate && <p className="text-xs text-slate-700">Posted: {postedDate}</p>}
                </div>

                {/* Card Footer */}
                <div className="px-5 pb-5">
                  <a href={job.job_apply_link} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200"
                    style={{ background: "linear-gradient(135deg,#8b5cf6,#06b6d4)", boxShadow: "0 4px 16px rgba(139,92,246,0.35)" }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 28px rgba(139,92,246,0.55)"; e.currentTarget.style.transform = "scale(1.02)"; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(139,92,246,0.35)"; e.currentTarget.style.transform = "scale(1)"; }}>
                    Apply Now <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default JobRecommendations;