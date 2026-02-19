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
    axios
      .get(`${import.meta.env.VITE_API_URL_NODE}/job-recommendations`)
      .then((res) => {
        setJobs(res.data.jobs || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load jobs. Make sure the backend is running.");
        setLoading(false);
        console.error(err);
      });
  }, []);

  const filtered = jobs.filter((job) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      job.job_title.toLowerCase().includes(q) ||
      job.employer_name.toLowerCase().includes(q) ||
      job.job_city?.toLowerCase().includes(q) ||
      job.job_description?.toLowerCase().includes(q);
    const matchCity = cityFilter === "All" || job.job_city === cityFilter;
    return matchSearch && matchCity;
  });

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAF5E9] via-[#FFF8E7] to-[#FAF5E9] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#009B4D] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 font-medium">Loading job recommendations…</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF5E9] via-[#FFF8E7] to-[#FAF5E9] p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#009B4D] to-[#00C962] bg-clip-text text-transparent flex items-center gap-2">
          <Briefcase className="w-8 h-8 text-[#009B4D]" />
          Job Recommendations
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {filtered.length} openings at top Indian tech companies
        </p>
      </div>

      {/* Search + City Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, company or skill…"
            className="w-full pl-9 pr-4 py-2.5 bg-white border-2 border-[#009B4D]/20 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#009B4D] transition-all shadow-sm"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {CITIES.map((city) => (
            <button
              key={city}
              onClick={() => setCityFilter(city)}
              className={`px-3 py-2 rounded-xl text-sm font-semibold border transition-all ${cityFilter === city
                  ? "bg-[#009B4D] text-white border-[#009B4D]"
                  : "bg-white text-gray-500 border-gray-200 hover:border-[#009B4D]"
                }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Job Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">No jobs match your search 😕</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((job, i) => {
            const ctc = formatCTC(job.job_min_salary, job.job_max_salary);
            const postedDate = job.job_posted_at_datetime_utc
              ? new Date(job.job_posted_at_datetime_utc).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
              : null;

            return (
              <div
                key={i}
                className="bg-white border-2 border-[#009B4D]/15 rounded-2xl shadow-md hover:shadow-xl hover:border-[#009B4D]/40 hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-5 flex items-start gap-4 border-b border-gray-100">
                  {/* Company Logo */}
                  <div className="w-12 h-12 rounded-xl border border-gray-100 bg-gray-50 flex-shrink-0 overflow-hidden">
                    {job.employer_logo ? (
                      <img
                        src={job.employer_logo}
                        alt={job.employer_name}
                        className="w-full h-full object-contain p-1"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentNode.innerHTML = `<div class="w-full h-full flex items-center justify-center text-[#009B4D] font-bold text-lg">${job.employer_name.charAt(0)}</div>`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#009B4D] font-bold text-lg">
                        {job.employer_name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-base font-bold text-gray-900 leading-tight line-clamp-2">
                      {job.job_title}
                    </h2>
                    <p className="text-sm text-[#009B4D] font-semibold mt-0.5 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      {job.employer_name}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 space-y-3">
                  {/* Location + Type */}
                  <div className="flex flex-wrap gap-2">
                    <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                      <MapPin className="w-3 h-3" />
                      {job.job_city}, {job.job_country}
                    </span>
                    <span className="text-xs text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full font-medium capitalize">
                      {job.job_employment_type?.toLowerCase().replace("_", " ")}
                    </span>
                  </div>

                  {/* CTC */}
                  {ctc && (
                    <p className="flex items-center gap-1 text-sm font-semibold text-green-700">
                      <IndianRupee className="w-3.5 h-3.5" />
                      {ctc}
                    </p>
                  )}

                  {/* Description snippet */}
                  {job.job_description && (
                    <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                      {job.job_description}
                    </p>
                  )}

                  {/* Posted date */}
                  {postedDate && (
                    <p className="text-xs text-gray-400">Posted: {postedDate}</p>
                  )}
                </div>

                {/* Card Footer */}
                <div className="px-5 pb-5">
                  <a
                    href={job.job_apply_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-[#009B4D] to-[#00C962] text-white rounded-xl text-sm font-bold hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                  >
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