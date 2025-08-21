import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Church } from 'lucide-react';
import { useActionLoggerContext } from '../components/ActionLogger';

export function Churches() {
  const { logClick } = useActionLoggerContext();
  
  return (
    <div className="min-h-screen bg-surface faith-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Church className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Churches</h1>
          <p className="text-neutral-600">Find local churches in your area</p>
        </div>
        
        <Card className="faith-card blessed">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Church Directory</h2>
            <div className="space-y-2 text-sm text-neutral-600 mb-6">
              <p>✓ Search/filter by name, city, denomination</p>
              <p>✓ onChurchFilterChange handler</p>
              <p>✓ Church cards with onCall(phone), onVisit(url) actions</p>
            </div>
            <Button onClick={() => logClick('churches-placeholder', 'button')} className="btn-primary">
              Implement Church Search
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Churches;
