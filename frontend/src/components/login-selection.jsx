import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Briefcase } from "lucide-react";

export function LoginSelection() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold text-white mb-2">Welcome to HirePulse</h1>
        <p className="text-gray-400">Select your login type to continue</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student Login Card */}
        <Card 
          className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-green-500/50 border-2 bg-gradient-to-br from-gray-900 to-gray-800"
          onClick={() => navigate('/login/student')}
        >
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">Student Login</CardTitle>
            <CardDescription className="text-gray-400">
              Access your dashboard, interviews, and career resources
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-2 text-sm text-gray-300">
              <p>✓ AI Mock Interviews</p>
              <p>✓ Resume Analysis</p>
              <p>✓ Job Recommendations</p>
              <p>✓ Learning Resources</p>
            </div>
            <button className="mt-6 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
              Continue as Student
            </button>
          </CardContent>
        </Card>

        {/* HR Login Card */}
        <Card 
          className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-blue-500/50 border-2 bg-gradient-to-br from-gray-900 to-gray-800"
          onClick={() => navigate('/login/hr')}
        >
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Briefcase className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">HR Login</CardTitle>
            <CardDescription className="text-gray-400">
              Manage candidates, interviews, and recruitment
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-2 text-sm text-gray-300">
              <p>✓ Candidate Management</p>
              <p>✓ Interview Scheduling</p>
              <p>✓ Analytics & Reports</p>
              <p>✓ Job Postings</p>
            </div>
            <button className="mt-6 w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
              Continue as HR
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
