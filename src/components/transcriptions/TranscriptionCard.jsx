import React from 'react';
import { Link } from "react-router-dom";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Play, 
  Calendar,
  Clock,
  Target,
  Users,
  Sparkles
} from "lucide-react";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";

export default function TranscriptionCard({ transcription, team, index = 0 }) {

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "processing": return "bg-blue-100 text-blue-800 animate-pulse";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTemplateColor = (template) => {
    switch (template) {
      case "meeting": return "bg-blue-100 text-blue-800";
      case "interview": return "bg-purple-100 text-purple-800";
      case "lecture": return "bg-green-100 text-green-800";
      case "podcast": return "bg-orange-100 text-orange-800";
      case "custom": return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getViralityIndicator = () => {
    // Simulate virality score based on confidence and topics
    const viralityScore = transcription.confidence_score > 90 && transcription.key_topics?.length > 5 
      ? Math.round(75 + Math.random() * 20) 
      : Math.round(40 + Math.random() * 35);
    
    if (viralityScore > 85) {
      return (
        <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse">
          <Sparkles className="w-3 h-3 mr-1" />
          {viralityScore}% Viral
        </Badge>
      );
    }
    return null;
  };

  return (
    <Card 
      className="bg-gradient-to-br from-black/60 to-amber-900/10 border border-amber-500/20 backdrop-blur-sm shadow-2xl hover:border-amber-400/40 transition-all duration-500 smooth-hover gpu-accelerated group hover:scale-[1.02] hover:shadow-3xl"
      style={{ 
        animationDelay: `${index * 100}ms`,
        animation: `fadeInUp 0.6s ease-out forwards`
      }}
    >
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Main Info */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg md:text-xl font-bold text-amber-100 hover:text-amber-300 transition-colors group-hover:text-amber-200 truncate">
                  <Link to={createPageUrl(`TranscriptionDetails/${transcription.id}`)}>
                    {transcription.title}
                  </Link>
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {team && (
                    <Badge variant="outline" className="text-xs bg-gray-800 text-gray-300 border-gray-600 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span className="truncate max-w-20">{team.name}</span>
                    </Badge>
                  )}
                  {getViralityIndicator()}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className={getStatusColor(transcription.processing_status || "completed")}>
                  {transcription.processing_status || "completed"}
                </Badge>
                <Badge className={getTemplateColor(transcription.template_type)}>
                  {transcription.template_type}
                </Badge>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm text-amber-400/80">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {format(new Date(transcription.created_date), "MMM d, yyyy")}
                </span>
                <span className="sm:hidden">
                  {format(new Date(transcription.created_date), "MMM d")}
                </span>
              </span>
              {transcription.duration_minutes && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {Math.round(transcription.duration_minutes)} min
                </span>
              )}
              {transcription.word_count && (
                <span className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  <span className="hidden md:inline">{transcription.word_count.toLocaleString()} words</span>
                  <span className="md:hidden">{Math.round(transcription.word_count/1000)}K</span>
                </span>
              )}
              {transcription.confidence_score && (
                <span className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  {Math.round(transcription.confidence_score)}%
                </span>
              )}
            </div>

            {/* Key Topics */}
            {transcription.key_topics && transcription.key_topics.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {transcription.key_topics.slice(0, 4).map((topic, topicIndex) => (
                  <Badge 
                    key={topicIndex} 
                    variant="outline" 
                    className="text-xs bg-amber-900/20 text-amber-300 border-amber-500/30 transition-all duration-300 hover:bg-amber-800/30 truncate max-w-24 md:max-w-none"
                    title={topic}
                  >
                    {topic}
                  </Badge>
                ))}
                {transcription.key_topics.length > 4 && (
                  <Badge variant="outline" className="text-xs bg-amber-900/20 text-amber-300 border-amber-500/30">
                    +{transcription.key_topics.length - 4}
                  </Badge>
                )}
              </div>
            )}

            {/* Preview */}
            {transcription.processed_content && (
              <p className="text-amber-200/80 text-sm line-clamp-2 group-hover:text-amber-200/90 transition-colors hidden sm:block">
                {transcription.processed_content.substring(0, 150)}...
              </p>
            )}
          </div>

          {/* Action Button */}
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="sm"
              className="border-amber-500/50 text-amber-300 hover:bg-amber-900/30 hover:border-amber-400 hover:scale-105 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-amber-500/20 w-full sm:w-auto"
              asChild
            >
              <Link to={createPageUrl(`TranscriptionDetails/${transcription.id}`)}>
                <Play className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
                <span className="hidden sm:inline">View Details</span>
                <span className="sm:hidden">View</span>
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}