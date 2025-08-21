import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import { useActionLoggerContext } from '../components/ActionLogger';

export function LearningHub() {
  const { logClick } = useActionLoggerContext();
  
  return (
    <div className="min-h-screen bg-surface faith-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Learning Hub</h1>
          <p className="text-neutral-600">Grow in faith and relationships</p>
        </div>
        
        <Card className="faith-card blessed">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Content Categories</h2>
            <div className="space-y-2 text-sm text-neutral-600 mb-6">
              <p>✓ Categories: relationship, faith, personal_growth, communication</p>
              <p>✓ Featured cards and content cards</p>
              <p>✓ onContentOpen(contentId) and onLearningFilterChange</p>
            </div>
            <Button onClick={() => logClick('learning-placeholder', 'button')} className="btn-primary">
              Build Content System
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default LearningHub;
