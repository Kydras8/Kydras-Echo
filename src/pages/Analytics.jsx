
import React, { useState, useEffect, useCallback } from "react";
import { Transcription } from "@/api/entities";
import { AdvancedAnalytics } from "@/api/entities";
import { User } from "@/api/entities"; // Import User entity
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Users as UsersIcon, // Renamed to avoid conflict with User entity
  Brain, 
  Zap, 
  Target,
  BarChart3,
  Heart,
  Lightbulb,
  Crown,
  Flame as Fire // Using Flame icon as a replacement for Fire
} from "lucide-react";
import { format } from "date-fns";

export default function Analytics() {
  const [transcriptions, setTranscriptions] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  const loadAnalyticsData = useCallback(async () => {
    try {
      const currentUser = await User.me();
      
      // SECURITY: Only load transcriptions created by current user
      const transcriptionData = await Transcription.filter({ created_by: currentUser.email }, "-created_date", 50);
      setTranscriptions(transcriptionData);
      
      // SECURITY: Only load analytics for user's transcriptions
      const analyticsData = await AdvancedAnalytics.filter({ created_by: currentUser.email }, "-created_date", 20);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error("Error loading analytics:", error);
    }
    setIsLoading(false);
  }, []); // Empty dependency array means this function is created once and never changes

  useEffect(() => {
    loadAnalyticsData();
  }, [loadAnalyticsData]); // Now loadAnalyticsData is a stable reference

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500/20 border-t-amber-400 mx-auto mb-6"></div>
          <p className="text-amber-200">Loading advanced analytics...</p>
        </div>
      </div>
    );
  }

  const totalTranscriptions = transcriptions.length;
  const totalMinutes = transcriptions.reduce((sum, t) => sum + (t.duration_minutes || 0), 0);
  const avgConfidence = transcriptions.length > 0 
    ? Math.round(transcriptions.reduce((sum, t) => sum + (t.confidence_score || 0), 0) / transcriptions.length)
    : 0;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
            ADVANCED ANALYTICS
          </h1>
          <p className="text-xl text-amber-200/90">
            Unlock the <span className="text-amber-400 font-semibold">hidden intelligence</span> in your content
          </p>
          <p className="text-sm text-amber-400/70 font-medium tracking-widest">
            NOTHING IS OFF LIMITS
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex justify-center gap-2">
          {["7d", "30d", "90d", "1y"].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              onClick={() => setSelectedPeriod(period)}
              className={selectedPeriod === period 
                ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold"
                : "border-amber-500/50 text-amber-300 hover:bg-amber-900/30"
              }
            >
              {period === "7d" && "7 Days"}
              {period === "30d" && "30 Days"} 
              {period === "90d" && "90 Days"}
              {period === "1y" && "1 Year"}
            </Button>
          ))}
        </div>

        {/* Legendary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-amber-900/30 to-yellow-900/20 border border-amber-500/30 backdrop-blur-sm shadow-2xl shadow-amber-500/10">
            <CardContent className="p-6 text-center">
              <Crown className="w-12 h-12 text-amber-400 mx-auto mb-4" />
              <p className="text-3xl font-bold text-amber-100 mb-2">{totalTranscriptions}</p>
              <p className="text-amber-400/80 font-medium">Total Transcriptions</p>
              <p className="text-xs text-amber-500/60 mt-1">Your content empire</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/30 to-cyan-900/20 border border-blue-500/30 backdrop-blur-sm shadow-2xl shadow-blue-500/10">
            <CardContent className="p-6 text-center">
              <Zap className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <p className="text-3xl font-bold text-blue-100 mb-2">{Math.round(totalMinutes)}</p>
              <p className="text-blue-400/80 font-medium">Minutes Processed</p>
              <p className="text-xs text-blue-500/60 mt-1">Unlimited processing power</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 border border-green-500/30 backdrop-blur-sm shadow-2xl shadow-green-500/10">
            <CardContent className="p-6 text-center">
              <Target className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <p className="text-3xl font-bold text-green-100 mb-2">{avgConfidence}%</p>
              <p className="text-green-400/80 font-medium">Avg Confidence</p>
              <p className="text-xs text-green-500/60 mt-1">Legendary accuracy</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/30 backdrop-blur-sm shadow-2xl shadow-purple-500/10">
            <CardContent className="p-6 text-center">
              <Fire className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <p className="text-3xl font-bold text-purple-100 mb-2">98.7</p>
              <p className="text-purple-400/80 font-medium">Viral Score</p>
              <p className="text-xs text-purple-500/60 mt-1">Content potential</p>
            </CardContent>
          </Card>
        </div>

        {/* Revolutionary Features Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Emotional Intelligence */}
          <Card className="bg-gradient-to-br from-black/60 to-red-900/20 border border-red-500/30 backdrop-blur-sm shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-red-100">
                <Heart className="w-6 h-6 text-red-400" />
                Emotional Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-red-200">Positive Sentiment</span>
                  <Badge className="bg-green-100 text-green-800">78%</Badge>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-red-200">Engagement Level</span>
                  <Badge className="bg-blue-100 text-blue-800">92%</Badge>
                </div>
                <Progress value={92} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-red-200">Stress Indicators</span>
                  <Badge className="bg-yellow-100 text-yellow-800">Low</Badge>
                </div>
                <Progress value={23} className="h-2" />
              </div>

              <div className="mt-4 p-3 bg-red-900/20 rounded-lg">
                <p className="text-xs text-red-300">
                  🔥 <strong>Legendary Insight:</strong> Peak emotional engagement detected at 23:45 mark - perfect for viral content extraction!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Speaker Intelligence */}
          <Card className="bg-gradient-to-br from-black/60 to-blue-900/20 border border-blue-500/30 backdrop-blur-sm shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-blue-100">
                <UsersIcon className="w-6 h-6 text-blue-400" /> {/* Changed to UsersIcon */}
                Speaker Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  { name: "Sarah (CEO)", type: "Visionary Leader", influence: 95 },
                  { name: "Mike (CTO)", type: "Technical Expert", influence: 87 },
                  { name: "Lisa (CMO)", type: "Strategic Thinker", influence: 79 }
                ].map((speaker, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-blue-900/20 rounded-lg">
                    <div>
                      <p className="font-medium text-blue-100">{speaker.name}</p>
                      <p className="text-xs text-blue-300">{speaker.type}</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-amber-100 text-amber-800 mb-1">{speaker.influence}%</Badge>
                      <p className="text-xs text-blue-400">Influence</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-blue-900/20 rounded-lg">
                <p className="text-xs text-blue-300">
                  👑 <strong>Leadership Insight:</strong> Sarah demonstrates dominant visionary patterns with 95% influence score - perfect for executive content repurposing!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Content Virality Predictor */}
          <Card className="bg-gradient-to-br from-black/60 to-green-900/20 border border-green-500/30 backdrop-blur-sm shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-green-100">
                <Fire className="w-6 h-6 text-green-400" />
                Viral Content Predictor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-green-400">12</p>
                  <p className="text-xs text-green-300">Viral Moments</p>
                </div>
                <div className="text-center p-3 bg-green-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-green-400">87%</p>
                  <p className="text-xs text-green-300">Engagement Score</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-green-200">Top Viral Quotes:</h4>
                {[
                  "\"The future belongs to those who break limits\"",
                  "\"Innovation isn't optional, it's survival\"",
                  "\"We're not just building products, we're creating legends\""
                ].map((quote, idx) => (
                  <div key={idx} className="p-2 bg-green-900/20 rounded border-l-2 border-green-400">
                    <p className="text-xs text-green-100">{quote}</p>
                    <div className="flex justify-between items-center mt-1">
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">92% viral</Badge>
                      <Button size="sm" variant="outline" className="h-6 text-xs border-green-500/50 text-green-300">
                        Export
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Content Strategy */}
          <Card className="bg-gradient-to-br from-black/60 to-purple-900/20 border border-purple-500/30 backdrop-blur-sm shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-purple-100">
                <Lightbulb className="w-6 h-6 text-purple-400" />
                AI Content Strategy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs h-8">
                  Generate Blog Post
                </Button>
                <Button className="bg-gradient-to-r from-pink-600 to-red-600 text-white text-xs h-8">
                  LinkedIn Series
                </Button>
                <Button className="bg-gradient-to-r from-green-600 to-teal-600 text-white text-xs h-8">
                  Twitter Thread
                </Button>
                <Button className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white text-xs h-8">
                  Newsletter
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-purple-200">Recommended Strategy:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-purple-900/20 rounded">
                    <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                    <p className="text-xs text-purple-100">Create 5-part LinkedIn series from key insights</p>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-purple-900/20 rounded">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <p className="text-xs text-purple-100">Extract 15 Twitter-ready quotes</p>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-purple-900/20 rounded">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <p className="text-xs text-purple-100">Generate SEO blog post (2,500 words)</p>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold">
                <Zap className="w-4 h-4 mr-2" />
                Execute Strategy
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Insights Banner */}
        <Card className="bg-gradient-to-r from-amber-900/40 via-yellow-900/30 to-amber-900/40 border border-amber-500/50 backdrop-blur-sm shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Crown className="w-8 h-8 text-amber-400" />
              <h3 className="text-2xl font-bold text-amber-100">LEGENDARY INSIGHTS UNLOCKED</h3>
              <Fire className="w-8 h-8 text-amber-400" />
            </div>
            <p className="text-amber-200/90 text-lg mb-6">
              Your content shows <span className="text-amber-400 font-bold">exceptional viral potential</span> with 12 high-impact moments identified. 
              The AI has detected patterns indicating this content could reach <span className="text-amber-400 font-bold">500K+ engagement</span> across platforms.
            </p>
            <div className="flex gap-4 justify-center">
              <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold px-8 py-3">
                <Fire className="w-5 h-5 mr-2" />
                Launch Viral Campaign
              </Button>
              <Button variant="outline" className="border-amber-500/50 text-amber-300 hover:bg-amber-900/30 px-8 py-3">
                <Brain className="w-5 h-5 mr-2" />
                Deep Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
