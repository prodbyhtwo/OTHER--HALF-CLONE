import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { useActionLoggerContext } from '../components/ActionLogger';

export function Profile() {
  const { logClick } = useActionLoggerContext();
  
  return (
    <div className="min-h-screen bg-surface faith-background p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Profile</h1>
        </div>
        
        <Card className="faith-card blessed">
          <CardContent className="p-8">
            <h2 className="text-xl font-semibold mb-4">Editable Profile Fields</h2>
            <div className="space-y-3 text-sm text-neutral-600">
              <p>✓ Age, location, bio, denomination</p>
              <p>✓ Church attendance, interests[], love language</p>
              <p>✓ Personality type, availability[], looking for</p>
              <p>✓ Preferred age range, max distance</p>
            </div>
            <Button 
              onClick={() => logClick('profile-save', 'button')} 
              className="btn-primary mt-6"
            >
              onProfileSave Handler
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Profile;
