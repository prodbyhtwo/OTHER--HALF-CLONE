import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import { useActionLoggerContext } from '../components/ActionLogger';

export function AdminDashboard() {
  const { logClick } = useActionLoggerContext();
  
  return (
    <div className="min-h-screen bg-surface faith-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Admin Dashboard</h1>
          <p className="text-neutral-600">Manage users, content, and communications</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="faith-card">
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-neutral-600 mb-4">
                <p>• Pending Verifications (approve/reject)</p>
                <p>• All Users (ban/unban)</p>
                <p>• Bulk: onAdminApproveAllPending()</p>
                <p>• onAdminApproveVerifiedOnly()</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="faith-card">
            <CardHeader>
              <CardTitle>Learning Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-neutral-600 mb-4">
                <p>• CRUD operations</p>
                <p>• onContentCreate</p>
                <p>• onContentEdit</p>
                <p>• onContentPublish</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="faith-card">
            <CardHeader>
              <CardTitle>Communications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-neutral-600 mb-4">
                <p>• Email Broadcast (placeholder)</p>
                <p>• Push Notifications:</p>
                <p>• onPushCompose</p>
                <p>• onPushPreview</p>
                <p>• onPushSend</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="faith-card mt-6">
          <CardContent className="p-6 text-center">
            <p className="text-neutral-600 mb-4">
              Each admin action writes an AdminAction audit record
            </p>
            <Button onClick={() => logClick('admin-placeholder', 'button')} className="btn-primary">
              Implement Full Admin System
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboard;
