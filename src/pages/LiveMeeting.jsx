import React, { useState, useEffect, useRef } from "react";
import { LiveMeeting } from "@/api/entities";
import { Team } from "@/api/entities";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Mic, 
  MicOff, 
  Play, 
  Square, 
  Users, 
  Brain,
  Zap,
  Target,
  TrendingUp,
  Heart,
  Clock,
  AlertTriangle,
  CheckCircle,
  Crown,
  Flame
} from "lucide-react";
import { InvokeLLM } from "@/api/integrations";

export default function LiveMeetingPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [currentMeeting, setCurrentMeeting] = useState(null);
  const [liveTranscript, setLiveTranscript] = useState([]);
  const [liveInsights, setLiveInsights] = useState({
    current_sentiment: "neutral",
    engagement_level: 65,
    talk_time_distribution: {},
    key_topics_emerging: ["AI Strategy", "Product Launch", "Budget Planning"],
    suggested_actions: []
  });
  const [participants, setParticipants] = useState([
    { name: "Sarah Johnson", email: "sarah@company.com", role: "CEO", status: "speaking" },
    { name: "Mike Chen", email: "mike@company.com", role: "CTO", status: "listening" },
    { name: "Lisa Parker", email: "lisa@company.com", role: "CMO", status: "listening" }
  ]);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [teams, setTeams] = useState([]);
  const [meetingDuration, setMeetingDuration] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    loadTeams();
  }, []);

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setMeetingDuration(prev => prev + 1);
        simulateRealTimeUpdates();
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording]);

  const loadTeams = async () => {
    try {
      const currentUser = await User.me();
      const allTeams = await Team.list();
      const userTeams = allTeams.filter(team => team.members.includes(currentUser.email));
      setTeams(userTeams);
    } catch (error) {
      console.error("Error loading teams:", error);
    }
  };

  const simulateRealTimeUpdates = () => {
    // Simulate real-time transcript updates
    const sampleTranscripts = [
      "I think we need to focus on the AI strategy for Q4",
      "The product launch timeline looks aggressive but achievable", 
      "Budget constraints might impact our hiring plans",
      "Customer feedback has been overwhelmingly positive",
      "We should prioritize the mobile experience",
      "The competitive landscape is shifting rapidly"
    ];

    const randomSpeaker = participants[Math.floor(Math.random() * participants.length)];
    const randomTranscript = sampleTranscripts[Math.floor(Math.random() * sampleTranscripts.length)];

    if (Math.random() > 0.7) { // 30% chance per second
      const newSegment = {
        timestamp: Date.now(),
        speaker: randomSpeaker.name,
        content: randomTranscript,
        confidence: 0.92 + Math.random() * 0.07,
        emotion: ["confident", "concerned", "excited", "analytical"][Math.floor(Math.random() * 4)]
      };

      setLiveTranscript(prev => [...prev.slice(-20), newSegment]); // Keep last 20 segments
    }

    // Update live insights
    setLiveInsights(prev => ({
      ...prev,
      engagement_level: Math.max(30, Math.min(100, prev.engagement_level + (Math.random() - 0.5) * 10)),
      current_sentiment: ["positive", "neutral", "concerned", "excited"][Math.floor(Math.random() * 4)]
    }));
  };

  const startMeeting = async () => {
    if (!meetingTitle) {
      alert("Please enter a meeting title");
      return;
    }

    try {
      const meeting = await LiveMeeting.create({
        title: meetingTitle,
        team_id: selectedTeam || null,
        meeting_status: "live",
        start_time: new Date().toISOString(),
        participants: participants,
        real_time_transcript: [],
        live_insights: liveInsights
      });

      setCurrentMeeting(meeting);
      setIsRecording(true);
      setMeetingDuration(0);
    } catch (error) {
      console.error("Error starting meeting:", error);
    }
  };

  const stopMeeting = async () => {
    if (!currentMeeting) return;

    try {
      // Generate final meeting analysis
      const finalAnalysis = await InvokeLLM({
        prompt: `Analyze this live meeting transcript and provide comprehensive insights:

        Meeting: ${meetingTitle}
        Duration: ${Math.floor(meetingDuration / 60)} minutes
        Participants: ${participants.map(p => p.name).join(', ')}
        
        Transcript: ${liveTranscript.map(t => `${t.speaker}: ${t.content}`).join('\n')}
        
        Please provide:
        1. Meeting effectiveness score (0-100)
        2. Key decisions made
        3. Action items identified  
        4. Communication insights
        5. Recommended follow-ups`,
        response_json_schema: {
          type: "object",
          properties: {
            effectiveness_score: { type: "number" },
            key_decisions: { type: "array", items: { type: "string" } },
            action_items: { type: "array", items: { type: "string" } },
            insights: { type: "array", items: { type: "string" } },
            follow_ups: { type: "array", items: { type: "string" } }
          }
        }
      });

      await LiveMeeting.update(currentMeeting.id, {
        meeting_status: "completed",
        end_time: new Date().toISOString(),
        real_time_transcript: liveTranscript,
        meeting_effectiveness_score: finalAnalysis.effectiveness_score
      });

      setIsRecording(false);
      setCurrentMeeting(null);
      setLiveTranscript([]);
      setMeetingDuration(0);
    } catch (error) {
      console.error("Error stopping meeting:", error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case "positive": return "text-green-400";
      case "excited": return "text-blue-400";  
      case "concerned": return "text-yellow-400";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            LIVE MEETING INTELLIGENCE
          </h1>
          <p className="text-xl text-gray-300">
            Real-time AI co-pilot for <span className="text-purple-400 font-semibold">legendary meetings</span>
          </p>
          <Badge className="bg-gradient-to-r from-red-500 to-purple-500 text-white px-4 py-2 text-sm font-bold">
            <Crown className="w-4 h-4 mr-2" />
            LIVE AI ANALYSIS
          </Badge>
        </div>

        {!isRecording ? (
          /* Meeting Setup */
          <Card className="bg-gradient-to-br from-black/60 to-purple-900/20 border border-purple-500/30 backdrop-blur-sm shadow-2xl max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-purple-100 text-center">Start New Meeting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Meeting Title *</label>
                <Input
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  placeholder="Q4 Strategy Planning Session"
                  className="bg-black/30 border-purple-500/30 text-purple-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Assign to Team (Optional)</label>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="w-full p-3 bg-black/30 border border-purple-500/30 rounded-lg text-purple-100"
                >
                  <option value="">Personal Meeting</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-purple-200">Expected Participants</label>
                {participants.map((participant, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-purple-900/20 rounded-lg">
                    <div>
                      <p className="font-medium text-purple-100">{participant.name}</p>
                      <p className="text-xs text-purple-300">{participant.role}</p>
                    </div>
                    <Badge variant="outline" className="text-purple-200 border-purple-500/30">
                      Ready
                    </Badge>
                  </div>
                ))}
              </div>

              <Button
                onClick={startMeeting}
                className="w-full bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white py-4 text-lg font-bold"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Live Meeting
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Live Meeting Interface */
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Panel: Live Controls & Transcript */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recording Status */}
              <Card className="bg-gradient-to-r from-red-900/30 to-purple-900/30 border border-red-500/50 backdrop-blur-sm shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-red-200 font-bold">LIVE RECORDING</span>
                      </div>
                      <Badge className="bg-red-500 text-white font-bold">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatTime(meetingDuration)}
                      </Badge>
                    </div>
                    <Button
                      onClick={stopMeeting}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold"
                    >
                      <Square className="w-4 h-4 mr-2" />
                      Stop Meeting
                    </Button>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-bold text-white">{meetingTitle}</h3>
                    <p className="text-gray-300">Live AI Analysis Active</p>
                  </div>
                </CardContent>
              </Card>

              {/* Live Transcript */}
              <Card className="bg-gradient-to-br from-black/60 to-gray-900/20 border border-gray-500/30 backdrop-blur-sm shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-gray-100">Live Transcript</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {liveTranscript.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">Waiting for speech...</p>
                    ) : (
                      liveTranscript.map((segment, idx) => (
                        <div key={idx} className="p-3 bg-gray-900/30 rounded-lg border border-gray-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">{segment.speaker}</Badge>
                            <Badge className={`text-xs ${getSentimentColor(segment.emotion)} bg-gray-800`}>
                              {segment.emotion}
                            </Badge>
                            <span className="text-xs text-gray-400">
                              {Math.round(segment.confidence * 100)}% confidence
                            </span>
                          </div>
                          <p className="text-gray-200">{segment.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Panel: Live Insights */}
            <div className="space-y-6">
              {/* Participants Status */}
              <Card className="bg-gradient-to-br from-black/60 to-blue-900/20 border border-blue-500/30 backdrop-blur-sm shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-blue-100 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Live Participants
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {participants.map((participant, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-blue-900/20 rounded-lg">
                      <div>
                        <p className="font-medium text-blue-100">{participant.name}</p>
                        <p className="text-xs text-blue-300">{participant.role}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          participant.status === 'speaking' ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                        }`}></div>
                        <span className="text-xs text-blue-200">{participant.status}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Live Insights */}
              <Card className="bg-gradient-to-br from-black/60 to-green-900/20 border border-green-500/30 backdrop-blur-sm shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-green-100 flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-green-200">Engagement Level</span>
                      <span className="text-sm font-bold text-green-100">
                        {Math.round(liveInsights.engagement_level)}%
                      </span>
                    </div>
                    <Progress value={liveInsights.engagement_level} className="h-2" />
                  </div>

                  <div>
                    <span className="text-sm text-green-200 block mb-2">Current Sentiment</span>
                    <Badge className={`${getSentimentColor(liveInsights.current_sentiment)} bg-green-900/30`}>
                      {liveInsights.current_sentiment}
                    </Badge>
                  </div>

                  <div>
                    <span className="text-sm text-green-200 block mb-2">Emerging Topics</span>
                    <div className="flex flex-wrap gap-2">
                      {liveInsights.key_topics_emerging.map((topic, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs bg-green-900/20 text-green-200">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Coaching */}
              <Card className="bg-gradient-to-br from-black/60 to-purple-900/20 border border-purple-500/30 backdrop-blur-sm shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-purple-100 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Live Coaching
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-green-900/20 rounded-lg border border-green-500/30">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-xs font-medium text-green-200">GREAT MOMENTUM</span>
                    </div>
                    <p className="text-xs text-green-100">
                      Balanced participation detected. All voices being heard.
                    </p>
                  </div>

                  <div className="p-3 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      <span className="text-xs font-medium text-yellow-200">SUGGESTION</span>
                    </div>
                    <p className="text-xs text-yellow-100">
                      Consider summarizing key points before moving to next topic.
                    </p>
                  </div>

                  <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-medium text-blue-200">INSIGHT</span>
                    </div>
                    <p className="text-xs text-blue-100">
                      Strong alignment on strategic priorities emerging.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}