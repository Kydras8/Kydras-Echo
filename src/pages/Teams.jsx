
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Team } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Users, Crown, Shield } from "lucide-react";
import TeamCard from "../components/teams/TeamCard";
import CreateTeamForm from "../components/teams/CreateTeamForm";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      const allTeams = await Team.list();
      // Filter teams where the current user is a member
      const userTeams = allTeams.filter(team => team.members.includes(currentUser.email));
      setTeams(userTeams);
    } catch (error) {
      console.error("Error loading teams data:", error);
    }
    setIsLoading(false);
  };

  const handleTeamCreated = (newTeam) => {
    setTeams([...teams, newTeam]);
    setShowCreateForm(false);
  };

  // handleMemberUpdate is replaced by directly calling loadTeams

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <LoadingSpinner message="Loading teams..." theme="blue" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="smooth-hover">
            <h1 className="text-4xl md:text-5xl font-bold kydras-text">
              Team Collaboration Hub
            </h1>
            <p className="text-amber-300/80 mt-2 text-lg">
              Manage your teams and shared content libraries.
            </p>
          </div>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="kydras-gradient text-black font-bold px-8 py-3 text-lg shadow-lg smooth-hover gpu-accelerated relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <Plus className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-180" />
            {showCreateForm ? "Cancel" : "Create New Team"}
          </Button>
        </div>

        {/* Create Team Form */}
        {showCreateForm && (
          <CreateTeamForm
            currentUser={user}
            onTeamCreated={handleTeamCreated}
          />
        )}

        {/* Teams Grid or Empty State */}
        {teams.length === 0 && !showCreateForm ? (
          <EmptyState
            icon={Users}
            title="No Teams Yet"
            description="Create your first team to start collaborating"
            actionLabel="Create Your First Team"
            onAction={() => setShowCreateForm(true)}
            theme="blue"
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                currentUser={user}
                onMemberUpdate={loadTeams}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
