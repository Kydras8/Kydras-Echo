import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Transcription } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  FileText, 
  Zap, 
  Filter,
  Clock,
  Target,
  TrendingUp
} from "lucide-react";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import TranscriptionCard from "../components/transcriptions/TranscriptionCard";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function SearchHub() {
  const [transcriptions, setTranscriptions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchMode, setSearchMode] = useState("all");
  const [suggestions, setSuggestions] = useState([
    "Q4 strategy", "product roadmap", "team meeting", "customer feedback", "innovation"
  ]);

  useEffect(() => {
    loadSearchData();
  }, []);

  const performSearch = useCallback(() => {
    const query = searchTerm.toLowerCase();
    let results = transcriptions.filter(t => {
      const titleMatch = t.title.toLowerCase().includes(query);
      const contentMatch = t.processed_content?.toLowerCase().includes(query) || 
                           t.raw_transcription?.toLowerCase().includes(query);
      const topicMatch = t.key_topics?.some(topic => 
        topic.toLowerCase().includes(query)
      );
      const actionMatch = t.action_items?.some(item => 
        item.toLowerCase().includes(query)
      );

      switch (searchMode) {
        case "title":
          return titleMatch;
        case "content":
          return contentMatch;
        case "topics":
          return topicMatch;
        case "actions":
          return actionMatch;
        default:
          return titleMatch || contentMatch || topicMatch || actionMatch;
      }
    });

    // Sort by relevance (simple scoring based on title vs content matches)
    results.sort((a, b) => {
      const aScore = (a.title.toLowerCase().includes(query) ? 10 : 0) +
                     (a.key_topics?.some(t => t.toLowerCase().includes(query)) ? 5 : 0);
      const bScore = (b.title.toLowerCase().includes(query) ? 10 : 0) +
                     (b.key_topics?.some(t => t.toLowerCase().includes(query)) ? 5 : 0);
      return bScore - aScore;
    });

    setSearchResults(results);
  }, [searchTerm, searchMode, transcriptions]);

  useEffect(() => {
    if (searchTerm.length > 0) {
      performSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, performSearch]);

  const loadSearchData = async () => {
    setIsLoading(true);
    try {
      // RLS will automatically filter to user's accessible transcriptions
      const transcriptionData = await Transcription.list("-created_date", 200);
      setTranscriptions(transcriptionData);
    } catch (error) {
      console.error("Error loading search data:", error);
    }
    setIsLoading(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <LoadingSpinner message="Loading search hub..." theme="blue" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            SEARCH HUB
          </h1>
          <p className="text-xl text-blue-200/90">
            Find any insight in <span className="text-blue-400 font-semibold">seconds</span>
          </p>
          <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 text-sm font-bold">
            <Zap className="w-4 h-4 mr-2" />
            AI-POWERED SEARCH
          </Badge>
        </div>

        {/* Search Interface */}
        <Card className="bg-gradient-to-br from-black/60 to-blue-900/20 border border-blue-500/30 backdrop-blur-sm shadow-2xl">
          <CardContent className="p-6 space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400/70" />
              <Input
                placeholder="Search transcriptions, topics, action items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 bg-black/30 border-blue-500/30 text-blue-100 text-lg placeholder:text-blue-400/50 focus:border-blue-400"
              />
            </div>

            {/* Search Modes */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: "all", label: "All Content" },
                { key: "title", label: "Titles Only" },
                { key: "content", label: "Full Content" },
                { key: "topics", label: "Topics" },
                { key: "actions", label: "Action Items" }
              ].map(mode => (
                <Button
                  key={mode.key}
                  variant={searchMode === mode.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSearchMode(mode.key)}
                  className={searchMode === mode.key
                    ? "bg-blue-600 text-white"
                    : "border-blue-500/50 text-blue-300 hover:bg-blue-900/30"
                  }
                >
                  {mode.label}
                </Button>
              ))}
            </div>

            {/* Search Suggestions */}
            {!searchTerm && (
              <div>
                <p className="text-sm text-blue-200 mb-3">Popular searches:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-3 py-1 bg-blue-900/20 border border-blue-500/30 rounded-full text-blue-200 text-sm hover:bg-blue-800/30 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchTerm && (
          <Card className="bg-gradient-to-br from-black/60 to-blue-900/20 border border-blue-500/30 backdrop-blur-sm shadow-2xl">
            <CardHeader>
              <CardTitle className="text-blue-100 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Search Results ({searchResults.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {searchResults.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-blue-600/50 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-blue-200 mb-2">No results found</h3>
                  <p className="text-blue-300/70">Try adjusting your search terms or search mode</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {searchResults.map((transcription, index) => (
                    <TranscriptionCard
                      key={transcription.id}
                      transcription={transcription}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Search Stats */}
        {!searchTerm && (
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-900/30 to-cyan-900/20 border border-blue-500/30 backdrop-blur-sm shadow-xl">
              <CardContent className="p-6 text-center">
                <FileText className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                <p className="text-2xl font-bold text-blue-100">{transcriptions.length}</p>
                <p className="text-blue-300/80 font-medium">Searchable Files</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-900/30 to-blue-900/20 border border-green-500/30 backdrop-blur-sm shadow-xl">
              <CardContent className="p-6 text-center">
                <Target className="w-10 h-10 text-green-400 mx-auto mb-3" />
                <p className="text-2xl font-bold text-green-100">
                  {transcriptions.reduce((sum, t) => sum + (t.key_topics?.length || 0), 0)}
                </p>
                <p className="text-green-300/80 font-medium">Topics Indexed</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/30 backdrop-blur-sm shadow-xl">
              <CardContent className="p-6 text-center">
                <Clock className="w-10 h-10 text-purple-400 mx-auto mb-3" />
                <p className="text-2xl font-bold text-purple-100">
                  {Math.round(transcriptions.reduce((sum, t) => sum + (t.duration_minutes || 0), 0))}
                </p>
                <p className="text-purple-300/80 font-medium">Minutes Searchable</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}