import React from "react";
import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { FaFileAlt, FaChartLine, FaCheckCircle } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const resumeData = {
  name: "Pratik Kadnor",
  role: "MERN Stack Developer",
  atsScore: 86, // out of 100
  insights: [
    { skill: "React", score: 90 },
    { skill: "JavaScript", score: 85 },
    { skill: "CSS", score: 80 },
    { skill: "Testing", score: 75 },
    { skill: "Communication", score: 70 },
  ],
};

const ResumeAnalyzer = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4">
              AI-Powered <span className="text-primary">Resume Analysis</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get detailed insights into your resume's performance. Our AI scans for ATS compatibility and suggests improvements.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* ATS Score Card */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="bg-card/50 backdrop-blur-md border-primary/20 shadow-2xl overflow-hidden relative group hover:border-primary/50 transition-colors">
              <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-500" />
              <CardContent className="p-8 flex flex-col items-center relative z-10">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 animate-pulse">
                  <FaFileAlt size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-1">{resumeData.name}</h3>
                <p className="text-muted-foreground mb-6">{resumeData.role}</p>

                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor" /* Use primary color */
                      strokeWidth="3"
                      strokeDasharray={`${resumeData.atsScore}, 100`}
                      className="text-primary"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-foreground">{resumeData.atsScore}</span>
                    <span className="text-[10px] text-muted-foreground uppercase">ATS Score</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Radar Chart */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Card className="bg-card/30 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaChartLine className="text-primary" /> Skill Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={resumeData.insights}>
                    <PolarGrid stroke="hsl(var(--muted-foreground))" strokeOpacity={0.2} />
                    <PolarAngleAxis dataKey="skill" tick={{ fill: "hsl(var(--foreground))", fontSize: 14 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="transparent" />
                    <Radar
                      name="Skill"
                      dataKey="score"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ResumeAnalyzer;
