import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, X, Star, MapPin, Church, Calendar, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DailyMatch, User } from '../types';
import { useActionLoggerContext } from '../components/ActionLogger';

// Mock data - replace with real API calls
const mockMatches: DailyMatch[] = [
  {
    id: '1',
    profile: {
      id: '1',
      full_name: 'Sarah Johnson',
      age: 26,
      location: 'Austin, TX',
      bio: 'Passionate about serving others and growing in faith. Love hiking, worship music, and volunteering at local shelters.',
      denomination: 'Baptist',
      church_attendance: 'weekly',
      love_language: 'acts_of_service',
      personality_type: 'ENFJ',
      looking_for: 'marriage',
      interests: ['hiking', 'worship music', 'volunteering'],
      availability: ['weekend_mornings', 'weekday_evenings'],
      preferred_age_min: 24,
      preferred_age_max: 32,
      max_distance: 50,
      onboarding_complete: true,
      verification_status: 'approved',
      profile_visible: true,
      show_location: true,
      email: 'sarah@example.com',
      role: 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    compatibility_score: 94,
    compatibility_breakdown: {
      faith: 98,
      values: 92,
      interests: 90,
      lifestyle: 96
    }
  },
  {
    id: '2',
    profile: {
      id: '2',
      full_name: 'Michael Chen',
      age: 29,
      location: 'Austin, TX',
      bio: 'Youth pastor with a heart for discipleship. Enjoy rock climbing, board games, and deep conversations about faith.',
      denomination: 'Non-denominational',
      church_attendance: 'weekly',
      love_language: 'quality_time',
      personality_type: 'INFJ',
      looking_for: 'marriage',
      interests: ['rock climbing', 'board games', 'mentoring'],
      availability: ['weekend_afternoons', 'weekday_evenings'],
      preferred_age_min: 22,
      preferred_age_max: 30,
      max_distance: 25,
      onboarding_complete: true,
      verification_status: 'approved',
      profile_visible: true,
      show_location: true,
      email: 'michael@example.com',
      role: 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    compatibility_score: 88,
    compatibility_breakdown: {
      faith: 95,
      values: 85,
      interests: 82,
      lifestyle: 90
    }
  }
];

interface MatchCardProps {
  match: DailyMatch;
  onLike: (profileId: string) => void;
  onPass: (profileId: string) => void;
}

function MatchCard({ match, onLike, onPass }: MatchCardProps) {
  const { profile, compatibility_score, compatibility_breakdown } = match;
  const { logClick } = useActionLoggerContext();

  const handleLike = () => {
    logClick('match-like', 'button', { 
      profile_id: profile.id,
      compatibility_score,
      action: 'like'
    });
    onLike(profile.id);
  };

  const handlePass = () => {
    logClick('match-pass', 'button', { 
      profile_id: profile.id,
      compatibility_score,
      action: 'pass'
    });
    onPass(profile.id);
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 90) return 'text-success-600 bg-success-100';
    if (score >= 80) return 'text-primary-600 bg-primary-100';
    if (score >= 70) return 'text-warning-600 bg-warning-100';
    return 'text-neutral-600 bg-neutral-100';
  };

  return (
    <Card className="faith-card blessed max-w-sm mx-auto">
      <CardHeader className="relative">
        {/* Profile Photo Placeholder */}
        <div className="w-full h-64 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg mb-4 flex items-center justify-center">
          <div className="text-6xl">📸</div>
        </div>
        
        {/* Verification Badge */}
        <Badge className="absolute top-4 right-4 bg-success-100 text-success-800">
          <Sparkles className="h-3 w-3 mr-1" />
          Verified
        </Badge>
        
        {/* Compatibility Score */}
        <div className="absolute top-4 left-4">
          <div className={cn(
            'px-3 py-1 rounded-full text-sm font-semibold',
            getCompatibilityColor(compatibility_score)
          )}>
            {compatibility_score}% Match
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Basic Info */}
        <div>
          <h3 className="text-xl font-semibold text-neutral-900">
            {profile.full_name}, {profile.age}
          </h3>
          <div className="flex items-center text-neutral-600 text-sm mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            {profile.location}
          </div>
        </div>

        {/* Bio */}
        <p className="text-neutral-700 text-sm line-clamp-3">
          {profile.bio}
        </p>

        {/* Faith Info */}
        <div className="flex items-center space-x-2">
          <Church className="h-4 w-4 text-neutral-500" />
          <span className="text-sm text-neutral-600">{profile.denomination}</span>
          <Badge variant="secondary" className="text-xs">
            {profile.church_attendance}
          </Badge>
        </div>

        {/* Compatibility Breakdown */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-neutral-900">Compatibility</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-600">Faith:</span>
              <span className="font-medium">{compatibility_breakdown.faith}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Values:</span>
              <span className="font-medium">{compatibility_breakdown.values}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Interests:</span>
              <span className="font-medium">{compatibility_breakdown.interests}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Lifestyle:</span>
              <span className="font-medium">{compatibility_breakdown.lifestyle}%</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <Button
            onClick={handlePass}
            variant="outline"
            className="flex-1 btn-secondary"
            aria-label={`Pass on ${profile.full_name}`}
          >
            <X className="h-4 w-4 mr-2" />
            Pass
          </Button>
          <Button
            onClick={handleLike}
            className="flex-1 btn-primary"
            aria-label={`Like ${profile.full_name}`}
          >
            <Heart className="h-4 w-4 mr-2" />
            Like
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Match celebration modal
function MatchCelebrationModal({ 
  isOpen, 
  onClose, 
  matchName 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  matchName: string;
}) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 celebration-burst">
      <Card className="faith-card blessed max-w-sm mx-4 divine-glow">
        <CardContent className="text-center p-8">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            It's a Match!
          </h2>
          <p className="text-neutral-600">
            You and {matchName} liked each other!
          </p>
          <div className="bible-verse mt-4">
            "Two are better than one"
            <div className="text-sm text-neutral-500 mt-1">— Ecclesiastes 4:9</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function Dashboard() {
  const [matches, setMatches] = useState<DailyMatch[]>(mockMatches);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedName, setMatchedName] = useState('');
  const { logClick } = useActionLoggerContext();

  const currentMatch = matches[currentMatchIndex];

  const handleLike = async (profileId: string) => {
    try {
      // TODO: Call API to like profile
      // const result = await handleLike(profileId);
      
      // Simulate mutual match for demo
      const isMutualMatch = Math.random() > 0.7; // 30% chance of mutual match
      
      if (isMutualMatch) {
        setMatchedName(currentMatch.profile.full_name);
        setShowMatchModal(true);
        logClick('match-celebration', 'modal', { 
          match_id: `${profileId}_mutual`,
          profile_id: profileId
        });
      }
      
      moveToNextMatch();
    } catch (error) {
      console.error('Error liking profile:', error);
    }
  };

  const handlePass = async (profileId: string) => {
    try {
      // TODO: Call API to pass on profile
      // await handlePass(profileId);
      moveToNextMatch();
    } catch (error) {
      console.error('Error passing profile:', error);
    }
  };

  const moveToNextMatch = () => {
    if (currentMatchIndex < matches.length - 1) {
      setCurrentMatchIndex(prev => prev + 1);
    } else {
      // No more matches - could show "come back tomorrow" message
      setCurrentMatchIndex(0); // Reset for demo
    }
  };

  const handleRefresh = () => {
    logClick('dashboard-refresh', 'button', { action: 'refresh_matches' });
    // TODO: Fetch new daily matches
    setCurrentMatchIndex(0);
  };

  if (!currentMatch) {
    return (
      <div className="min-h-screen bg-surface faith-background flex items-center justify-center p-4">
        <div className="faith-symbols">
          <div className="faith-symbol cross-1">✝</div>
          <div className="faith-symbol heart-1">💛</div>
        </div>
        
        <Card className="faith-card max-w-md text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">
              No More Matches Today
            </h2>
            <p className="text-neutral-600 mb-6">
              You've seen all your daily matches! Check back tomorrow for new connections.
            </p>
            <div className="bible-verse mb-6">
              "Wait for the Lord; be strong and take heart"
              <div className="text-sm text-neutral-500 mt-1">— Psalm 27:14</div>
            </div>
            <Button onClick={handleRefresh} className="btn-primary">
              Check for Updates
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface faith-background">
      <div className="faith-symbols">
        <div className="faith-symbol cross-1">✝</div>
        <div className="faith-symbol cross-2">✝</div>
        <div className="faith-symbol heart-1">💛</div>
        <div className="faith-symbol heart-2">💛</div>
        <div className="faith-symbol dove-1">🕊</div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Your Daily Matches
          </h1>
          <p className="text-neutral-600">
            Discover meaningful connections chosen just for you
          </p>
          <div className="flex items-center justify-center mt-4 space-x-2">
            <Star className="h-4 w-4 text-primary-500" />
            <span className="text-sm text-neutral-600">
              {matches.length - currentMatchIndex} matches remaining today
            </span>
          </div>
        </div>

        {/* Match Card */}
        <div className="flex justify-center">
          <MatchCard
            match={currentMatch}
            onLike={handleLike}
            onPass={handlePass}
          />
        </div>

        {/* Swipe Instructions */}
        <div className="text-center mt-8 text-sm text-neutral-500">
          <p>Swipe or use buttons to interact with profiles</p>
        </div>
      </div>

      {/* Match Celebration Modal */}
      <MatchCelebrationModal
        isOpen={showMatchModal}
        onClose={() => setShowMatchModal(false)}
        matchName={matchedName}
      />
    </div>
  );
}

export default Dashboard;
