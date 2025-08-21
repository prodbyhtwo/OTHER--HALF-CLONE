import { Router } from 'express';
import { z } from 'zod';
import { authenticateToken } from './auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

interface Profile {
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

interface Like {
  id: string;
  fromUserId: string;
  toUserId: string;
  isSuper: boolean;
  createdAt: string;
}

interface Match {
  id: string;
  user1Id: string;
  user2Id: string;
  createdAt: string;
  conversationId?: string;
}

// Mock data (replace with database)
const mockProfiles: Profile[] = [
  {
    id: 'profile_1',
    name: 'Emma',
    age: 26,
    bio: 'Love hiking and good coffee ☕',
    photos: [
      'https://images.unsplash.com/photo-1494790108755-2616b332e234?w=400&h=600&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop&crop=face'
    ],
    distance: 3,
    interests: ['hiking', 'coffee', 'books'],
    verified: true,
    lastActive: '2024-01-21T10:00:00Z',
    mutualConnections: 2
  },
  {
    id: 'profile_2', 
    name: 'Sofia',
    age: 24,
    bio: 'Photographer and dog lover 📸🐕',
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&crop=face'
    ],
    distance: 7,
    interests: ['photography', 'dogs', 'travel'],
    verified: false,
    lastActive: '2024-01-21T15:30:00Z',
    mutualConnections: 0
  },
  {
    id: 'profile_3',
    name: 'Isabella', 
    age: 22,
    bio: 'Dancer and yoga enthusiast 🧘‍♀️',
    photos: [
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face'
    ],
    distance: 5,
    interests: ['dance', 'yoga', 'meditation'],
    verified: true,
    lastActive: '2024-01-21T12:15:00Z',
    mutualConnections: 1
  }
];

let mockLikes: Like[] = [
  {
    id: 'like_1',
    fromUserId: 'profile_1',
    toUserId: 'user_1',
    isSuper: false,
    createdAt: '2024-01-20T14:30:00Z'
  },
  {
    id: 'like_2', 
    fromUserId: 'profile_3',
    toUserId: 'user_1',
    isSuper: true,
    createdAt: '2024-01-20T16:45:00Z'
  }
];

let mockMatches: Match[] = [];

const likeSchema = z.object({
  profileId: z.string()
});

const reportSchema = z.object({
  profileId: z.string(),
  reason: z.string(),
  details: z.string().optional()
});

/**
 * GET /api/matches/likes
 * Get profiles that liked the current user
 */
router.get('/likes', (req: any, res) => {
  try {
    const userId = req.user.id;
    
    // Get likes to this user
    const likesToUser = mockLikes.filter(like => 
      like.toUserId === userId && !like.isSuper
    );
    
    // Get profiles for those likes
    const profiles = likesToUser.map(like => {
      const profile = mockProfiles.find(p => p.id === like.fromUserId);
      return profile;
    }).filter(Boolean);
    
    res.json({ profiles });
  } catch (error) {
    console.error('Error fetching likes:', error);
    res.status(500).json({ error: 'Failed to fetch likes' });
  }
});

/**
 * GET /api/matches/super-likes
 * Get profiles that super liked the current user
 */
router.get('/super-likes', (req: any, res) => {
  try {
    const userId = req.user.id;
    
    // Get super likes to this user
    const superLikesToUser = mockLikes.filter(like => 
      like.toUserId === userId && like.isSuper
    );
    
    // Get profiles for those super likes
    const profiles = superLikesToUser.map(like => {
      const profile = mockProfiles.find(p => p.id === like.fromUserId);
      return profile;
    }).filter(Boolean);
    
    res.json({ profiles });
  } catch (error) {
    console.error('Error fetching super likes:', error);
    res.status(500).json({ error: 'Failed to fetch super likes' });
  }
});

/**
 * GET /api/matches
 * Get user's matches
 */
