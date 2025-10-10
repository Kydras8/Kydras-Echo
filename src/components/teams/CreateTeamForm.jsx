import React, { useState } from 'react';
import { Team } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Plus, 
  X,
  Mail,
  CheckCircle
} from 'lucide-react';

export default function CreateTeamForm({ currentUser, onTeamCreated }) {
  const [teamName, setTeamName] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState([currentUser?.email || '']);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const addMember = () => {
    const email = newMemberEmail.trim();
    if (email && !members.includes(email)) {
      setMembers([...members, email]);
      setNewMemberEmail('');
    }
  };

  const removeMember = (email) => {
    if (email !== currentUser?.email) { // Can't remove creator
      setMembers(members.filter(member => member !== email));
    }
  };

  const createTeam = async (e) => {
    e.preventDefault();
    if (!teamName.trim()) return;

    setIsCreating(true);
    try {
      const newTeam = await Team.create({
        name: teamName.trim(),
        description: description.trim(),
        members: members
      });
      
      onTeamCreated(newTeam);
    } catch (error) {
      console.error('Error creating team:', error);
    }
    setIsCreating(false);
  };

  return (
    <Card className="bg-gradient-to-br from-black/60 to-blue-900/20 border border-blue-500/30 backdrop-blur-sm shadow-2xl">
      <CardHeader>
        <CardTitle className="text-blue-100 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Create New Team
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={createTeam} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">
              Team Name *
            </label>
            <Input
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter team name"
              className="bg-black/30 border-blue-500/30 text-blue-100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">
              Description (Optional)
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your team's purpose"
              className="bg-black/30 border-blue-500/30 text-blue-100 h-20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">
              Team Members
            </label>
            
            {/* Add Member Input */}
            <div className="flex gap-2 mb-3">
              <Input
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                placeholder="Enter member email"
                className="bg-black/30 border-blue-500/30 text-blue-100"
              />
              <Button
                type="button"
                onClick={addMember}
                disabled={!newMemberEmail.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Members List */}
            <div className="space-y-2">
              {members.map((member, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-900/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-100">{member}</span>
                    {member === currentUser?.email && (
                      <Badge className="bg-amber-500 text-black text-xs">You</Badge>
                    )}
                  </div>
                  {member !== currentUser?.email && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => removeMember(member)}
                      className="text-red-400 hover:bg-red-900/20"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isCreating || !teamName.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3"
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-3"></div>
                Creating Team...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Create Team
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}