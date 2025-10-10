
import React, { useState, useEffect, useCallback } from "react";
import { IntegrationSetting } from "@/api/entities";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Zap, 
  Link as LinkIcon,
  CheckCircle, 
  AlertCircle,
  Settings,
  ExternalLink,
  Slack,
  Video,
  Calendar,
  Mail
} from "lucide-react";

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState({
    slack: { service_name: "slack", is_connected: false, settings: { default_channel: "" } },
    zoom: { service_name: "zoom", is_connected: false, settings: { auto_record: true } },
    google_calendar: { service_name: "google_calendar", is_connected: false, settings: { auto_sync: true } }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const integrationMeta = {
    slack: { 
      name: "Slack", 
      icon: Slack, 
      description: "Post summaries & insights to channels.",
      color: "bg-green-500"
    },
    zoom: { 
      name: "Zoom", 
      icon: Video, 
      description: "Auto-transcribe meeting recordings.",
      color: "bg-blue-500"
    },
    google_calendar: { 
      name: "Google Calendar", 
      icon: Calendar, 
      description: "Sync meeting notes to events.",
      color: "bg-orange-500"
    }
  };

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      // RLS automatically filters to user's settings
      const settings = await IntegrationSetting.list();
      
      // Use functional update to avoid dependency on current integrations state
      setIntegrations(currentIntegrations => {
        const newIntegrations = { ...currentIntegrations };
        settings.forEach(setting => {
          if (newIntegrations[setting.service_name]) {
            newIntegrations[setting.service_name] = { ...newIntegrations[setting.service_name], ...setting };
          }
        });
        return newIntegrations;
      });

    } catch (error) {
      console.error("Error loading integration settings:", error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleConnection = async (serviceName) => {
    const integration = integrations[serviceName];
    const newStatus = !integration.is_connected;

    try {
      // Simulate API connection (in real app, this would connect to OAuth)
      const updatedIntegration = {
        ...integration,
        is_connected: newStatus
      };

      if (integration.id) {
        await IntegrationSetting.update(integration.id, updatedIntegration);
      } else {
        const created = await IntegrationSetting.create(updatedIntegration);
        updatedIntegration.id = created.id;
      }

      setIntegrations(prev => ({
        ...prev,
        [serviceName]: updatedIntegration
      }));
    } catch (error) {
      console.error(`Error toggling ${serviceName} connection:`, error);
    }
  };

  const updateSettings = async (serviceName, newSettings) => {
    const integration = integrations[serviceName];
    
    try {
      const updatedIntegration = {
        ...integration,
        settings: { ...integration.settings, ...newSettings }
      };

      if (integration.id) {
        await IntegrationSetting.update(integration.id, updatedIntegration);
      }

      setIntegrations(prev => ({
        ...prev,
        [serviceName]: updatedIntegration
      }));
    } catch (error) {
      console.error(`Error updating ${serviceName} settings:`, error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500/20 border-t-amber-400 mx-auto mb-6"></div>
          <p className="text-amber-200">Loading integration hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
            INTEGRATION HUB
          </h1>
          <p className="text-xl text-gray-300">
            Connect your favorite tools and <span className="text-blue-400 font-semibold">supercharge your workflow</span>
          </p>
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 text-sm font-bold">
            <Zap className="w-4 h-4 mr-2" />
            POWERED BY AI
          </Badge>
        </div>

        {/* Integration Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(integrationMeta).map(([serviceName, meta]) => {
            const integration = integrations[serviceName];
            const Icon = meta.icon;
            
            return (
              <Card key={serviceName} className="bg-gradient-to-br from-black/60 to-gray-900/20 border border-gray-500/30 backdrop-blur-sm shadow-2xl smooth-hover gpu-accelerated group hover:border-gray-400/50 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 ${meta.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-gray-100">{meta.name}</CardTitle>
                        <p className="text-sm text-gray-400 mt-1">{meta.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {integration.is_connected ? (
                        <Badge className="bg-green-500 text-white">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-gray-500 text-gray-400">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Not Connected
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Connection Status</span>
                    <Switch
                      checked={integration.is_connected}
                      onCheckedChange={() => toggleConnection(serviceName)}
                    />
                  </div>

                  {integration.is_connected && (
                    <div className="space-y-3 pt-3 border-t border-gray-500/20">
                      <h4 className="text-sm font-medium text-gray-200 flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Settings
                      </h4>
                      
                      {serviceName === 'slack' && (
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Default Channel</label>
                          <Input
                            placeholder="#general"
                            value={integration.settings.default_channel || ''}
                            onChange={(e) => updateSettings(serviceName, { default_channel: e.target.value })}
                            className="bg-black/30 border-gray-500/30 text-gray-100 text-sm"
                          />
                        </div>
                      )}
                      
                      {serviceName === 'zoom' && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">Auto-record meetings</span>
                          <Switch
                            checked={integration.settings.auto_record || false}
                            onCheckedChange={(checked) => updateSettings(serviceName, { auto_record: checked })}
                          />
                        </div>
                      )}
                      
                      {serviceName === 'google_calendar' && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">Auto-sync meeting notes</span>
                          <Switch
                            checked={integration.settings.auto_sync || false}
                            onCheckedChange={(checked) => updateSettings(serviceName, { auto_sync: checked })}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <Button 
                    className={`w-full ${integration.is_connected ? 'bg-gray-600 hover:bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                    onClick={() => toggleConnection(serviceName)}
                  >
                    {integration.is_connected ? (
                      <>
                        <LinkIcon className="w-4 h-4 mr-2" />
                        Disconnect
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Connect {meta.name}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Coming Soon Section */}
        <Card className="bg-gradient-to-br from-black/60 to-purple-900/20 border border-purple-500/30 backdrop-blur-sm shadow-2xl">
          <CardHeader>
            <CardTitle className="text-purple-100">Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: "Microsoft Teams", icon: Video, description: "Team collaboration integration" },
                { name: "Gmail", icon: Mail, description: "Email automation and summaries" },
                { name: "Notion", icon: Settings, description: "Knowledge base sync" }
              ].map((future, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 bg-purple-900/20 rounded-lg">
                  <future.icon className="w-8 h-8 text-purple-400" />
                  <div>
                    <h4 className="font-medium text-purple-200">{future.name}</h4>
                    <p className="text-sm text-purple-300/80">{future.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
