import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Users, 
  Clock, 
  Target, 
  Brain,
  AlertTriangle,
  CheckCircle,
  MessageSquare
} from "lucide-react";

export default function MeetingInsights({ transcription, analytics }) {
  if (!analytics) {
    return (
      <Card className="bg-gradient-to-br from-black/60 to-purple-900/10 border border-purple-500/20 backdrop-blur-sm shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-purple-100">
            <Brain className="w-5 h-5 text-purple-400" />
            AI Meeting Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-purple-200/80">Processing advanced analytics...</p>
        </CardContent>
      </Card>
    );
  }

  const getEffectivenessColor = (score) => {
    if (score >= 80) return "text-green-100 bg-green-900/30";
    if (score >= 60) return "text-yellow-100 bg-yellow-900/30";
    return "text-red-100 bg-red-900/30";
  };

  return (
    <Card className="bg-gradient-to-br from-black/60 to-purple-900/10 border border-purple-500/20 backdrop-blur-sm shadow-2xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-5 h-5 text-purple-400" />
            <span className="text-purple-100">AI Meeting Insights</span>
          </div>
          <Badge className={`${getEffectivenessColor(analytics.meeting_effectiveness_score)} border-0`}>
            {analytics.meeting_effectiveness_score}% Effective
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-purple-200">Meeting Effectiveness</span>
            <span className="text-sm font-bold text-purple-100">{analytics.meeting_effectiveness_score}%</span>
          </div>
          <Progress value={analytics.meeting_effectiveness_score} className="h-2" />
          <p className="text-xs text-purple-300/80">
            Based on agenda adherence, participation balance, and outcome clarity
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-purple-100 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Speaker Analysis
          </h4>
          <div className="space-y-2">
            {analytics.speaker_participation?.map((speaker, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-purple-900/20 rounded-lg border border-purple-500/20">
                <div className="flex-1">
                  <p className="font-medium text-purple-100">{speaker.speaker_name}</p>
                  <p className="text-xs text-purple-300/80">
                    {speaker.talk_time_percentage}% talk time • {speaker.interruptions} interruptions
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`text-xs ${
                    speaker.engagement_score > 7 ? 'bg-green-900/30 text-green-200 border-green-500/30' : 
                    speaker.engagement_score > 5 ? 'bg-yellow-900/30 text-yellow-200 border-yellow-500/30' :
                    'bg-red-900/30 text-red-200 border-red-500/30'
                  }`}>
                    {speaker.engagement_score}/10
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-purple-100 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Communication Insights
          </h4>
          <div className="space-y-2">
            {analytics.communication_insights?.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-900/20 rounded-lg border border-blue-500/20">
                <TrendingUp className="w-4 h-4 text-blue-400 mt-0.5" />
                <p className="text-sm text-blue-200">{insight}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-purple-100 flex items-center gap-2">
            <Target className="w-4 h-4" />
            AI Recommendations
          </h4>
          <div className="space-y-2">
            {analytics.follow_up_suggestions?.map((suggestion, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-green-900/20 rounded-lg border border-green-500/20">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                <p className="text-sm text-green-200">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}