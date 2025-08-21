// server/routes/location-api.ts
import { Router, Request, Response } from "express";
import { z } from "zod";
import { authenticateToken } from "./auth";
import { logSecurityEvent } from "../../src/middleware/security";
import { realtimeService } from "../../src/services/realtime";
import type { User } from "../../src/types/database";

const router = Router();

// Validation schemas
const updateLocationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  accuracy: z.number().min(0).optional(),
  timestamp: z.string().optional(),
  sharing: z.boolean().optional(),
  source: z.enum(['gps', 'network', 'manual']).default('gps'),
}).strict();

const locationPermissionSchema = z.object({
  granted: z.boolean(),
  denied: z.boolean().optional(),
  prompt: z.boolean().optional(),
  error: z.string().optional(),
}).strict();

const geocodeRequestSchema = z.object({
  address: z.string().min(1).max(500),
  country: z.string().length(2).optional(), // ISO country code
  locality: z.string().max(100).optional(),
}).strict();

// Mock location data storage
let mockLocationData: Array<{
  userId: string;
  lat: number;
  lng: number;
  accuracy?: number;
  geohash: string;
  locality?: string;
  country?: string;
  source: 'gps' | 'network' | 'manual';
  sharing: boolean;
  timestamp: string;
  updated_at: string;
}> = [
  {
    userId: "user1",
    lat: 40.7128,
    lng: -74.0060,
    accuracy: 5,
    geohash: "dr5regw3p",
    locality: "New York",
    country: "US",
    source: "gps",
    sharing: true,
    timestamp: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

// Mock user permission states
let mockPermissions: Array<{
  userId: string;
  permission: 'granted' | 'denied' | 'prompt';
  updated_at: string;
}> = [];

// Helper functions
function generateGeohash(lat: number, lng: number): string {
  // Simple geohash implementation for demo
  // In production, use a proper geohash library
  const latStr = Math.round(lat * 100000).toString(36);
  const lngStr = Math.round(lng * 100000).toString(36);
  return `${latStr}_${lngStr}`;
}

async function reverseGeocode(lat: number, lng: number): Promise<{
  locality?: string;
  country?: string;
  error?: string;
}> {
  // Mock reverse geocoding - in production use Google Maps, Mapbox, etc.
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Mock responses based on coordinates
    if (lat >= 40 && lat <= 41 && lng >= -75 && lng <= -73) {
      return { locality: "New York", country: "US" };
    } else if (lat >= 34 && lat <= 35 && lng >= -119 && lng <= -117) {
      return { locality: "Los Angeles", country: "US" };
    } else if (lat >= 51 && lat <= 52 && lng >= -1 && lng <= 1) {
      return { locality: "London", country: "GB" };
    } else {
      return { locality: "Unknown City", country: "Unknown" };
    }
  } catch (error) {
    return { error: "Geocoding service unavailable" };
  }
}

async function geocodeAddress(address: string): Promise<{
  lat?: number;
  lng?: number;
  accuracy?: number;
  error?: string;
}> {
  // Mock geocoding - in production use Google Maps, Mapbox, etc.
  try {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Mock responses for common addresses
    const lowerAddress = address.toLowerCase();
    if (lowerAddress.includes('new york')) {
      return { lat: 40.7128, lng: -74.0060, accuracy: 100 };
    } else if (lowerAddress.includes('los angeles')) {
      return { lat: 34.0522, lng: -118.2437, accuracy: 100 };
    } else if (lowerAddress.includes('london')) {
      return { lat: 51.5074, lng: -0.1278, accuracy: 100 };
    } else {
      return { error: "Address not found" };
    }
  } catch (error) {
    return { error: "Geocoding service unavailable" };
  }
}

function findLocationData(userId: string) {
  return mockLocationData.find(loc => loc.userId === userId);
}

function updateLocationData(userId: string, data: Partial<typeof mockLocationData[0]>) {
  const index = mockLocationData.findIndex(loc => loc.userId === userId);
  const timestamp = new Date().toISOString();
  
  if (index >= 0) {
    mockLocationData[index] = {
      ...mockLocationData[index],
      ...data,
      updated_at: timestamp,
    };
    return mockLocationData[index];
  } else {
    const newLocation = {
      userId,
      lat: 0,
      lng: 0,
      geohash: "",
      source: "manual" as const,
      sharing: false,
      timestamp,
      updated_at: timestamp,
      ...data,
    };
    mockLocationData.push(newLocation);
    return newLocation;
  }
}

function findPermission(userId: string) {
  return mockPermissions.find(perm => perm.userId === userId);
}

function updatePermission(userId: string, permission: 'granted' | 'denied' | 'prompt') {
  const index = mockPermissions.findIndex(perm => perm.userId === userId);
  const updated_at = new Date().toISOString();
  
  if (index >= 0) {
    mockPermissions[index] = { userId, permission, updated_at };
  } else {
    mockPermissions.push({ userId, permission, updated_at });
  }
}

// Routes

// POST /api/location/permission - Record location permission state
router.post("/location/permission", authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const permissionData = locationPermissionSchema.parse(req.body);
    
    let permissionState: 'granted' | 'denied' | 'prompt' = 'prompt';
    
    if (permissionData.granted) {
      permissionState = 'granted';
    } else if (permissionData.denied) {
      permissionState = 'denied';
    }
    
    updatePermission(user.id, permissionState);
    
    logSecurityEvent("location_permission_updated", {
      userId: user.id,
      permission: permissionState,
      error: permissionData.error,
    }, req);
    
    res.json({
      success: true,
      data: { 
        permission: permissionState,
        timestamp: new Date().toISOString()
      },
      message: `Location permission ${permissionState}`,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid permission data",
        details: error.errors
      });
    }
    
    console.error("Update location permission error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
});

