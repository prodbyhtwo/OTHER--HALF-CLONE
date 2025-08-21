import { authenticatedFetch } from '@/hooks/use-auth';

export interface Profile {
  id: string;
  name: string;
  age: number;
  bio?: string;
  photos: string[];
  distance?: number;
  interests?: string[];
  verified?: boolean;
  lastActive?: string;
  mutualConnections?: number;
}

export interface Match {
  id: string;
  profile: Profile;
  matchedAt: string;
  conversationId?: string;
  isLikedByUser: boolean;
  isLikedByThem: boolean;
  isSuperLike: boolean;
}

export interface DiscoveryFilters {
  ageRange?: [number, number];
  maxDistance?: number;
  interests?: string[];
  verified?: boolean;
}

export class MatchesAPI {
  /**
   * Get user's matches (people who liked each other)
   */
  static async getMatches(): Promise<Match[]> {
    const response = await authenticatedFetch('/api/matches');
    if (!response.ok) {
      throw new Error('Failed to fetch matches');
    }
    const data = await response.json();
    return data.matches;
  }

  /**
   * Get profiles that liked the current user
   */
  static async getLikes(): Promise<Profile[]> {
    const response = await authenticatedFetch('/api/matches/likes');
    if (!response.ok) {
      throw new Error('Failed to fetch likes');
    }
    const data = await response.json();
    return data.profiles;
  }

  /**
   * Get profiles that super liked the current user
   */
  static async getSuperLikes(): Promise<Profile[]> {
    const response = await authenticatedFetch('/api/matches/super-likes');
    if (!response.ok) {
      throw new Error('Failed to fetch super likes');
    }
    const data = await response.json();
    return data.profiles;
  }

  /**
   * Get discovery feed (potential matches)
   */
  static async getDiscovery(filters?: DiscoveryFilters): Promise<Profile[]> {
    const queryParams = new URLSearchParams();
    
    if (filters?.ageRange) {
      queryParams.set('minAge', filters.ageRange[0].toString());
      queryParams.set('maxAge', filters.ageRange[1].toString());
    }
    if (filters?.maxDistance) {
      queryParams.set('maxDistance', filters.maxDistance.toString());
    }
    if (filters?.interests?.length) {
      queryParams.set('interests', filters.interests.join(','));
    }
    if (filters?.verified !== undefined) {
      queryParams.set('verified', filters.verified.toString());
    }

    const url = `/api/discovery${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await authenticatedFetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch discovery profiles');
    }
    
    const data = await response.json();
    return data.profiles;
  }

  /**
   * Like a profile
   */
  static async likeProfile(profileId: string): Promise<{ isMatch: boolean; matchId?: string }> {
    const response = await authenticatedFetch('/api/matches/like', {
      method: 'POST',
      body: JSON.stringify({ profileId }),
    });

    if (!response.ok) {
      throw new Error('Failed to like profile');
    }

    return response.json();
  }

  /**
   * Super like a profile
   */
  static async superLikeProfile(profileId: string): Promise<{ isMatch: boolean; matchId?: string }> {
    const response = await authenticatedFetch('/api/matches/super-like', {
      method: 'POST',
      body: JSON.stringify({ profileId }),
    });

    if (!response.ok) {
      throw new Error('Failed to super like profile');
    }

    return response.json();
  }

  /**
   * Pass on a profile
   */
  static async passProfile(profileId: string): Promise<void> {
    const response = await authenticatedFetch('/api/matches/pass', {
      method: 'POST',
      body: JSON.stringify({ profileId }),
    });

    if (!response.ok) {
      throw new Error('Failed to pass profile');
    }
  }

  /**
   * Rewind last action (undo)
   */
  static async rewindLastAction(): Promise<Profile | null> {
    const response = await authenticatedFetch('/api/matches/rewind', {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to rewind action');
    }

    const data = await response.json();
    return data.profile || null;
  }

  /**
   * Unmatch with someone
   */
  static async unmatch(matchId: string): Promise<void> {
    const response = await authenticatedFetch(`/api/matches/${matchId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to unmatch');
    }
  }

  /**
   * Report a profile
   */
  static async reportProfile(profileId: string, reason: string, details?: string): Promise<void> {
    const response = await authenticatedFetch('/api/matches/report', {
      method: 'POST',
      body: JSON.stringify({ profileId, reason, details }),
    });

    if (!response.ok) {
      throw new Error('Failed to report profile');
    }
  }
}
