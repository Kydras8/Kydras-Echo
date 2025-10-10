
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Transcription } from "@/api/entities";
import { Team } from "@/api/entities";
import { User } from "@/api/entities"; // New Import
import { Button } from "@/components/ui/button";
import {
  Upload,
  FileText,
  Clock,
  TrendingUp,
  Zap,
  Play,
  BarChart3,
  Users,
  AlertCircle,
  Mic,
  Brain // New Import for Quick Actions widget
} from "lucide-react";
import { createPageUrl } from "@/utils";
import TranscriptionCard from "../components/transcriptions/TranscriptionCard";

export default function Dashboard() {
  const [recentTranscriptions, setRecentTranscriptions] = useState([]);
  const [teams, setTeams] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    thisWeek: 0,
    totalMinutes: 0,
    avgConfidence: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setError(null);
      const currentUser = await User.me();
      
      // SECURITY: Only load transcriptions created by current user
      const allTranscriptions = await Transcription.filter({ created_by: currentUser.email }, "-created_date", 100);
      
      // SECURITY: Only load teams where user is a member
      const allTeams = await Team.list();
      const userTeams = allTeams.filter(team => team.members.includes(currentUser.email));
      setTeams(userTeams);

      const recentTranscriptions = allTranscriptions.slice(0, 3); // Show 3 for brevity
      setRecentTranscriptions(recentTranscriptions);

      const total = allTranscriptions.length;
      const totalMinutes = allTranscriptions.reduce((sum, t) => sum + (t.duration_minutes || 0), 0);
      const avgConfidence = total > 0
        ? allTranscriptions.reduce((sum, t) => sum + (t.confidence_score || 0), 0) / total
        : 0;

      setStats({
        total,
        thisWeek: allTranscriptions.filter(t =>
          new Date(t.created_date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length,
        totalMinutes: Math.round(totalMinutes),
        avgConfidence: Math.round(avgConfidence)
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setError("Failed to load dashboard data. Please check your network connection or try again later.");
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <div className="text-center gpu-accelerated">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500/20 border-t-amber-400 mx-auto"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/20 to-yellow-400/20 blur-xl"></div>
          </div>
          <p className="text-amber-200 font-medium animate-pulse">Loading your transcription empire...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 gpu-accelerated">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Welcome Header */}
        <div className="text-center space-y-6 py-12 gpu-accelerated">
          <div className="relative">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent animate-pulse">
              WELCOME TO
            </h1>
            <h2 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent tracking-wider mt-2 smooth-hover">
              KYDRAS ECHO
            </h2>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-yellow-400/10 blur-3xl -z-10 animate-pulse"></div>
          </div>
          <p className="text-2xl text-amber-200/90 max-w-4xl mx-auto font-light smooth-hover">
            Transform your audio and video content into <span className="text-amber-400 font-semibold">intelligent, actionable insights</span> with the most advanced AI transcription platform ever created.
          </p>
          <p className="text-lg text-amber-400/70 font-medium tracking-widest smooth-hover">
            NOTHING IS OFF LIMITS
          </p>

          <div className="flex gap-4 md:gap-6 justify-center pt-6 flex-wrap">
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold px-8 md:px-10 py-4 rounded-xl text-lg shadow-2xl shadow-amber-500/25 smooth-hover gpu-accelerated relative overflow-hidden group"
              asChild
            >
              <Link to={createPageUrl("Upload")}>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <Upload className="w-6 h-6 mr-3 transition-transform duration-300 group-hover:scale-110" />
                Upload File
              </Link>
            </Button>
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-8 md:px-10 py-4 rounded-xl text-lg shadow-2xl shadow-purple-500/25 smooth-hover gpu-accelerated relative overflow-hidden group"
              asChild
            >
              <Link to={createPageUrl("LiveMeeting")}>
                 <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <Mic className="w-6 h-6 mr-3 transition-transform duration-300 group-hover:scale-110" />
                Live Meeting
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-amber-500/50 text-amber-200 hover:bg-amber-900/30 hover:border-amber-400 px-8 md:px-10 py-4 rounded-xl text-lg backdrop-blur-sm smooth-hover gpu-accelerated"
              asChild
            >
              <Link to={createPageUrl("Library")}>
                <FileText className="w-6 h-6 mr-3 transition-transform duration-300 group-hover:scale-110" />
                View Library
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-gradient-to-br from-amber-900/30 to-yellow-900/20 border border-amber-500/30 backdrop-blur-sm rounded-2xl p-8 text-center shadow-2xl shadow-amber-500/10 smooth-hover gpu-accelerated group">
            <FileText className="w-10 h-10 text-amber-400 mx-auto mb-4 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
            <p className="text-4xl font-bold text-amber-100 mb-2 transition-all duration-300 group-hover:scale-110">{stats.total}</p>
            <p className="text-amber-400/80 font-medium">Total Transcriptions</p>
          </div>

          <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 border border-green-500/30 backdrop-blur-sm rounded-2xl p-8 text-center shadow-2xl shadow-green-500/10 smooth-hover gpu-accelerated group">
            <TrendingUp className="w-10 h-10 text-green-400 mx-auto mb-4 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
            <p className="text-4xl font-bold text-green-100 mb-2 transition-all duration-300 group-hover:scale-110">{stats.thisWeek}</p>
            <p className="text-green-400/80 font-medium">This Week</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/30 backdrop-blur-sm rounded-2xl p-8 text-center shadow-2xl shadow-purple-500/10 smooth-hover gpu-accelerated group">
            <Clock className="w-10 h-10 text-purple-400 mx-auto mb-4 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
            <p className="text-4xl font-bold text-purple-100 mb-2 transition-all duration-300 group-hover:scale-110">{stats.totalMinutes}</p>
            <p className="text-purple-400/80 font-medium">Minutes Processed</p>
          </div>

          <div className="bg-gradient-to-br from-red-900/30 to-orange-900/20 border border-orange-500/30 backdrop-blur-sm rounded-2xl p-8 text-center shadow-2xl shadow-orange-500/10 smooth-hover gpu-accelerated group">
            <BarChart3 className="w-10 h-10 text-orange-400 mx-auto mb-4 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
            <p className="text-4xl font-bold text-orange-100 mb-2 transition-all duration-300 group-hover:scale-110">{stats.avgConfidence}%</p>
            <p className="text-orange-400/80 font-medium">Avg Confidence</p>
          </div>
        </div>

        {/* Quick Actions Widget - NEW UX ENHANCEMENT */}
        <div className="bg-gradient-to-br from-black/60 to-blue-900/10 border border-blue-500/20 backdrop-blur-sm rounded-3xl p-8 shadow-2xl shadow-blue-500/5 gpu-accelerated">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">⚡ Quick Actions</h3>
            <p className="text-blue-200/80 mt-2">Launch your next breakthrough in seconds</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 border border-green-500/30 rounded-2xl p-6 text-center smooth-hover gpu-accelerated group cursor-pointer" onClick={() => navigate(createPageUrl("Upload"))}>
              <Upload className="w-12 h-12 text-green-400 mx-auto mb-4 transition-transform duration-300 group-hover:scale-125" />
              <h4 className="text-xl font-bold text-green-100 mb-2">Process New Content</h4>
              <p className="text-green-200/80 text-sm">Upload audio/video and extract insights</p>
              <div className="mt-4 flex justify-center">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Start Upload
                </Button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/30 rounded-2xl p-6 text-center smooth-hover gpu-accelerated group cursor-pointer" onClick={() => navigate(createPageUrl("LiveMeeting"))}>
              <Mic className="w-12 h-12 text-purple-400 mx-auto mb-4 transition-transform duration-300 group-hover:scale-125" />
              <h4 className="text-xl font-bold text-purple-100 mb-2">Live Meeting AI</h4>
              <p className="text-purple-200/80 text-sm">Real-time transcription & insights</p>
              <div className="mt-4 flex justify-center">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  Start Meeting
                </Button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-900/30 to-yellow-900/20 border border-amber-500/30 rounded-2xl p-6 text-center smooth-hover gpu-accelerated group cursor-pointer" onClick={() => navigate(createPageUrl("Analytics"))}>
              <Brain className="w-12 h-12 text-amber-400 mx-auto mb-4 transition-transform duration-300 group-hover:scale-125" />
              <h4 className="text-xl font-bold text-amber-100 mb-2">AI Analytics</h4>
              <p className="text-amber-200/80 text-sm">Deep insights & viral content</p>
              <div className="mt-4 flex justify-center">
                <Button className="bg-amber-600 hover:bg-amber-700 text-black font-bold">
                  View Insights
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transcriptions */}
        <div className="bg-gradient-to-br from-black/60 to-amber-900/10 border border-amber-500/20 backdrop-blur-sm rounded-3xl p-8 shadow-2xl shadow-amber-500/5 gpu-accelerated">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-3xl font-bold text-amber-100 smooth-hover">Recent Transcriptions</h3>
            <Button
              variant="outline"
              className="border-amber-500/50 text-amber-300 hover:bg-amber-900/30 hover:border-amber-400 smooth-hover gpu-accelerated"
              asChild
            >
              <Link to={createPageUrl("Library")}>View All</Link>
            </Button>
          </div>

          {error && (
            <div className="text-center py-16 bg-red-900/30 border border-red-500/50 rounded-2xl smooth-hover">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4 animate-pulse" />
              <h4 className="text-xl font-semibold text-red-200 mb-2">An Error Occurred</h4>
              <p className="text-red-300/80">{error}</p>
            </div>
          )}

          {!error && recentTranscriptions.length === 0 ? (
            <div className="text-center py-16">
              <Upload className="w-20 h-20 text-amber-600/50 mx-auto mb-6 animate-bounce" />
              <h4 className="text-2xl font-semibold text-amber-200 mb-3">No transcriptions yet</h4>
              <p className="text-amber-400/70 mb-8 text-lg">Upload your first audio or video file to unlock the power of AI transcription</p>
              <Button
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold px-8 py-3 rounded-xl shadow-lg smooth-hover gpu-accelerated"
                asChild
              >
                <Link to={createPageUrl("Upload")}>
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Now
                </Link>
              </Button>
            </div>
          ) : !error && (
            <div className="grid gap-6">
              {recentTranscriptions.map((transcription) => {
                const team = teams.find(t => t.id === transcription.team_id);
                return (
                  <TranscriptionCard
                    key={transcription.id}
                    transcription={transcription}
                    team={team}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/20 border border-blue-500/30 backdrop-blur-sm rounded-2xl p-8 shadow-2xl smooth-hover gpu-accelerated group">
            <Zap className="w-16 h-16 text-blue-400 mb-6 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
            <h4 className="text-2xl font-bold text-blue-100 mb-4 smooth-hover">AI-Powered Processing</h4>
            <p className="text-blue-200/80 text-lg">
              Advanced AI extracts key topics, action items, and insights from your content automatically.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-900/30 to-cyan-900/20 border border-green-500/30 backdrop-blur-sm rounded-2xl p-8 shadow-2xl smooth-hover gpu-accelerated group">
            <Users className="w-16 h-16 text-green-400 mb-6 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
            <h4 className="text-2xl font-bold text-green-100 mb-4 smooth-hover">Speaker Intelligence</h4>
            <p className="text-green-200/80 text-lg">
              Identify different speakers, analyze participation, and track communication patterns.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/30 backdrop-blur-sm rounded-2xl p-8 shadow-2xl smooth-hover gpu-accelerated group">
            <BarChart3 className="w-16 h-16 text-purple-400 mb-6 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
            <h4 className="text-2xl font-bold text-purple-100 mb-4 smooth-hover">Advanced Analytics</h4>
            <p className="text-purple-200/80 text-lg">
              Get detailed insights on meeting effectiveness, engagement, and content performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
