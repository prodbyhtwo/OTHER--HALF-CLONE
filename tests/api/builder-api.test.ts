// tests/api/builder-api.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import builderApiRoutes from '../../server/routes/builder-api';
import locationApiRoutes from '../../server/routes/location-api';

// Mock authentication middleware
const mockAuthToken = (req: any, res: any, next: any) => {
  req.user = { id: 'user1', role: 'user' };
  next();
};

// Mock real-time service
vi.mock('../../src/services/realtime', () => ({
  realtimeService: {
    publishSettingsUpdate: vi.fn(),
    publishProfileUpdate: vi.fn(),
    publishLocationUpdate: vi.fn(),
    publishBlockUpdate: vi.fn(),
  },
}));

describe('Builder API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    
    // Apply mock auth middleware
    app.use((req, res, next) => mockAuthToken(req, res, next));
    
    // Mount routes
    app.use('/api', builderApiRoutes);
    app.use('/api', locationApiRoutes);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/settings/me', () => {
    it('returns user settings', async () => {
      const response = await request(app)
        .get('/api/settings/me')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: expect.objectContaining({
          user_id: 'user1',
          push_preferences: expect.any(Object),
          email_preferences: expect.any(Object),
          privacy_preferences: expect.any(Object),
          discovery_preferences: expect.any(Object),
        }),
      });
    });

    it('creates default settings if none exist', async () => {
      const response = await request(app)
        .get('/api/settings/me')
        .expect(200);

      expect(response.body.data.push_preferences).toMatchObject({
        marketing: true,
        social: true,
        security: true,
        matches: true,
        messages: true,
        likes: true,
      });
    });
  });

  describe('PUT /api/settings/me', () => {
    it('updates user settings', async () => {
      const settingsUpdate = {
        push_preferences: {
          marketing: false,
          social: true,
        },
        email_preferences: {
          marketing: true,
          weekly_digest: true,
        },
      };

      const response = await request(app)
        .put('/api/settings/me')
        .send(settingsUpdate)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: expect.objectContaining({
          push_preferences: expect.objectContaining({
            marketing: false,
            social: true,
          }),
          email_preferences: expect.objectContaining({
            marketing: true,
            weekly_digest: true,
          }),
        }),
        message: 'Settings updated successfully',
      });
    });

    it('validates age range consistency', async () => {
      const invalidSettings = {
        discovery_preferences: {
          min_age: 30,
          max_age: 25, // Invalid: min > max
        },
      };

      const response = await request(app)
        .put('/api/settings/me')
        .send(invalidSettings)
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: 'Minimum age cannot be greater than maximum age',
      });
    });

    it('prevents disabling security email notifications', async () => {
      const invalidSettings = {
        email_preferences: {
          security: false,
        },
      };

      const response = await request(app)
        .put('/api/settings/me')
        .send(invalidSettings)
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: 'Security email notifications are required and cannot be disabled',
      });
    });

    it('validates settings data with Zod', async () => {
      const invalidSettings = {
        push_preferences: {
          invalid_field: true,
        },
      };

      const response = await request(app)
        .put('/api/settings/me')
        .send(invalidSettings)
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: 'Invalid settings data',
        details: expect.any(Array),
      });
    });
  });

  describe('PATCH /api/users/:id', () => {
    it('updates user profile', async () => {
      const profileUpdate = {
        full_name: 'Updated Name',
        age: 26,
        bio: 'Updated bio',
        interests: ['reading', 'cooking'],
      };

      const response = await request(app)
        .patch('/api/users/user1')
        .send(profileUpdate)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: expect.objectContaining({
          full_name: 'Updated Name',
          age: 26,
          bio: 'Updated bio',
          interests: ['reading', 'cooking'],
        }),
        message: 'Profile updated successfully',
      });
    });

    it('prevents users from updating other profiles', async () => {
      const profileUpdate = {
        full_name: 'Hacker Name',
      };

      const response = await request(app)
        .patch('/api/users/user2')
        .send(profileUpdate)
        .expect(403);

      expect(response.body).toMatchObject({
        success: false,
        error: 'Forbidden: Can only update your own profile',
      });
    });

    it('validates profile data', async () => {
      const invalidProfile = {
        age: 17, // Too young
        bio: 'x'.repeat(1001), // Too long
      };

      const response = await request(app)
        .patch('/api/users/user1')
        .send(invalidProfile)
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: 'Invalid profile data',
        details: expect.any(Array),
      });
    });

    it('handles location updates with geocoding', async () => {
      const profileUpdate = {
        full_name: 'Test User',
        location: {
          lat: 40.7128,
          lng: -74.0060,
        },
      };

      const response = await request(app)
        .patch('/api/users/user1')
        .send(profileUpdate)
        .expect(200);

      expect(response.body.data.location).toMatchObject({
        lat: 40.7128,
        lng: -74.0060,
        locality: expect.any(String),
        country: expect.any(String),
        geohash: expect.any(String),
      });
    });
  });

  describe('POST /api/blocks', () => {
    it('blocks a user', async () => {
      const blockRequest = {
        userId: 'user2',
        reason: 'Inappropriate behavior',
      };

      const response = await request(app)
        .post('/api/blocks')
        .send(blockRequest)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          blockedUserId: 'user2',
          blockedAt: expect.any(String),
        },
        message: 'User blocked successfully',
      });
    });

    it('prevents self-blocking', async () => {
      const blockRequest = {
        userId: 'user1', // Same as current user
      };

      const response = await request(app)
        .post('/api/blocks')
        .send(blockRequest)
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: 'Cannot block yourself',
      });
    });

    it('validates block request data', async () => {
      const invalidBlock = {}; // Missing userId

      const response = await request(app)
        .post('/api/blocks')
        .send(invalidBlock)
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: 'userId is required',
      });
    });

    it('handles blocking non-existent users', async () => {
      const blockRequest = {
        userId: 'nonexistent',
      };

      const response = await request(app)
        .post('/api/blocks')
        .send(blockRequest)
        .expect(404);

      expect(response.body).toMatchObject({
        success: false,
        error: 'User not found',
      });
    });
  });

  describe('DELETE /api/blocks/:blockedId', () => {
    it('unblocks a user', async () => {
      // First block the user
      await request(app)
        .post('/api/blocks')
        .send({ userId: 'user2' });

      // Then unblock
      const response = await request(app)
        .delete('/api/blocks/user2')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          unblockedUserId: 'user2',
          unblockedAt: expect.any(String),
        },
        message: 'User unblocked successfully',
      });
    });

    it('handles unblocking non-blocked users', async () => {
      const response = await request(app)
        .delete('/api/blocks/user2')
        .expect(404);

      expect(response.body).toMatchObject({
        success: false,
        error: 'User was not blocked',
      });
    });
  });

  describe('GET /api/users/:id', () => {
    it('returns public user profile', async () => {
      const response = await request(app)
        .get('/api/users/user1')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: expect.objectContaining({
          id: 'user1',
          full_name: expect.any(String),
          age: expect.any(Number),
          // Should not include sensitive fields
        }),
      });

      // Should not include email or other sensitive data
      expect(response.body.data.email).toBeUndefined();
    });

    it('handles non-existent users', async () => {
      const response = await request(app)
        .get('/api/users/nonexistent')
        .expect(404);

      expect(response.body).toMatchObject({
        success: false,
        error: 'User not found',
      });
    });

    it('hides banned users', async () => {
      // Mock a banned user by modifying the mock data
      // In a real test, you'd set up test data properly
      const response = await request(app)
        .get('/api/users/banned_user')
        .expect(404);

      expect(response.body).toMatchObject({
        success: false,
        error: 'User not found',
      });
    });
  });

  describe('GET /api/blocks', () => {
    it('returns blocked users list', async () => {
      const response = await request(app)
        .get('/api/blocks')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          blockedUserIds: expect.any(Array),
          total: expect.any(Number),
        },
      });
    });

    it('returns empty list for new users', async () => {
      const response = await request(app)
        .get('/api/blocks')
        .expect(200);

      expect(response.body.data.blockedUserIds).toEqual([]);
      expect(response.body.data.total).toBe(0);
    });
  });
});

