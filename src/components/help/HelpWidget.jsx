import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  X, 
  Sparkles, 
  Zap, 
  Upload, 
  Mic,
  FileText,
  Users
} from 'lucide-react';

export default function HelpWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const quickHelp = [
    {
      title: "Upload Your First File",
      description: "Drag and drop audio/video files to start transcribing",
      icon: Upload,
      action: "Go to Upload",
      path: "Upload"
    },
    {
      title: "Start Live Meeting",
      description: "Real-time AI transcription and insights during meetings",
      icon: Mic,
      action: "Start Meeting",
      path: "LiveMeeting"
    },
    {
      title: "Generate Viral Content",
      description: "Transform transcriptions into engaging social media posts",
      icon: Sparkles,
      action: "Content Studio",
      path: "ContentStudio"
    },
    {
      title: "Create Team",
      description: "Collaborate and share transcriptions with your team",
      icon: Users,
      action: "Manage Teams",
      path: "Teams"
    }
  ];

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-2xl shadow-blue-500/25"
      >
        <HelpCircle className="w-6 h-6 text-white" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-20 right-6 z-50 w-80 bg-gradient-to-br from-black/95 via-gray-900/95 to-blue-900/30 border border-blue-500/30 backdrop-blur-md shadow-2xl">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-blue-100 flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-400" />
            Quick Help
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-4 h-4 text-gray-400" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {quickHelp.map((help, index) => {
          const Icon = help.icon;
          return (
            <div key={index} className="p-3 bg-blue-900/20 rounded-lg border border-blue-500/20 hover:bg-blue-900/30 transition-colors cursor-pointer">
              <div className="flex items-start gap-3">
                <Icon className="w-5 h-5 text-blue-400 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-blue-100 text-sm">{help.title}</h4>
                  <p className="text-xs text-blue-200/80 mt-1">{help.description}</p>
                  <Badge variant="outline" className="mt-2 text-xs border-blue-500/50 text-blue-300">
                    {help.action}
                  </Badge>
                </div>
              </div>
            </div>
          );
        })}
        
        <div className="pt-3 border-t border-blue-500/20">
          <p className="text-xs text-blue-300/70 text-center">
            🔥 <strong>Pro Tip:</strong> Upload a meeting recording to unlock the full power of AI analysis
          </p>
        </div>
      </CardContent>
    </Card>
  );
}