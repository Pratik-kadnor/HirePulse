import React, { useEffect, useState } from "react";
import axios from "axios";

const JobRecommendations = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL_NODE}/job-recommendations`);
        setJobs(res.data.jobs);
        setFilteredJobs(res.data.jobs);
        setLoading(false);
      } catch (err) {
        setError("Failed to load jobs.");
        setLoading(false);
        console.error(err);
      }
    };

    fetchJobs();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);

    const filtered = jobs.filter((job) =>
      job.job_title.toLowerCase().includes(value) ||
      job.employer_name.toLowerCase().includes(value) ||
      job.job_city?.toLowerCase().includes(value) ||
      job.job_country?.toLowerCase().includes(value)
    );

    setFilteredJobs(filtered);
  };

  if (loading) return <p className="text-center text-gray-400 mt-10">Fetching jobs...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF5E9] via-[#FFF8E7] to-[#FAF5E9] p-6 space-y-10">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#009B4D] to-[#00C962] bg-clip-text text-transparent">💼 Recommended Jobs for You</h1>
      </div>

      {/* Search Input */}
      <div className="max-w-xl mx-auto">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search jobs by title, company, or location"
          className="w-full px-5 py-3 bg-white border-2 border-[#009B4D]/30 rounded-2xl shadow-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#009B4D] focus:border-transparent"
        />
      </div>

      {/* Job Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job, index) => (
            <div
              key={index}
              className="bg-white/90 backdrop-blur-sm border-2 border-[#009B4D]/20 p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:border-[#009B4D]/50 hover:scale-105 transition-all duration-300"
            >
              <h2 className="text-xl font-bold text-[#009B4D] mb-2">{job.job_title}</h2>
              <p className="text-gray-700 mb-2 font-medium">
                <strong>{job.employer_name}</strong> • {job.job_city}, {job.job_country}
              </p>
              <p className="text-sm text-gray-500">
                Type: {job.job_employment_type} | Posted:{" "}
                {new Date(job.job_posted_at_datetime_utc).toLocaleDateString()}
              </p>
              <a
                href={job.job_apply_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 px-5 py-2 bg-gradient-to-r from-[#FFCC00] to-[#FFD633] text-gray-900 rounded-xl text-sm font-bold hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Apply Now
              </a>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-3 text-lg">No jobs found for your search 😕</p>
        )}
      </div>
    </div>
  );
};

export default JobRecommendations;