import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useActionLoggerContext } from '../components/ActionLogger';

export function Messages() {
  const { logClick } = useActionLoggerContext();
  
  return (
    <div className="min-h-screen bg-surface faith-background p-6">
      <div className="faith-symbols">
        <div className="faith-symbol heart-1">💛</div>
      </div>
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Messages</h1>
          <p className="text-neutral-600">Chat with your mutual matches</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="faith-card">
            <CardHeader>
              <CardTitle className="text-lg">Matches List</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600 text-sm">
                Left panel showing mutual matches from getMatches API
              </p>
            </CardContent>
          </Card>
          
          <Card className="faith-card md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Chat Panel</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600 text-sm mb-4">
                Right panel with real-time messaging, auto-fixing on errors, retry with backoff
              </p>
              <Button onClick={() => logClick('messages-placeholder', 'button')} className="btn-primary">
                onMessageSend Handler
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Messages;
