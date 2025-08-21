import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';

export function Settings() {
  return (
    <div className="min-h-screen bg-surface faith-background p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SettingsIcon className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Settings</h1>
        </div>
        
        <div className="space-y-4">
          <Card className="faith-card">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>onToggleNotification(key, value) handlers for:</p>
                <p>• new_match, new_message, event_updates, community_updates</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="faith-card">
            <CardHeader>
              <CardTitle>Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>onTogglePrivacy(key, value) handlers for:</p>
                <p>• show_location, profile_visible</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Settings;
