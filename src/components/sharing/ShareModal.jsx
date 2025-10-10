import React, { useState, useEffect } from "react";
import { IntegrationSetting } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { 
  Slack, 
  Video, 
  Calendar,
  X,
  Send,
  CheckCircle
} from "lucide-react";

const integrationMeta = {
  slack: { name: "Slack", icon: Slack },
  zoom: { name: "Zoom", icon: Video },
  google_calendar: { name: "Google Calendar", icon: Calendar }
};

export default function ShareModal({ isOpen, onClose, transcription }) {
  const [connectedIntegrations, setConnectedIntegrations] = useState([]);
  const [shareStatus, setShareStatus] = useState({});

  useEffect(() => {
    if (isOpen) {
      const loadConnectedIntegrations = async () => {
        const settings = await IntegrationSetting.filter({ is_connected: true });
        setConnectedIntegrations(settings);
      };
      loadConnectedIntegrations();
      setShareStatus({});
    }
  }, [isOpen]);

  const handleShare = (serviceName) => {
    // Simulate API call to share content
    setShareStatus(prev => ({ ...prev, [serviceName]: 'sharing' }));
    
    setTimeout(() => {
      setShareStatus(prev => ({ ...prev, [serviceName]: 'shared' }));
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-black/80 via-gray-900/90 to-blue-900/30 border border-blue-500/30 rounded-2xl shadow-2xl w-full max-w-lg m-4">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-blue-100">Share Insights</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5 text-gray-400" />
            </Button>
          </div>

          <div>
            <p className="text-blue-200 mb-1">Content: <span className="font-semibold">{transcription.title}</span></p>
            <p className="text-xs text-blue-300/80">Select a connected service to share a summary and link.</p>
          </div>

          <div className="space-y-3">
            {connectedIntegrations.length > 0 ? (
              connectedIntegrations.map(integration => {
                const meta = integrationMeta[integration.service_name];
                if (!meta) return null;
                const Icon = meta.icon;
                const status = shareStatus[integration.service_name];

                return (
                  <div key={integration.id} className="flex items-center justify-between p-4 bg-blue-900/20 rounded-lg border border-blue-500/20">
                    <div className="flex items-center gap-3">
                      <Icon className="w-6 h-6 text-blue-400" />
                      <span className="font-medium text-blue-100">{meta.name}</span>
                    </div>
                    <Button 
                      onClick={() => handleShare(integration.service_name)}
                      disabled={status === 'sharing' || status === 'shared'}
                      className={`
                        ${status === 'shared' ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}
                      `}
                    >
                      {status === 'sharing' && <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin mr-2"></div>}
                      {status === 'shared' && <CheckCircle className="w-4 h-4 mr-2" />}
                      {status === 'sharing' ? 'Sharing...' : status === 'shared' ? 'Shared' : 'Share'}
                    </Button>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <p className="text-blue-200">No connected integrations found.</p>
                <p className="text-sm text-blue-300/80 mt-2">Visit the Integration Hub to connect your apps.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}