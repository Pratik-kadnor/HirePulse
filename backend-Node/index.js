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

const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(cors({
  origin: allowedOrigin,
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
    {
      job_title: "Software Development Engineer II",
      employer_name: "Amazon India",
      employer_logo: "https://logo.clearbit.com/amazon.com",
      job_city: "Bengaluru",
      job_country: "India",
      job_employment_type: "FULLTIME",
      job_posted_at_datetime_utc: "2026-02-15T09:00:00Z",
      job_apply_link: "https://www.amazon.jobs/en/teams/india",
      job_description: "Build scalable backend services for Amazon's core platforms using Java, distributed systems and AWS.",
      job_min_salary: 2000000,
      job_max_salary: 3500000,
    },
    {
      job_title: "Frontend Engineer – React",
      employer_name: "Razorpay",
      employer_logo: "https://logo.clearbit.com/razorpay.com",
      job_city: "Bengaluru",
      job_country: "India",
      job_employment_type: "FULLTIME",
      job_posted_at_datetime_utc: "2026-02-14T10:00:00Z",
      job_apply_link: "https://razorpay.com/jobs/",
      job_description: "Work on Razorpay's checkout and dashboard products. Deep expertise in React, TypeScript and performance optimization.",
      job_min_salary: 1800000,
      job_max_salary: 3000000,
    },
    {
      job_title: "Full Stack Developer",
      employer_name: "Swiggy",
      employer_logo: "https://logo.clearbit.com/swiggy.com",
      job_city: "Bengaluru",
      job_country: "India",
      job_employment_type: "FULLTIME",
      job_posted_at_datetime_utc: "2026-02-13T08:00:00Z",
      job_apply_link: "https://bytes.swiggy.com/careers",
      job_description: "Join the restaurant tech team to build features used by millions of restaurants and delivery partners.",
      job_min_salary: 1500000,
      job_max_salary: 2800000,
    },
    {
      job_title: "Data Engineer",
      employer_name: "PhonePe",
      employer_logo: "https://logo.clearbit.com/phonepe.com",
      job_city: "Bengaluru",
      job_country: "India",
      job_employment_type: "FULLTIME",
      job_posted_at_datetime_utc: "2026-02-12T11:00:00Z",
      job_apply_link: "https://www.phonepe.com/careers/",
      job_description: "Design and maintain large-scale data pipelines using Spark, Kafka and Airflow for India's largest UPI platform.",
      job_min_salary: 1800000,
      job_max_salary: 3200000,
    },
    {
      job_title: "Backend Engineer – Go / Python",
      employer_name: "Zepto",
      employer_logo: "https://logo.clearbit.com/zeptonow.com",
      job_city: "Mumbai",
      job_country: "India",
      job_employment_type: "FULLTIME",
      job_posted_at_datetime_utc: "2026-02-11T09:30:00Z",
      job_apply_link: "https://www.zeptonow.com/careers",
      job_description: "Power 10-minute grocery delivery at scale. Build microservices for order management and logistics.",
      job_min_salary: 1600000,
      job_max_salary: 2800000,
    },
    {
      job_title: "Machine Learning Engineer",
      employer_name: "Google India",
      employer_logo: "https://logo.clearbit.com/google.com",
      job_city: "Hyderabad",
      job_country: "India",
      job_employment_type: "FULLTIME",
      job_posted_at_datetime_utc: "2026-02-10T07:00:00Z",
      job_apply_link: "https://careers.google.com/",
      job_description: "Apply ML to improve Search, Maps and Ads products. Experience with TensorFlow, PyTorch required.",
      job_min_salary: 3000000,
      job_max_salary: 5000000,
    },
    {
      job_title: "Android Engineer",
      employer_name: "Meesho",
      employer_logo: "https://logo.clearbit.com/meesho.com",
      job_city: "Bengaluru",
      job_country: "India",
      job_employment_type: "FULLTIME",
      job_posted_at_datetime_utc: "2026-02-09T10:00:00Z",
      job_apply_link: "https://meesho.io/careers",
      job_description: "Build the Meesho Android app used by 150M+ users. Kotlin, Jetpack Compose and performance tuning.",
      job_min_salary: 1400000,
      job_max_salary: 2500000,
    },
    {
      job_title: "DevOps / SRE Engineer",
      employer_name: "Freshworks",
      employer_logo: "https://logo.clearbit.com/freshworks.com",
      job_city: "Chennai",
      job_country: "India",
      job_employment_type: "FULLTIME",
      job_posted_at_datetime_utc: "2026-02-08T08:30:00Z",
      job_apply_link: "https://www.freshworks.com/company/careers/",
      job_description: "Own the reliability and observability of Freshworks cloud platform across GCP and AWS.",
      job_min_salary: 1600000,
      job_max_salary: 2800000,
    },
    {
      job_title: "Product Manager – Fintech",
      employer_name: "CRED",
      employer_logo: "https://logo.clearbit.com/cred.club",
      job_city: "Bengaluru",
      job_country: "India",
      job_employment_type: "FULLTIME",
      job_posted_at_datetime_utc: "2026-02-07T09:00:00Z",
      job_apply_link: "https://careers.cred.club/",
      job_description: "Drive product strategy for CRED's credit and lending products for premium creditworthy users.",
      job_min_salary: 2500000,
      job_max_salary: 4000000,
    },
    {
      job_title: "Security Engineer",
      employer_name: "Flipkart",
      employer_logo: "https://logo.clearbit.com/flipkart.com",
      job_city: "Bengaluru",
      job_country: "India",
      job_employment_type: "FULLTIME",
      job_posted_at_datetime_utc: "2026-02-06T10:00:00Z",
      job_apply_link: "https://www.flipkartcareers.com/",
      job_description: "Secure Flipkart's e-commerce platform, conduct penetration testing and threat modelling.",
      job_min_salary: 1800000,
      job_max_salary: 3200000,
    },
    {
      job_title: "Cloud Solutions Architect",
      employer_name: "Microsoft India",
      employer_logo: "https://logo.clearbit.com/microsoft.com",
      job_city: "Pune",
      job_country: "India",
      job_employment_type: "FULLTIME",
      job_posted_at_datetime_utc: "2026-02-05T08:00:00Z",
      job_apply_link: "https://careers.microsoft.com/",
      job_description: "Help enterprise customers design and migrate to Azure. Azure certifications required.",
      job_min_salary: 2800000,
      job_max_salary: 4500000,
    },
    {
      job_title: "iOS Engineer – Swift",
      employer_name: "Groww",
      employer_logo: "https://logo.clearbit.com/groww.in",
      job_city: "Bengaluru",
      job_country: "India",
      job_employment_type: "FULLTIME",
      job_posted_at_datetime_utc: "2026-02-04T09:00:00Z",
      job_apply_link: "https://groww.in/investments/careers",
      job_description: "Build Groww's iOS investment app serving 10M+ investors. SwiftUI, Combine, and clean architecture.",
      job_min_salary: 1500000,
      job_max_salary: 2600000,
    },
    {
      job_title: "UI/UX Designer",
      employer_name: "Ola",
      employer_logo: "https://logo.clearbit.com/olacabs.com",
      job_city: "Bengaluru",
      job_country: "India",
      job_employment_type: "FULLTIME",
      job_posted_at_datetime_utc: "2026-02-03T10:30:00Z",
      job_apply_link: "https://www.olacabs.com/careers",
      job_description: "Design delightful rides and EV experiences for Ola's driver and rider apps.",
      job_min_salary: 1200000,
      job_max_salary: 2200000,
    },
    {
      job_title: "Data Scientist – NLP",
      employer_name: "InMobi",
      employer_logo: "https://logo.clearbit.com/inmobi.com",
      job_city: "Bengaluru",
      job_country: "India",
      job_employment_type: "FULLTIME",
      job_posted_at_datetime_utc: "2026-02-02T09:00:00Z",
      job_apply_link: "https://www.inmobi.com/company/careers/",
      job_description: "Build NLP models for ad targeting and content categorisation at mobile scale.",
      job_min_salary: 1800000,
      job_max_salary: 3000000,
    },
    {
      job_title: "Blockchain Developer",
      employer_name: "CoinDCX",
      employer_logo: "https://logo.clearbit.com/coindcx.com",
      job_city: "Mumbai",
      job_country: "India",
      job_employment_type: "FULLTIME",
      job_posted_at_datetime_utc: "2026-02-01T08:00:00Z",
      job_apply_link: "https://coindcx.com/careers/",
      job_description: "Develop smart contracts and DeFi protocols on Ethereum and Polygon. Solidity expertise required.",
      job_min_salary: 1500000,
      job_max_salary: 2800000,
    },
    {
      job_title: "QA Automation Engineer",
      employer_name: "Zoho Corporation",
      employer_logo: "https://logo.clearbit.com/zoho.com",
      job_city: "Chennai",
      job_country: "India",
      job_employment_type: "FULLTIME",
      job_posted_at_datetime_utc: "2026-01-31T10:00:00Z",
      job_apply_link: "https://careers.zohocorp.com/",
      job_description: "Own end-to-end test automation for Zoho CRM using Selenium, TestNG and CI/CD pipelines.",
      job_min_salary: 800000,
      job_max_salary: 1500000,
    },
    {
      job_title: "Software Engineer – Infrastructure",
      employer_name: "Atlassian India",
      employer_logo: "https://logo.clearbit.com/atlassian.com",
      job_city: "Bengaluru",
      job_country: "India",
      job_employment_type: "FULLTIME",
      job_posted_at_datetime_utc: "2026-01-30T09:00:00Z",
      job_apply_link: "https://www.atlassian.com/company/careers",
      job_description: "Build internal platform tooling for Jira and Confluence cloud infrastructure.",
      job_min_salary: 2500000,
      job_max_salary: 4000000,
    },
    {
      job_title: "React Native Developer",
      employer_name: "Urban Company",
      employer_logo: "https://logo.clearbit.com/urbancompany.com",
      job_city: "Gurugram",
      job_country: "India",
      job_employment_type: "FULLTIME",
      job_posted_at_datetime_utc: "2026-01-29T08:00:00Z",
      job_apply_link: "https://www.urbancompany.com/careers",
      job_description: "Build cross-platform mobile experiences for Urban Company's service providers and customers.",
      job_min_salary: 1200000,
      job_max_salary: 2200000,
    },
    {
      job_title: "Site Reliability Engineer",
      employer_name: "Dunzo",
      employer_logo: "https://logo.clearbit.com/dunzo.com",
      job_city: "Bengaluru",
      job_country: "India",
      job_employment_type: "FULLTIME",
      job_posted_at_datetime_utc: "2026-01-28T07:30:00Z",
      job_apply_link: "https://www.dunzo.com/careers",
      job_description: "Maintain 99.99% uptime for India's quick-commerce leader. Kubernetes, Prometheus, Grafana.",
      job_min_salary: 1400000,
      job_max_salary: 2500000,
    },
    {
      job_title: "Backend Engineer – Node.js",
      employer_name: "BrowserStack",
      employer_logo: "https://logo.clearbit.com/browserstack.com",
      job_city: "Mumbai",
      job_country: "India",
      job_employment_type: "FULLTIME",
      job_posted_at_datetime_utc: "2026-01-27T09:00:00Z",
      job_apply_link: "https://www.browserstack.com/careers",
      job_description: "Scale BrowserStack's test automation cloud used by 50,000+ global companies.",
      job_min_salary: 1600000,
      job_max_salary: 2800000,
    },
  ];

  res.json({ jobs });
});



app.listen(PORT, () => {
  console.log("Server listening on port: " + PORT)
})
