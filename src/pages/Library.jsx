
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Transcription } from "@/api/entities";
import { Team } from "@/api/entities";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  FileText,
  Plus,
} from "lucide-react";
import { createPageUrl } from "@/utils";
import TranscriptionCard from "../components/transcriptions/TranscriptionCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";

export default function Library() {
  const [allTranscriptions, setAllTranscriptions] = useState([]);
  const [filteredTranscriptions, setFilteredTranscriptions] = useState([]);
  const [user, setUser] = useState(null);
  const [userTeams, setUserTeams] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterTeam, setFilterTeam] = useState("all");
  const [filterTemplate, setFilterTemplate] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLibraryData();
  }, []);

  const filterAndSortTranscriptions = useCallback(() => {
    let filtered = allTranscriptions;

    // Team filter
    if (filterTeam === "personal") {
      filtered = filtered.filter(t => !t.team_id);
    } else if (filterTeam !== "all") {
      filtered = filtered.filter(t => t.team_id === filterTeam);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.key_topics?.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Template filter
    if (filterTemplate !== "all") {
      filtered = filtered.filter(t => t.template_type === filterTemplate);
    }

    setFilteredTranscriptions(filtered);
  }, [allTranscriptions, searchTerm, filterTeam, filterTemplate]);

  useEffect(() => {
    filterAndSortTranscriptions();
  }, [filterAndSortTranscriptions]);

  const loadLibraryData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      // Load all data
      // RLS now handles security, so Transcription.list() will only return accessible items.
      const [transcriptionData, teamData] = await Promise.all([
        Transcription.list("-created_date", 200),
        Team.list()
      ]);

      // We still need user's teams for the filter dropdown.
      const memberTeams = teamData.filter(team => team.members.includes(currentUser.email));
      setUserTeams(memberTeams);
      
      setAllTranscriptions(transcriptionData);

    } catch (error) {
      console.error("Error loading library data:", error);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <LoadingSpinner message="Loading your legendary library..." theme="amber" />
      </div>
    );
  }

  if (filteredTranscriptions.length === 0 && !searchTerm && filterTeam === "all" && filterTemplate === "all") {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <EmptyState
            icon={FileText}
            title="No Transcriptions Yet"
            description="Ready to create your first legendary transcription?"
            actionLabel="Upload Your First File"
            onAction={() => window.location.href = createPageUrl("Upload")}
            theme="amber"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 gpu-accelerated">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="smooth-hover">
            <h1 className="text-4xl md:text-5xl font-bold kydras-text">
              Content Library
            </h1>
            <p className="text-amber-300/80 mt-2 text-lg">
              {allTranscriptions.length} total • {filteredTranscriptions.length} showing
            </p>
          </div>
          <Button
            className="kydras-gradient text-black font-bold px-8 py-3 text-lg shadow-lg smooth-hover gpu-accelerated relative overflow-hidden group"
            asChild
          >
            <Link to={createPageUrl("Upload")}>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <Plus className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-180" />
              New Upload
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card className="bg-gradient-to-br from-black/60 to-amber-900/10 border border-amber-500/20 backdrop-blur-sm shadow-2xl smooth-hover gpu-accelerated">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-400/70 transition-all duration-300" />
                  <Input
                    placeholder="Search transcriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-black/30 border-amber-500/30 text-amber-100 placeholder:text-amber-400/50 smooth-hover focus:border-amber-400 focus:ring-amber-400/30"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <select
                  value={filterTeam}
                  onChange={(e) => setFilterTeam(e.target.value)}
                  className="px-4 py-2 bg-black/30 border border-amber-500/30 rounded-md text-amber-100 text-sm smooth-hover focus:border-amber-400"
                >
                  <option value="all">All Content</option>
                  <option value="personal">Personal</option>
                  {userTeams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
                <select
                  value={filterTemplate}
                  onChange={(e) => setFilterTemplate(e.target.value)}
                  className="px-4 py-2 bg-black/30 border border-amber-500/30 rounded-md text-amber-100 text-sm smooth-hover focus:border-amber-400"
                >
                  <option value="all">All Types</option>
                  <option value="general">General</option>
                  <option value="meeting">Meeting</option>
                  <option value="interview">Interview</option>
                  <option value="lecture">Lecture</option>
                  <option value="podcast">Podcast</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transcriptions Grid */}
        {filteredTranscriptions.length === 0 ? (
           <Card className="bg-gradient-to-br from-black/60 to-amber-900/10 border border-amber-500/20 backdrop-blur-sm shadow-2xl smooth-hover">
            <CardContent className="text-center py-16">
              <FileText className="w-20 h-20 text-amber-600/50 mx-auto mb-6 animate-bounce" />
              <h3 className="text-2xl font-semibold text-amber-200 mb-3">
                No matching transcriptions
              </h3>
              <p className="text-amber-400/70 mb-8 text-lg">
                Try adjusting your search or filter criteria
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredTranscriptions.map((transcription, index) => {
              const team = userTeams.find(t => t.id === transcription.team_id);
              return (
                <TranscriptionCard
                  key={transcription.id}
                  transcription={transcription}
                  team={team}
                  index={index}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
}
