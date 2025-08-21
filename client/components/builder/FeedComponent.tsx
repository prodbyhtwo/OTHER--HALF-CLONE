// client/components/builder/FeedComponent.tsx
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Heart, X, Filter, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { validateComponentProps, feedComponentSchema } from "./registry";
import { cn } from "@/lib/utils";

interface FeedComponentProps {
  dataSource?: 'live' | 'mock';
  feedType?: 'matches' | 'discovery' | 'recent';
  limit?: number;
  showFilters?: boolean;
  showSkeleton?: boolean;
  showEmptyState?: boolean;
  className?: string;
}

interface Profile {
  id: string;
  name: string;
  age: number;
  bio?: string;
  photos: string[];
  distance?: string;
  interests?: string[];
  verified?: boolean;
  lastActive?: string;
}

// Mock data for demonstration
const MOCK_PROFILES: Profile[] = [
  {
    id: "1",
    name: "Sarah",
    age: 25,
    bio: "Faith-centered, love hiking and reading",
    photos: ["https://images.unsplash.com/photo-1494790108755-2616b612b494?w=400&h=600&fit=crop&crop=face"],
    distance: "3 km away",
    interests: ["hiking", "reading", "worship"],
    verified: true,
    lastActive: "2 hours ago"
  },
  {
    id: "2", 
    name: "Emma",
    age: 27,
    bio: "Looking for meaningful connections",
    photos: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop&crop=face"],
    distance: "5 km away",
    interests: ["music", "volunteering", "coffee"],
    verified: false,
    lastActive: "1 day ago"
  },
  {
    id: "3",
    name: "Grace",
    age: 23,
    bio: "Passionate about helping others",
    photos: ["https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop&crop=face"],
    distance: "7 km away", 
    interests: ["photography", "travel", "faith"],
    verified: true,
    lastActive: "3 hours ago"
  }
];

function ProfileCard({ profile, onLike, onPass }: { 
  profile: Profile; 
  onLike: (id: string) => void;
  onPass: (id: string) => void;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <img 
          src={profile.photos[0]} 
          alt={profile.name}
          className="w-full h-64 object-cover"
        />
        {profile.verified && (
          <Badge className="absolute top-2 right-2 bg-blue-600">
            Verified
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg">
              {profile.name}, {profile.age}
            </h3>
            {profile.distance && (
              <p className="text-sm text-gray-600">{profile.distance}</p>
            )}
          </div>
          
          {profile.bio && (
            <p className="text-sm text-gray-700 line-clamp-2">{profile.bio}</p>
          )}
          
          {profile.interests && profile.interests.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {profile.interests.slice(0, 3).map((interest, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {interest}
                </Badge>
              ))}
              {profile.interests.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{profile.interests.length - 3}
                </Badge>
              )}
            </div>
          )}
          
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onPass(profile.id)}
            >
              <X className="h-4 w-4 mr-1" />
              Pass
            </Button>
            <Button 
              size="sm" 
              className="flex-1 bg-pink-600 hover:bg-pink-700"
              onClick={() => onLike(profile.id)}
            >
              <Heart className="h-4 w-4 mr-1" />
              Like
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProfileSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="w-full h-64" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 flex-1" />
        </div>
      </CardContent>
    </Card>
  );
}

export function FeedComponent(props: FeedComponentProps) {
  const validatedProps = validateComponentProps('FeedComponent', props, feedComponentSchema);
  const { 
    dataSource = 'live', 
    feedType = 'discovery', 
    limit = 10, 
    showFilters = true, 
    showSkeleton = true, 
    showEmptyState = true,
    className
  } = validatedProps;
  
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Load data
  useEffect(() => {
    const loadProfiles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (dataSource === 'mock') {
          // Simulate loading delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          setProfiles(MOCK_PROFILES.slice(0, limit));
        } else {
          // Load from API
          const endpoint = feedType === 'matches' ? '/api/matches' : 
                         feedType === 'discovery' ? '/api/matches/discovery' :
                         '/api/matches/recent';
          
          const response = await fetch(endpoint, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
          
          if (!response.ok) {
            throw new Error('Failed to load profiles');
          }
          
          const data = await response.json();
          setProfiles(data.profiles || data.matches || []);
        }
      } catch (error: any) {
        console.error('Error loading profiles:', error);
        setError(error.message || 'Failed to load profiles');
        
        // Fallback to mock data on error
        if (dataSource === 'live') {
          setProfiles(MOCK_PROFILES.slice(0, limit));
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadProfiles();
  }, [dataSource, feedType, limit]);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    // Reload data
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
    toast.success('Feed refreshed');
  };
  
  const handleLike = async (profileId: string) => {
    try {
      const response = await fetch('/api/matches/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ profileId }),
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.isMatch) {
          toast.success("It's a match! 🎉");
        } else {
          toast.success("Like sent!");
        }
        
        // Remove profile from feed
        setProfiles(prev => prev.filter(p => p.id !== profileId));
      } else {
        throw new Error('Failed to like profile');
      }
    } catch (error) {
      console.error('Error liking profile:', error);
      toast.error('Failed to like profile');
    }
  };
  
  const handlePass = async (profileId: string) => {
    try {
      const response = await fetch('/api/matches/pass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ profileId }),
      });
      
      if (response.ok) {
        // Remove profile from feed
        setProfiles(prev => prev.filter(p => p.id !== profileId));
      } else {
        throw new Error('Failed to pass profile');
      }
    } catch (error) {
      console.error('Error passing profile:', error);
      toast.error('Failed to pass profile');
    }
  };
  
  if (isLoading && showSkeleton) {
    return (
      <div className={cn("space-y-6", className)}>
        {showFilters && (
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold capitalize">{feedType}</h2>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-9" />
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: Math.min(6, limit) }).map((_, index) => (
            <ProfileSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }
  
  if (error && profiles.length === 0) {
    return (
      <div className={cn("text-center py-12", className)}>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }
  
  if (profiles.length === 0 && showEmptyState) {
    return (
      <div className={cn("text-center py-12", className)}>
        <div className="space-y-4">
          <div className="text-6xl">💕</div>
          <h3 className="text-xl font-semibold">No profiles found</h3>
          <p className="text-gray-600">
            {feedType === 'matches' ? 
              "You don't have any matches yet. Keep swiping!" :
              "Try adjusting your discovery preferences to see more profiles."
            }
          </p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with Filters */}
      {showFilters && (
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold capitalize">{feedType}</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
            </Button>
          </div>
        </div>
      )}
      
      {/* Profile Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            onLike={handleLike}
            onPass={handlePass}
          />
        ))}
      </div>
      
      {/* Load More */}
      {profiles.length >= limit && (
        <div className="text-center">
          <Button variant="outline" onClick={handleRefresh}>
            Load More Profiles
          </Button>
        </div>
      )}
    </div>
  );
}

export default FeedComponent;