// GET /api/location/permission - Get location permission state
router.get("/location/permission", authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const permission = findPermission(user.id);
    
    res.json({
      success: true,
      data: { 
        permission: permission?.permission || 'prompt',
        updated_at: permission?.updated_at,
      }
    });
  } catch (error: any) {
    console.error("Get location permission error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
});

// PUT /api/location - Update user location (GPS/network)
router.put("/location", authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const locationData = updateLocationSchema.parse(req.body);
    
    // Check if user has granted location permission
    const permission = findPermission(user.id);
    if (permission?.permission === 'denied') {
      return res.status(403).json({
        success: false,
        error: "Location permission denied",
        code: "PERMISSION_DENIED"
      });
    }
    
    // Perform reverse geocoding
    const geocodeResult = await reverseGeocode(locationData.lat, locationData.lng);
    
    if (geocodeResult.error) {
      console.warn("Reverse geocoding failed:", geocodeResult.error);
    }
    
    const geohash = generateGeohash(locationData.lat, locationData.lng);
    
    const updatedLocation = updateLocationData(user.id, {
      lat: locationData.lat,
      lng: locationData.lng,
      accuracy: locationData.accuracy,
      geohash,
      locality: geocodeResult.locality,
      country: geocodeResult.country,
      source: locationData.source,
      sharing: locationData.sharing ?? true,
      timestamp: locationData.timestamp || new Date().toISOString(),
    });
    
    logSecurityEvent("location_updated", {
      userId: user.id,
      lat: locationData.lat,
      lng: locationData.lng,
      source: locationData.source,
      accuracy: locationData.accuracy,
    }, req);
    
    // Publish real-time update
    await realtimeService.publishLocationUpdate(user.id, {
      lat: updatedLocation.lat,
      lng: updatedLocation.lng,
      locality: updatedLocation.locality,
      country: updatedLocation.country,
      sharing: updatedLocation.sharing,
      timestamp: updatedLocation.timestamp,
    });
    
    res.json({
      success: true,
      data: {
        location: {
          lat: updatedLocation.lat,
          lng: updatedLocation.lng,
          accuracy: updatedLocation.accuracy,
          locality: updatedLocation.locality,
          country: updatedLocation.country,
          sharing: updatedLocation.sharing,
          timestamp: updatedLocation.timestamp,
        }
      },
      message: "Location updated successfully"
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid location data",
        details: error.errors
      });
    }
    
    console.error("Update location error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
});

