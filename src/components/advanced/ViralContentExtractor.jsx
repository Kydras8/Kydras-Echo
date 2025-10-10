import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Flame,
  Share2, 
  Copy, 
  Download, 
  TrendingUp,
  Zap,
  Crown,
  Target
} from "lucide-react";

export default function ViralContentExtractor({ transcription }) {
  const [isExtracting, setIsExtracting] = useState(false);
  const [viralMoments, setViralMoments] = useState([
    {
      timestamp: "23:45",
      quote: "The future belongs to those who break limits, not follow them",
      speaker: "Sarah Johnson",
      viralityScore: 94,
      platforms: ["LinkedIn", "Twitter", "TikTok"],
      emotion: "Inspirational"
    },
    {
      timestamp: "12:30",
      quote: "Innovation isn't optional anymore - it's survival",
      speaker: "Mike Chen", 
      viralityScore: 89,
      platforms: ["LinkedIn", "Twitter"],
      emotion: "Urgent"
    },
    {
      timestamp: "35:12",
      quote: "We're not building products, we're creating legends",
      speaker: "Sarah Johnson",
      viralityScore: 91,
      platforms: ["Instagram", "LinkedIn", "TikTok"],
      emotion: "Visionary"
    }
  ]);

  const getViralityColor = (score) => {
    if (score >= 90) return "bg-red-100 text-red-800 border-red-200";
    if (score >= 80) return "bg-orange-100 text-orange-800 border-orange-200";
    return "bg-yellow-100 text-yellow-800 border-yellow-200";
  };

  const getEmotionColor = (emotion) => {
    switch (emotion) {
      case "Inspirational": return "bg-blue-100 text-blue-800";
      case "Urgent": return "bg-red-100 text-red-800";
      case "Visionary": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="bg-gradient-to-br from-black/60 to-red-900/20 border border-red-500/30 backdrop-blur-sm shadow-2xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Flame className="w-6 h-6 text-red-400" />
            <span className="text-red-100">Viral Content Extractor</span>
            <Badge className="bg-red-500 text-white text-xs">LEGENDARY</Badge>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black">
              <Crown className="w-4 h-4 mr-1" />
              Extract All
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Viral Score Overview */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-red-900/20 rounded-lg">
            <Flame className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-100">{viralMoments.length}</p>
            <p className="text-xs text-red-300">Viral Moments</p>
          </div>
          <div className="text-center p-3 bg-orange-900/20 rounded-lg">
            <TrendingUp className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-100">91%</p>
            <p className="text-xs text-orange-300">Avg Score</p>
          </div>
          <div className="text-center p-3 bg-yellow-900/20 rounded-lg">
            <Target className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-100">500K+</p>
            <p className="text-xs text-yellow-300">Est. Reach</p>
          </div>
        </div>

        {/* Viral Moments List */}
        <div className="space-y-4">
          <h4 className="font-semibold text-red-100 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            High-Impact Moments
          </h4>
          {viralMoments.map((moment, index) => (
            <div key={index} className="p-4 bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-xl border border-red-500/20">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{moment.timestamp}</Badge>
                  <Badge className={getEmotionColor(moment.emotion)}>{moment.emotion}</Badge>
                  <Badge className={`${getViralityColor(moment.viralityScore)} font-bold`}>
                    {moment.viralityScore}% viral
                  </Badge>
                </div>
              </div>
              
              <blockquote className="text-red-100 font-medium italic text-lg mb-3 pl-4 border-l-2 border-red-400">
                "{moment.quote}"
              </blockquote>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-red-300">— {moment.speaker}</span>
                  <div className="flex gap-1">
                    {moment.platforms.map((platform, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs bg-red-900/20 text-red-200">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-red-500/50 text-red-300 hover:bg-red-900/30">
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="border-red-500/50 text-red-300 hover:bg-red-900/30">
                    <Share2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Virality Progress */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-red-300 mb-1">
                  <span>Viral Potential</span>
                  <span>{moment.viralityScore}%</span>
                </div>
                <Progress value={moment.viralityScore} className="h-1" />
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white">
            <Flame className="w-4 h-4 mr-2" />
            Launch Viral Campaign
          </Button>
          <Button variant="outline" className="border-red-500/50 text-red-300 hover:bg-red-900/30">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>

        {/* Legendary Insight */}
        <div className="p-4 bg-gradient-to-r from-amber-900/30 to-yellow-900/20 rounded-lg border border-amber-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-amber-100">LEGENDARY INSIGHT</span>
          </div>
          <p className="text-sm text-amber-200">
            Your content contains <strong>3 moments with 90+ virality scores</strong> - this puts you in the top 1% of content creators. 
            Strategic posting across LinkedIn, Twitter, and TikTok could generate <strong>500,000+ impressions</strong> within 48 hours.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}