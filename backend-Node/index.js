import express from "express"
import dotenv from "dotenv"
import userRoutes from "./routes/userRoutes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
dotenv.config()
const PORT = process.env.PORT || 3000
import axios from "axios"
import connectDB from "./config/db.js"

connectDB()

const app = express()

// Change this origin when in production
// app.use(cors({ origin: "https://dev-clash-flax.vercel.app"})) // for production


// app.use(cors({ origin: "http://localhost:5173"}, )) // for Localhost


// app.use(cors({
//   origin: "https://dev-clash-flax.vercel.app/",
//   credentials: true, // Allow cookies or Authorization headers
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Ensure all required methods are allowed
//   allowedHeaders: ["Content-Type", "Authorization"] // Include necessary headers
// }))

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
// app.use(cors({
//   origin: "https://dev-clash-hackathon.vercel.app", // frontend domain
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// }));

app.use(express.json())

app.use(cookieParser())

app.use("/api/users", userRoutes)

app.get("/job-recommendations", (req, res) => {
  const jobs = [
    // ── April 2026 – Latest Openings ────────────────────────────────────────
    {
      job_title: "GenAI Engineer – LLMs & RAG",
      employer_name: "Google India",
      employer_logo: "https://logo.clearbit.com/google.com",
      job_city: "Hyderabad",
      job_country: "India",
      job_employment_type: "FULLTIME",
      job_posted_at_datetime_utc: "2026-04-23T06:00:00Z",
      job_apply_link: "https://careers.google.com/",
      job_description: "Build next-gen Generative AI features for Google Workspace using Gemini, LangChain, and RAG pipelines. Strong Python and prompt-engineering skills required.",
      job_min_salary: 3500000,
      job_max_salary: 6000000,
    },
    {
      job_title: "Software Engineer III – Payments",
      employer_name: "Razorpay",
      employer_logo: "https://logo.clearbit.com/razorpay.com",
      job_city: "Bengaluru",
      job_country: "India",
      job_employment_type: "FULLTIME",
      job_posted_at_datetime_utc: "2026-04-22T09:30:00Z",
      job_apply_link: "https://razorpay.com/jobs/",
      job_description: "Own Razorpay's payment orchestration layer. Build fault-tolerant microservices with Java/Go and design for 99.99% uptime across 300+ payment instruments.",
      job_min_salary: 2200000,
      job_max_salary: 3800000,
    },
    {
      job_title: "Full Stack Engineer – React & Node",
      employer_name: "Zomato",
      employer_logo: "https://logo.clearbit.com/zomato.com",
      job_city: "Gurugram",
      job_country: "India",
      job_employment_type: "FULLTIME",
      job_posted_at_datetime_utc: "2026-04-21T08:00:00Z",
      job_apply_link: "https://www.zomato.com/careers",
      job_description: "Build hyper-local food delivery experiences for 20M+ monthly active users. React, Node.js, Redis, PostgreSQL stack.",
      job_min_salary: 1800000,
      job_max_salary: 3200000,
    },
    {
      job_title: "MLOps Engineer",
      employer_name: "PhonePe",
      employer_logo: "https://logo.clearbit.com/phonepe.com",
      job_city: "Bengaluru",
      job_country: "India",
      job_employment_type: "FULLTIME",
      job_posted_at_datetime_utc: "2026-04-20T10:00:00Z",
      job_apply_link: "https://www.phonepe.com/careers/",
      job_description: "Deploy and monitor ML models at scale for fraud detection and personalisation on India's largest UPI platform. Kubeflow, MLflow, Spark.",
      job_min_salary: 2000000,
      job_max_salary: 3500000,
    },
    {
      job_title: "Senior DevOps Engineer – Kubernetes",
      employer_name: "Swiggy",
      employer_logo: "https://logo.clearbit.com/swiggy.com",
      job_city: "Bengaluru",
      job_country: "India",
      job_employment_type: "FULLTIME",
      job_posted_at_datetime_utc: "2026-04-18T07:30:00Z",
      job_apply_link: "https://bytes.swiggy.com/careers",
      job_description: "Manage Swiggy's multi-cluster Kubernetes platform on AWS. CI/CD, Helm, Terraform, Prometheus/Grafana observability stack.",
      job_min_salary: 1800000,
      job_max_salary: 3200000,
    },
    {
      job_title: "Data Science Lead – Recommendations",
      employer_name: "Flipkart",
      employer_logo: "https://logo.clearbit.com/flipkart.com",
      job_city: "Bengaluru",
      job_country: "India",
      job_employment_type: "FULLTIME",
      job_posted_at_datetime_utc: "2026-04-17T09:00:00Z",
      job_apply_link: "https://www.flipkartcareers.com/",
      job_description: "Lead the product recommendation engine team. Build real-time collaborative filtering models serving 400M+ users across Flipkart's catalogue.",
      job_min_salary: 3000000,
      job_max_salary: 5500000,
    },
    {
      job_title: "Android Engineer – Kotlin",
      employer_name: "CRED",
      employer_logo: "https://logo.clearbit.com/cred.club",
      job_city: "Bengaluru",
      job_country: "India",
      job_employment_type: "FULLTIME",
      job_posted_at_datetime_utc: "2026-04-16T08:30:00Z",
      job_apply_link: "https://careers.cred.club/",
      job_description: "Build CRED's premium Android experience for India's most creditworthy users. Jetpack Compose, Hilt, Coroutines, and Clean Architecture.",
      job_min_salary: 1800000,
      job_max_salary: 3200000,
    },
    {
      job_title: "Cloud Infrastructure Engineer",
      employer_name: "Microsoft India",
      employer_logo: "https://logo.clearbit.com/microsoft.com",
      job_city: "Hyderabad",
      job_country: "India",
      job_employment_type: "FULLTIME",
      job_posted_at_datetime_utc: "2026-04-15T10:00:00Z",
      job_apply_link: "https://careers.microsoft.com/",
      job_description: "Build and harden Azure's global cloud infrastructure. Deep expertise in distributed systems, networking, and large-scale storage required.",
      job_min_salary: 3000000,
      job_max_salary: 5000000,
    },
    {
      job_title: "Backend Engineer – Go",
      employer_name: "Zepto",
      employer_logo: "https://logo.clearbit.com/zeptonow.com",
      job_city: "Mumbai",
      job_country: "India",
      job_employment_type: "FULLTIME",
      job_posted_at_datetime_utc: "2026-04-14T09:00:00Z",
      job_apply_link: "https://www.zeptonow.com/careers",
      job_description: "Power India's fastest grocery delivery. Build high-throughput Go microservices for order routing, inventory, and dark store operations.",
      job_min_salary: 1800000,
      job_max_salary: 3200000,
    },
    {
      job_title: "Product Manager – B2B SaaS",
      employer_name: "Freshworks",
      employer_logo: "https://logo.clearbit.com/freshworks.com",
      job_city: "Chennai",
      job_country: "India",
      job_employment_type: "FULLTIME",
      job_posted_at_datetime_utc: "2026-04-13T08:00:00Z",
      job_apply_link: "https://www.freshworks.com/company/careers/",
      job_description: "Drive product vision for Freshdesk's AI-powered helpdesk suite. Work with cross-functional teams across India and the US.",
      job_min_salary: 2800000,
      job_max_salary: 4500000,
    },
    // ── March 2026 ──────────────────────────────────────────────────────────
    {
      job_title: "Software Development Engineer II",
      employer_name: "Amazon India",
      employer_logo: "https://logo.clearbit.com/amazon.com",
      job_city: "Bengaluru",
      job_country: "India",
      job_employment_type: "FULLTIME",
      job_posted_at_datetime_utc: "2026-03-28T09:00:00Z",
      job_apply_link: "https://www.amazon.jobs/en/teams/india",
      job_description: "Build scalable backend services for Amazon's core platforms using Java, distributed systems and AWS.",
      job_min_salary: 2000000,
      job_max_salary: 3500000,
    },
    {
      job_title: "Machine Learning Engineer",
      employer_name: "Meesho",
      employer_logo: "https://logo.clearbit.com/meesho.com",
      job_city: "Bengaluru",
      job_country: "India",
      job_employment_type: "FULLTIME",
      job_posted_at_datetime_utc: "2026-03-25T10:00:00Z",
      job_apply_link: "https://meesho.io/careers",
      job_description: "Build ML ranking and recommendation systems powering Meesho's 150M+ user social commerce platform.",
      job_min_salary: 2000000,
      job_max_salary: 3500000,
    },
    {
      job_title: "iOS Engineer – Swift / SwiftUI",
      employer_name: "Groww",
      employer_logo: "https://logo.clearbit.com/groww.in",
      job_city: "Bengaluru",
      job_country: "India",
      job_employment_type: "FULLTIME",
      job_posted_at_datetime_utc: "2026-03-20T09:00:00Z",
      job_apply_link: "https://groww.in/investments/careers",
      job_description: "Build Groww's iOS investment app serving 10M+ investors. SwiftUI, Combine, and clean architecture.",
      job_min_salary: 1500000,
      job_max_salary: 2600000,
    },
    {
      job_title: "Cloud Solutions Architect",
      employer_name: "Microsoft India",
      employer_logo: "https://logo.clearbit.com/microsoft.com",
      job_city: "Pune",
      job_country: "India",
      job_employment_type: "FULLTIME",
      job_posted_at_datetime_utc: "2026-03-15T08:00:00Z",
      job_apply_link: "https://careers.microsoft.com/",
      job_description: "Help enterprise customers design and migrate to Azure. Azure certifications required.",
      job_min_salary: 2800000,
      job_max_salary: 4500000,
    },
    {
      job_title: "Data Engineer – Spark & Kafka",
      employer_name: "Atlassian India",
      employer_logo: "https://logo.clearbit.com/atlassian.com",
      job_city: "Bengaluru",
      job_country: "India",
      job_employment_type: "FULLTIME",
      job_posted_at_datetime_utc: "2026-03-10T09:00:00Z",
      job_apply_link: "https://www.atlassian.com/company/careers",
      job_description: "Build real-time event streaming pipelines for Jira and Confluence analytics using Kafka, Spark, and dbt.",
      job_min_salary: 2500000,
      job_max_salary: 4000000,
    },
    // ── February 2026 ───────────────────────────────────────────────────────
    {
      job_title: "Frontend Engineer – React",
      employer_name: "Razorpay",
      employer_logo: "https://logo.clearbit.com/razorpay.com",
      job_city: "Bengaluru",
      job_country: "India",
      job_employment_type: "FULLTIME",
      job_posted_at_datetime_utc: "2026-02-20T10:00:00Z",
      job_apply_link: "https://razorpay.com/jobs/",
      job_description: "Work on Razorpay's checkout and dashboard products. Deep expertise in React, TypeScript and performance optimization.",
      job_min_salary: 1800000,
      job_max_salary: 3000000,
    },
    {
      job_title: "Security Engineer",
      employer_name: "Flipkart",
      employer_logo: "https://logo.clearbit.com/flipkart.com",
      job_city: "Bengaluru",
      job_country: "India",
      job_employment_type: "FULLTIME",
      job_posted_at_datetime_utc: "2026-02-14T10:00:00Z",
      job_apply_link: "https://www.flipkartcareers.com/",
      job_description: "Secure Flipkart's e-commerce platform, conduct penetration testing and threat modelling.",
      job_min_salary: 1800000,
      job_max_salary: 3200000,
    },
    {
      job_title: "Blockchain Developer",
      employer_name: "CoinDCX",
      employer_logo: "https://logo.clearbit.com/coindcx.com",
      job_city: "Mumbai",
      job_country: "India",
      job_employment_type: "FULLTIME",
      job_posted_at_datetime_utc: "2026-02-08T08:00:00Z",
      job_apply_link: "https://coindcx.com/careers/",
      job_description: "Develop smart contracts and DeFi protocols on Ethereum and Polygon. Solidity expertise required.",
      job_min_salary: 1500000,
      job_max_salary: 2800000,
    },
    {
      job_title: "React Native Developer",
      employer_name: "Urban Company",
      employer_logo: "https://logo.clearbit.com/urbancompany.com",
      job_city: "Gurugram",
      job_country: "India",
      job_employment_type: "FULLTIME",
      job_posted_at_datetime_utc: "2026-02-03T08:00:00Z",
      job_apply_link: "https://www.urbancompany.com/careers",
      job_description: "Build cross-platform mobile experiences for Urban Company's service providers and customers.",
      job_min_salary: 1200000,
      job_max_salary: 2200000,
    },
    {
      job_title: "QA Automation Engineer",
      employer_name: "Zoho Corporation",
      employer_logo: "https://logo.clearbit.com/zoho.com",
      job_city: "Chennai",
      job_country: "India",
      job_employment_type: "FULLTIME",
      job_posted_at_datetime_utc: "2026-02-01T10:00:00Z",
      job_apply_link: "https://careers.zohocorp.com/",
      job_description: "Own end-to-end test automation for Zoho CRM using Selenium, TestNG and CI/CD pipelines.",
      job_min_salary: 800000,
      job_max_salary: 1500000,
    },
  ];

  // Sort newest first
  jobs.sort((a, b) => new Date(b.job_posted_at_datetime_utc) - new Date(a.job_posted_at_datetime_utc));

  res.json({ jobs });
});



// Global error handler — converts thrown errors into JSON responses
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

app.listen(PORT, () => {
  console.log("Server listening on port: " + PORT)
})
