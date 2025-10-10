import React, { useState, useEffect } from "react";
import { Transcription } from "@/api/entities";
import { ContentGeneration } from "@/api/entities";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Sparkles, 
  FileText, 
  Share2, 
  Mail, 
  Presentation, 
  Zap,
  Crown,
  Flame,
  Search,
  Filter
} from "lucide-react";
import ContentGenerator from "../components/content/ContentGenerator";

export default function ContentStudio() {
  const [transcriptions, setTranscriptions] = useState([]);
  const [contentGenerations, setContentGenerations] = useState([]);
  const [selectedTranscription, setSelectedTranscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showGenerator, setShowGenerator] = useState(false);

  useEffect(() => {
    loadStudioData();
  }, []);

  const loadStudioData = async () => {
    setIsLoading(true);
    try {
      // RLS automatically filters to user's content
      const [transcriptionData, contentData] = await Promise.all([
        Transcription.list("-created_date", 50),
        ContentGeneration.list("-created_date", 20)
      ]);
      
      setTranscriptions(transcriptionData);
      setContentGenerations(contentData);
    } catch (error) {
      console.error("Error loading content studio data:", error);
    }
    setIsLoading(false);
  };

  const filteredTranscriptions = transcriptions.filter(t =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <div className="text-center gpu-accelerated">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500/20 border-t-amber-400 mx-auto mb-6"></div>
          <p className="text-amber-200 font-medium">Loading Content Studio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
            CONTENT STUDIO
          </h1>
          <p className="text-xl text-gray-300">
            Transform your transcriptions into <span className="text-purple-400 font-semibold">viral content</span>
          </p>
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 text-sm font-bold">
            <Crown className="w-4 h-4 mr-2" />
            AI CONTENT GENERATOR
          </Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel: Source Selection */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-gradient-to-br from-black/60 to-purple-900/20 border border-purple-500/30 backdrop-blur-sm shadow-2xl">
              <CardHeader>
                <CardTitle className="text-purple-100">Select Source Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400/70" />
                  <Input
                    placeholder="Search transcriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-black/30 border-purple-500/30 text-purple-100"
                  />
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredTranscriptions.map((transcription) => (
                    <div
                      key={transcription.id}
                      onClick={() => {
                        setSelectedTranscription(transcription);
                        setShowGenerator(true);
                      }}
                      className={`p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
                        selectedTranscription?.id === transcription.id
                          ? "bg-purple-500/20 border-purple-400"
                          : "bg-purple-900/20 border-purple-500/30 hover:bg-purple-500/10"
                      }`}
                    >
                      <h4 className="font-medium text-purple-100 truncate">{transcription.title}</h4>
                      <p className="text-xs text-purple-300/80 mt-1">
                        {transcription.duration_minutes} min • {transcription.word_count} words
                      </p>
                      {transcription.key_topics?.slice(0, 2).map((topic, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs mt-1 mr-1 bg-purple-900/20 text-purple-200">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Generations */}
            <Card className="bg-gradient-to-br from-black/60 to-green-900/20 border border-green-500/30 backdrop-blur-sm shadow-2xl">
              <CardHeader>
                <CardTitle className="text-green-100">Recent Generations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {contentGenerations.slice(0, 5).map((content, idx) => (
                    <div key={idx} className="p-3 bg-green-900/20 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <Badge className="bg-green-500 text-white text-xs">
                          {content.content_type}
                        </Badge>
                        <span className="text-xs text-green-300">
                          {new Date(content.created_date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-green-100 truncate">
                        {content.generated_content.substring(0, 50)}...
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel: Content Generator */}
          <div className="lg:col-span-2">
            {!selectedTranscription ? (
              <Card className="bg-gradient-to-br from-black/60 to-gray-900/20 border border-gray-500/30 backdrop-blur-sm shadow-2xl h-96">
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">Select Content to Transform</h3>
                    <p className="text-gray-500">Choose a transcription from the left panel to start generating content</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <ContentGenerator 
                transcription={selectedTranscription} 
                onContentGenerated={loadStudioData}
              />
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-900/30 to-purple-900/20 border border-blue-500/30 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-6 text-center">
              <FileText className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <p className="text-2xl font-bold text-blue-100">{transcriptions.length}</p>
              <p className="text-blue-400/80 text-sm">Source Content</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 border border-green-500/30 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-6 text-center">
              <Zap className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <p className="text-2xl font-bold text-green-100">{contentGenerations.length}</p>
              <p className="text-green-400/80 text-sm">Generated</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/30 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-6 text-center">
              <Flame className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <p className="text-2xl font-bold text-purple-100">94%</p>
              <p className="text-purple-400/80 text-sm">Avg Quality</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-900/30 to-red-900/20 border border-orange-500/30 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-6 text-center">
              <Share2 className="w-8 h-8 text-orange-400 mx-auto mb-3" />
              <p className="text-2xl font-bold text-orange-100">12K+</p>
              <p className="text-orange-400/80 text-sm">Est. Reach</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}