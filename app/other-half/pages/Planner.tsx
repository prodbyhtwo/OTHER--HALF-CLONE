import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { useActionLoggerContext } from '../components/ActionLogger';

export function Planner() {
  const { logClick } = useActionLoggerContext();
  
  return (
    <div className="min-h-screen bg-surface faith-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Date Planner</h1>
          <p className="text-neutral-600">Meaningful date ideas for Christian couples</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="faith-card">
            <CardHeader>
              <CardTitle>Low-Key</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-600 mb-4">Coffee dates, walks, bookstore visits</p>
              <Button onClick={() => logClick('planner-lowkey', 'button')} className="btn-primary w-full">
                onAddIdeaToPlan
              </Button>
            </CardContent>
          </Card>
          
          <Card className="faith-card">
            <CardHeader>
              <CardTitle>Outdoors</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-600 mb-4">Hiking, picnics, nature walks</p>
              <Button onClick={() => logClick('planner-outdoors', 'button')} className="btn-primary w-full">
                onAddIdeaToPlan
              </Button>
            </CardContent>
          </Card>
          
          <Card className="faith-card">
            <CardHeader>
              <CardTitle>Service</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-600 mb-4">Volunteering, community service</p>
              <Button onClick={() => logClick('planner-service', 'button')} className="btn-primary w-full">
                onAddIdeaToPlan
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <Card className="faith-card mt-6">
          <CardContent className="p-6 text-center">
            <Button onClick={() => logClick('planner-create', 'button')} className="btn-primary">
              onCreatePlan (Stub)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Planner;