router.get('/', (req: any, res) => {
  try {
    const userId = req.user.id;
    
    // Get matches for this user
    const userMatches = mockMatches.filter(match => 
      match.user1Id === userId || match.user2Id === userId
    );
    
    // Get profiles for matches
    const matches = userMatches.map(match => {
      const otherUserId = match.user1Id === userId ? match.user2Id : match.user1Id;
      const profile = mockProfiles.find(p => p.id === otherUserId);
      
      if (!profile) return null;
      
      return {
        id: match.id,
        profile,
        matchedAt: match.createdAt,
        conversationId: match.conversationId,
        isLikedByUser: true,
        isLikedByThem: true,
        isSuperLike: false // TODO: Track super like status
      };
    }).filter(Boolean);
    
    res.json({ matches });
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

/**
 * GET /api/discovery
 * Get discovery feed
 */
router.get('/discovery', (req: any, res) => {
  try {
    const userId = req.user.id;
    const { minAge, maxAge, maxDistance, interests, verified } = req.query;
    
    let filteredProfiles = [...mockProfiles];
    
    // Filter by age range
    if (minAge || maxAge) {
      filteredProfiles = filteredProfiles.filter(profile => {
        if (minAge && profile.age < parseInt(minAge as string)) return false;
        if (maxAge && profile.age > parseInt(maxAge as string)) return false;
        return true;
      });
    }
    
    // Filter by distance
    if (maxDistance) {
      filteredProfiles = filteredProfiles.filter(profile => 
        !profile.distance || profile.distance <= parseInt(maxDistance as string)
      );
    }
    
    // Filter by interests
    if (interests) {
      const interestList = (interests as string).split(',');
      filteredProfiles = filteredProfiles.filter(profile =>
        profile.interests?.some(interest => 
          interestList.includes(interest)
        )
      );
    }
    
    // Filter by verified status
    if (verified === 'true') {
      filteredProfiles = filteredProfiles.filter(profile => profile.verified);
    }
    
    // Remove profiles already liked/passed (TODO: implement history)
    // For now, just return all filtered profiles
    
    res.json({ profiles: filteredProfiles });
  } catch (error) {
    console.error('Error fetching discovery:', error);
    res.status(500).json({ error: 'Failed to fetch discovery profiles' });
  }
});

/**
 * POST /api/matches/like
 * Like a profile
 */
router.post('/like', (req: any, res) => {
  try {
    const userId = req.user.id;
    const body = likeSchema.parse(req.body);
    
    // Check if already liked
    const existingLike = mockLikes.find(like => 
      like.fromUserId === userId && like.toUserId === body.profileId
    );
    
    if (existingLike) {
      return res.status(400).json({ error: 'Profile already liked' });
    }
    
    // Create like
    const newLike: Like = {
      id: `like_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fromUserId: userId,
      toUserId: body.profileId,
      isSuper: false,
      createdAt: new Date().toISOString()
    };
    
    mockLikes.push(newLike);
    
    // Check for mutual like (match)
    const mutualLike = mockLikes.find(like => 
      like.fromUserId === body.profileId && like.toUserId === userId
    );
    
    let isMatch = false;
    let matchId;
    
    if (mutualLike) {
      // Create match
      const newMatch: Match = {
        id: `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user1Id: userId,
        user2Id: body.profileId,
        createdAt: new Date().toISOString()
      };
      
      mockMatches.push(newMatch);
      isMatch = true;
      matchId = newMatch.id;
    }
    
    res.json({ isMatch, matchId });
  } catch (error) {
    console.error('Error liking profile:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to like profile' });
  }
});

/**
 * POST /api/matches/super-like
 * Super like a profile
 */
router.post('/super-like', (req: any, res) => {
  try {
    const userId = req.user.id;
    const body = likeSchema.parse(req.body);
    
    // Check if already liked
    const existingLike = mockLikes.find(like => 
      like.fromUserId === userId && like.toUserId === body.profileId
    );
    
    if (existingLike) {
      return res.status(400).json({ error: 'Profile already liked' });
    }
    
    // Create super like
    const newLike: Like = {
      id: `like_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fromUserId: userId,
      toUserId: body.profileId,
      isSuper: true,
      createdAt: new Date().toISOString()
    };
    
    mockLikes.push(newLike);
    
    // Super likes always create a match opportunity
    const mutualLike = mockLikes.find(like => 
      like.fromUserId === body.profileId && like.toUserId === userId
    );
    
    let isMatch = false;
    let matchId;
    
    if (mutualLike || Math.random() > 0.7) { // Higher match rate for super likes
      const newMatch: Match = {
        id: `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user1Id: userId,
        user2Id: body.profileId,
        createdAt: new Date().toISOString()
      };
      
      mockMatches.push(newMatch);
      isMatch = true;
      matchId = newMatch.id;
    }
    
    res.json({ isMatch, matchId });
  } catch (error) {
    console.error('Error super liking profile:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to super like profile' });
  }
});

/**
 * POST /api/matches/pass
 * Pass on a profile
 */
router.post('/pass', (req: any, res) => {
  try {
    const body = likeSchema.parse(req.body);
    
    // TODO: Store pass history to avoid showing again
    
    res.json({ message: 'Profile passed' });
  } catch (error) {
    console.error('Error passing profile:', error);
    res.status(500).json({ error: 'Failed to pass profile' });
  }
});

/**
 * POST /api/matches/report
 * Report a profile
 */
router.post('/report', (req: any, res) => {
  try {
    const body = reportSchema.parse(req.body);
    
    // TODO: Store report and handle moderation
    console.log('Profile reported:', body);
    
    res.json({ message: 'Profile reported successfully' });
  } catch (error) {
    console.error('Error reporting profile:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to report profile' });
  }
});

export default router;
