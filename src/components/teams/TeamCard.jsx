import React, { useState } from 'react';
import { Team } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Crown, 
  Settings, 
  UserPlus, 
  UserMinus,
  Mail,
  Shield
} from 'lucide-react';

export default function TeamCard({ team, currentUser, onMemberUpdate }) {
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isCreator = team.created_by === currentUser?.email;
  const memberCount = team.members?.length || 0;

  const addMember = async () => {
    if (!newMemberEmail.trim()) return;
    
    setIsLoading(true);
    try {
      const updatedMembers = [...(team.members || []), newMemberEmail.trim()];
      await Team.update(team.id, { members: updatedMembers });
      setNewMemberEmail('');
      setShowAddMember(false);
      onMemberUpdate();
    } catch (error) {
      console.error('Error adding member:', error);
    }
    setIsLoading(false);
  };

  const removeMember = async (email) => {
    if (!isCreator) return;
    
    try {
      const updatedMembers = team.members.filter(member => member !== email);
      await Team.update(team.id, { members: updatedMembers });
      onMemberUpdate();
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-black/60 to-blue-900/20 border border-blue-500/30 backdrop-blur-sm shadow-2xl smooth-hover gpu-accelerated">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-blue-100 flex items-center gap-2">
              <Users className="w-5 h-5" />
              {team.name}
            </CardTitle>
            <p className="text-blue-200/80 mt-1">{team.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-500 text-white">
              {memberCount} members
            </Badge>
            {isCreator && (
              <Badge className="bg-amber-500 text-black">
                <Crown className="w-3 h-3 mr-1" />
                Owner
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Members List */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-blue-200">Team Members</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {team.members?.map((member, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-100 text-sm">{member}</span>
                  {team.created_by === member && (
                    <Shield className="w-3 h-3 text-amber-400" />
                  )}
                </div>
                {isCreator && member !== currentUser.email && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeMember(member)}
                    className="text-red-400 hover:bg-red-900/20"
                  >
                    <UserMinus className="w-3 h-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Add Member */}
        {isCreator && (
          <div className="space-y-3">
            {showAddMember ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter email address"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="bg-black/30 border-blue-500/30 text-blue-100"
                />
                <Button
                  onClick={addMember}
                  disabled={isLoading || !newMemberEmail.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? '...' : 'Add'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddMember(false)}
                  className="border-blue-500/50 text-blue-300"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setShowAddMember(true)}
                variant="outline"
                className="w-full border-blue-500/50 text-blue-300 hover:bg-blue-900/30"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}