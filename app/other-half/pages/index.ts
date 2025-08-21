// Main pages
export { default as Landing } from './Landing';
export { default as OnboardingWizard } from './OnboardingWizard';
export { default as Dashboard } from './Dashboard';

// Placeholder components for remaining features
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, MessageCircle, User, Settings, Church, BookOpen, Gamepad2, Calendar, Bot, Shield } from 'lucide-react';
import { useActionLoggerContext } from '../components/ActionLogger';

// Discover Page
export function Discover() {
  const { logClick } = useActionLoggerContext();
  
  const handleAction = (action: string) => {
    logClick(`discover-${action}`, 'button', { action });
  };

  return (
    <div className="min-h-screen bg-surface faith-background p-6">
      <div className="faith-symbols">
        <div className="faith-symbol cross-1">✝</div>
        <div className="faith-symbol heart-1">💛</div>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 divine-glow">
            <Search className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Discover</h1>
          <p className="text-neutral-600">Explore verified profiles in your community</p>
        </div>
        
        <Card className="faith-card blessed text-center">
          <CardContent className="p-8">
            <h2 className="text-xl font-semibold mb-4">Feature Coming Soon</h2>
            <p className="text-neutral-600 mb-6">
              Grid of verified profiles with advanced filtering, messaging, and reporting capabilities.
            </p>
            <div className="space-y-2 text-sm text-neutral-500">
              <p>✓ Profile grid with photos and basic info</p>
              <p>✓ Filter by denomination, age, location</p>
              <p>✓ Like, message, and report actions</p>
              <p>✓ Block user functionality</p>
            </div>
            <Button onClick={() => handleAction('placeholder')} className="btn-primary mt-4">
              View Implementation Plan
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Messages Page
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

// Profile Page
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

// Settings Page
export function Settings() {
  const { logClick } = useActionLoggerContext();
  
  return (
    <div className="min-h-screen bg-surface faith-background p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="h-8 w-8 text-primary-600" />
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

// Churches Page
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

// Learning Hub Page
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

// Games Page
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

// Planner Page
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

// Agent Chat Page
export function AgentChat() {
  const { logClick } = useActionLoggerContext();
  
  return (
    <div className="min-h-screen bg-surface faith-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bot className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Community Guide</h1>
          <p className="text-neutral-600">AI assistant for biblical guidance and community support</p>
        </div>
        
        <Card className="faith-card blessed">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">AI Chat Interface</h2>
            <div className="space-y-2 text-sm text-neutral-600 mb-6">
              <p>✓ Text input + send → onAgentSend(text)</p>
              <p>✓ Stream UI with tool-call visualization</p>
              <p>✓ Boundaries: never medical/legal; respectful, biblical tone</p>
              <p>✓ Error handling via useErrorHandler</p>
            </div>
            <Button onClick={() => logClick('agent-placeholder', 'button')} className="btn-primary">
              Implement Chat Interface
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Admin Dashboard Page
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