import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Transcription } from "@/api/entities";
import { Analytics } from "@/api/entities";
import { User } from "@/api/entities";
import { Team } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Download, 
  Share2 as ShareIcon,
  FileText, 
  Brain,
  Sparkles,
  Users,
  Clock,
  Target,
  Crown,
  Flame,
  Zap
} from "lucide-react";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import MeetingInsights from "../components/analytics/MeetingInsights";
import ContentGenerator from "../components/content/ContentGenerator";
import ViralContentExtractor from "../components/advanced/ViralContentExtractor";
import ShareModal from "../components/sharing/ShareModal";

export default function TranscriptionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transcription, setTranscription] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const loadTranscriptionDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      // RLS now ensures we only get a result if the user has access.
      const transcriptionData = await Transcription.filter({ id: id });
      
      if (transcriptionData.length > 0) {
        setTranscription(transcriptionData[0]);
        
        // Load associated analytics. RLS also protects this entity.
        const analyticsData = await Analytics.filter({ 
          transcription_id: id
        }, "-created_date", 1);
        
        if (analyticsData.length > 0) {
          setAnalytics(analyticsData[0]);
        }
      } else {
        // If no data is returned, user either provided a bad ID or has no access.
        setTranscription(null);
      }
    } catch (error) {
      console.error("Error loading transcription:", error);
      setTranscription(null);
      setAnalytics(null);
    }
    setIsLoading(false);
  }, [id]);

  useEffect(() => {
    loadTranscriptionDetails();
  }, [loadTranscriptionDetails]);

  const handleDownload = () => {
    const content = transcription.processed_content || transcription.raw_transcription;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${transcription.title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500/20 border-t-amber-400 mx-auto mb-6"></div>
          <p className="text-amber-200">Loading transcription details...</p>
        </div>
      </div>
    );
  }

  if (!transcription) {
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-amber-100 mb-2">Transcription Not Found</h1>
          <p className="text-amber-300 mb-4">This transcription may not exist or you don't have permission to view it.</p>
          <Button onClick={() => navigate(createPageUrl("Library"))} className="kydras-gradient text-black font-bold">
            Return to Library
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(createPageUrl("Library"))}
              className="rounded-xl border-amber-500/50 text-amber-300 hover:bg-amber-900/30"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold kydras-text">{transcription.title}</h1>
              <p className="text-amber-400/70 mt-1">
                {transcription.original_filename} • {format(new Date(transcription.created_date), "MMM d, yyyy")}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleDownload} className="border-amber-500/50 text-amber-300 hover:bg-amber-900/30">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button onClick={() => setIsShareModalOpen(true)} className="kydras-gradient text-black font-bold">
                <ShareIcon className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Main Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column: Transcript & Core Info */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-gradient-to-br from-black/60 to-amber-900/10 border border-amber-500/20 backdrop-blur-sm shadow-2xl">
              <CardHeader>
                <CardTitle className="text-amber-100">Full Transcript</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none text-amber-50 leading-relaxed whitespace-pre-wrap max-h-[600px] overflow-y-auto p-4 bg-black/30 rounded-lg border border-amber-500/20">
                  {transcription.processed_content || transcription.raw_transcription}
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-8">
              {transcription.key_topics?.length > 0 && (
                <Card className="bg-gradient-to-br from-black/60 to-blue-900/20 border border-blue-500/30 backdrop-blur-sm shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-blue-100 text-lg">Key Topics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {transcription.key_topics.map((topic, index) => (
                        <Badge key={index} className="bg-blue-900/50 text-blue-200 border-blue-500/30">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {transcription.action_items?.length > 0 && (
                <Card className="bg-gradient-to-br from-black/60 to-green-900/20 border border-green-500/30 backdrop-blur-sm shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-green-100 text-lg">Action Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {transcription.action_items.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></div>
                          <p className="text-sm text-green-100">{item}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Right Column: AI Features */}
          <div className="space-y-8">
            <Card className="bg-gradient-to-br from-black/60 to-purple-900/20 border border-purple-500/30 backdrop-blur-sm shadow-2xl">
                <CardHeader>
                    <CardTitle className="text-purple-100 text-lg flex items-center gap-2">
                        <Crown className="w-5 h-5 text-amber-400" />
                        AI God Mode
                    </CardTitle>
                </CardHeader>
                <CardContent>
                     <p className="text-purple-200/80 text-sm mb-4">Unleash the full power of Kydras Echo. Generate viral content, launch campaigns, and get strategic insights in seconds.</p>
                     <Button className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-bold">
                        <Zap className="w-4 h-4 mr-2" />
                        Activate AI Co-Pilot
                    </Button>
                </CardContent>
            </Card>

            <ViralContentExtractor transcription={transcription} />

            {transcription.speakers?.length > 0 && (
              <Card className="bg-gradient-to-br from-black/60 to-cyan-900/20 border border-cyan-500/30 backdrop-blur-sm shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-cyan-100 text-lg">Speakers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {transcription.speakers.map((speaker, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-cyan-900/20 rounded-lg">
                        <span className="font-medium text-cyan-100">{speaker.name}</span>
                        <Badge variant="outline" className="border-cyan-500/50 text-cyan-200">{speaker.segments} segments</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        </div>
      </div>
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        transcription={transcription}
      />
    </>
  );
}