// POST /api/location/geocode - Geocode an address to coordinates
router.post("/location/geocode", authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const geocodeData = geocodeRequestSchema.parse(req.body);
    
    const geocodeResult = await geocodeAddress(geocodeData.address);
    
    if (geocodeResult.error) {
      return res.status(404).json({
        success: false,
        error: geocodeResult.error,
        code: "GEOCODE_FAILED"
      });
    }
    
    logSecurityEvent("address_geocoded", {
      userId: user.id,
      address: geocodeData.address,
      success: true,
    }, req);
    
    res.json({
      success: true,
      data: {
        coordinates: {
          lat: geocodeResult.lat,
          lng: geocodeResult.lng,
          accuracy: geocodeResult.accuracy,
        },
        address: geocodeData.address,
      },
      message: "Address geocoded successfully"
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid geocode request",
        details: error.errors
      });
    }
    
    console.error("Geocode address error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
});

// PUT /api/location/manual - Manually set location from address
router.put("/location/manual", authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const geocodeData = geocodeRequestSchema.parse(req.body);
    
    const geocodeResult = await geocodeAddress(geocodeData.address);
    
    if (geocodeResult.error) {
      return res.status(404).json({
        success: false,
        error: geocodeResult.error,
        code: "GEOCODE_FAILED"
      });
    }
    
    const geohash = generateGeohash(geocodeResult.lat!, geocodeResult.lng!);
    
    const updatedLocation = updateLocationData(user.id, {
      lat: geocodeResult.lat!,
      lng: geocodeResult.lng!,
      accuracy: geocodeResult.accuracy,
      geohash,
      locality: geocodeData.locality,
      country: geocodeData.country,
      source: 'manual',
      sharing: true,
      timestamp: new Date().toISOString(),
    });
    
    logSecurityEvent("location_set_manually", {
      userId: user.id,
      address: geocodeData.address,
      lat: geocodeResult.lat,
      lng: geocodeResult.lng,
    }, req);
    
    // Publish real-time update
    await realtimeService.publishLocationUpdate(user.id, {
      lat: updatedLocation.lat,
      lng: updatedLocation.lng,
      locality: updatedLocation.locality,
      country: updatedLocation.country,
      sharing: updatedLocation.sharing,
      timestamp: updatedLocation.timestamp,
      source: 'manual',
    });
    
    res.json({
      success: true,
      data: {
        location: {
          lat: updatedLocation.lat,
          lng: updatedLocation.lng,
          accuracy: updatedLocation.accuracy,
          locality: updatedLocation.locality,
          country: updatedLocation.country,
          sharing: updatedLocation.sharing,
          timestamp: updatedLocation.timestamp,
          source: 'manual',
        }
      },
      message: "Location set manually"
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid manual location data",
        details: error.errors
      });
    }
    
    console.error("Set manual location error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
});

// GET /api/location - Get current user's location
router.get("/location", authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const location = findLocationData(user.id);
    
    if (!location) {
      return res.json({
        success: true,
        data: { location: null },
        message: "No location data found"
      });
    }
    
    res.json({
      success: true,
      data: { 
        location: {
          lat: location.lat,
          lng: location.lng,
          accuracy: location.accuracy,
          locality: location.locality,
          country: location.country,
          sharing: location.sharing,
          source: location.source,
          timestamp: location.timestamp,
          updated_at: location.updated_at,
        }
      }
    });
  } catch (error: any) {
    console.error("Get location error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
});

// PATCH /api/location/sharing - Toggle location sharing
router.patch("/location/sharing", authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { sharing } = req.body;
    
    if (typeof sharing !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: "sharing must be a boolean value"
      });
    }
    
    let location = findLocationData(user.id);
    if (!location) {
      // Create a default location entry if none exists
      location = updateLocationData(user.id, {
        lat: 0,
        lng: 0,
        geohash: "unknown",
        source: 'manual',
        sharing,
        timestamp: new Date().toISOString(),
      });
    } else {
      location = updateLocationData(user.id, { sharing });
    }
    
    logSecurityEvent("location_sharing_toggled", {
      userId: user.id,
      sharing,
    }, req);
    
    // Publish real-time update
    await realtimeService.publishLocationUpdate(user.id, {
      sharing,
      timestamp: location.updated_at,
    });
    
    res.json({
      success: true,
      data: { 
        sharing,
        updated_at: location.updated_at,
      },
      message: `Location sharing ${sharing ? 'enabled' : 'disabled'}`
    });
  } catch (error: any) {
    console.error("Toggle location sharing error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
});

export default router;