describe('Location API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use((req, res, next) => mockAuthToken(req, res, next));
    app.use('/api', locationApiRoutes);
  });

  describe('POST /api/location/permission', () => {
    it('records location permission grant', async () => {
      const permissionData = {
        granted: true,
      };

      const response = await request(app)
        .post('/api/location/permission')
        .send(permissionData)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          permission: 'granted',
          timestamp: expect.any(String),
        },
        message: 'Location permission granted',
      });
    });

    it('records location permission denial', async () => {
      const permissionData = {
        denied: true,
        error: 'User denied location access',
      };

      const response = await request(app)
        .post('/api/location/permission')
        .send(permissionData)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          permission: 'denied',
        },
        message: 'Location permission denied',
      });
    });
  });

  describe('PUT /api/location', () => {
    it('updates GPS location', async () => {
      const locationData = {
        lat: 40.7128,
        lng: -74.0060,
        accuracy: 10,
        source: 'gps',
        sharing: true,
      };

      const response = await request(app)
        .put('/api/location')
        .send(locationData)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          location: expect.objectContaining({
            lat: 40.7128,
            lng: -74.0060,
            accuracy: 10,
            locality: expect.any(String),
            country: expect.any(String),
            sharing: true,
          }),
        },
        message: 'Location updated successfully',
      });
    });

    it('validates location coordinates', async () => {
      const invalidLocation = {
        lat: 200, // Invalid latitude
        lng: -74.0060,
        source: 'gps',
      };

      const response = await request(app)
        .put('/api/location')
        .send(invalidLocation)
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: 'Invalid location data',
      });
    });

    it('checks location permissions', async () => {
      // First set permission to denied
      await request(app)
        .post('/api/location/permission')
        .send({ denied: true });

      // Then try to update location
      const locationData = {
        lat: 40.7128,
        lng: -74.0060,
        source: 'gps',
      };

      const response = await request(app)
        .put('/api/location')
        .send(locationData)
        .expect(403);

      expect(response.body).toMatchObject({
        success: false,
        error: 'Location permission denied',
        code: 'PERMISSION_DENIED',
      });
    });
  });

  describe('PUT /api/location/manual', () => {
    it('sets location from address', async () => {
      const addressData = {
        address: 'New York, NY',
      };

      const response = await request(app)
        .put('/api/location/manual')
        .send(addressData)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          location: expect.objectContaining({
            lat: expect.any(Number),
            lng: expect.any(Number),
            source: 'manual',
            sharing: true,
          }),
        },
        message: 'Location set manually',
      });
    });

    it('handles invalid addresses', async () => {
      const addressData = {
        address: 'Invalid Address 123456',
      };

      const response = await request(app)
        .put('/api/location/manual')
        .send(addressData)
        .expect(404);

      expect(response.body).toMatchObject({
        success: false,
        error: 'Address not found',
        code: 'GEOCODE_FAILED',
      });
    });
  });

  describe('PATCH /api/location/sharing', () => {
    it('toggles location sharing', async () => {
      const sharingData = {
        sharing: false,
      };

      const response = await request(app)
        .patch('/api/location/sharing')
        .send(sharingData)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          sharing: false,
          updated_at: expect.any(String),
        },
        message: 'Location sharing disabled',
      });
    });

    it('validates sharing boolean', async () => {
      const invalidData = {
        sharing: 'invalid',
      };

      const response = await request(app)
        .patch('/api/location/sharing')
        .send(invalidData)
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: 'sharing must be a boolean value',
      });
    });
  });

  describe('GET /api/location', () => {
    it('returns current location', async () => {
      // First set a location
      await request(app)
        .put('/api/location')
        .send({
          lat: 40.7128,
          lng: -74.0060,
          source: 'gps',
          sharing: true,
        });

      const response = await request(app)
        .get('/api/location')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          location: expect.objectContaining({
            lat: 40.7128,
            lng: -74.0060,
            sharing: true,
            source: 'gps',
          }),
        },
      });
    });

    it('returns null for users without location', async () => {
      const response = await request(app)
        .get('/api/location')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: { location: null },
        message: 'No location data found',
      });
    });
  });
});
