import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2 } from 'lucide-react';
import { useActionLoggerContext } from '../components/ActionLogger';

export function Games() {
  const { logClick } = useActionLoggerContext();
  
  return (
    <div className="min-h-screen bg-surface faith-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gamepad2 className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Games</h1>
          <p className="text-neutral-600">Fun activities to strengthen faith and connections</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="faith-card">
            <CardHeader>
              <CardTitle>Scripture Sparks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-600 mb-4">Biblical trivia game</p>
              <Button onClick={() => logClick('game-scripture', 'button')} className="btn-primary w-full">
                onGameStart
              </Button>
            </CardContent>
          </Card>
          
          <Card className="faith-card">
            <CardHeader>
              <CardTitle>Values Compass</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-600 mb-4">Scenario-based questions</p>
              <Button onClick={() => logClick('game-values', 'button')} className="btn-primary w-full">
                onGameStart
              </Button>
            </CardContent>
          </Card>
          
          <Card className="faith-card">
            <CardHeader>
              <CardTitle>Would You Rather</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-600 mb-4">Paired game (placeholder)</p>
              <Button disabled className="btn-secondary w-full">
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <Card className="faith-card mt-6">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Duolingo-Style Features</h3>
            <div className="text-sm text-neutral-600">
              <p>✓ Streaks, points, leaderboards</p>
              <p>✓ onGameAnswer, onGameComplete handlers</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Games;
