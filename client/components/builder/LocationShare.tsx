// client/components/builder/LocationShare.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { validateComponentProps, locationShareSchema } from "./registry";

interface LocationShareProps {
  userId: string;
  autoRequest?: boolean;
  showAccuracy?: boolean;
  onLocationUpdate?: string;
  className?: string;
}

interface LocationData {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp: string;
}

export function LocationShare(props: LocationShareProps) {
  const validatedProps = validateComponentProps('LocationShare', props, locationShareSchema);
  const { 
    userId, 
    autoRequest = false, 
    showAccuracy = false, 
    onLocationUpdate,
    className
  } = validatedProps;
  
  const [isRequesting, setIsRequesting] = useState(false);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permission, setPermission] = useState<PermissionState | null>(null);
  
  // Check geolocation permission status
  useEffect(() => {
    const checkPermission = async () => {
      if ('permissions' in navigator) {
        try {
          const result = await navigator.permissions.query({ name: 'geolocation' });
          setPermission(result.state);
          
          result.onchange = () => {
            setPermission(result.state);
          };
        } catch (error) {
          console.error('Permission query failed:', error);
        }
      }
    };
    
    checkPermission();
  }, []);
  
  // Auto-request location if enabled
  useEffect(() => {
    if (autoRequest && permission === 'granted') {
      requestLocation();
    }
  }, [autoRequest, permission]);
  
  const requestLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }
    
    setIsRequesting(true);
    setError(null);
    
    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000, // 1 minute
    };
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });
      
      const locationData: LocationData = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: new Date().toISOString(),
      };
      
      setLocation(locationData);
      
      // Update location on server
      await updateLocationOnServer(locationData);
      
      // Trigger callback action if specified
      if (onLocationUpdate) {
        // In a real implementation, this would trigger the specified action
        console.log('Triggering location update action:', onLocationUpdate);
      }
      
    } catch (error: any) {
      let errorMessage = 'Failed to get location';
      
      if (error.code === error.PERMISSION_DENIED) {
        errorMessage = 'Location access denied. Please enable location permissions.';
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        errorMessage = 'Location information unavailable';
      } else if (error.code === error.TIMEOUT) {
        errorMessage = 'Location request timed out';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsRequesting(false);
    }
  };
  
  const updateLocationOnServer = async (locationData: LocationData) => {
    try {
      const response = await fetch('/api/me/location', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          lat: locationData.lat,
          lng: locationData.lng,
          timestamp: locationData.timestamp,
          sharing: true,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update location');
      }
      
      toast.success('Location updated successfully');
      
    } catch (error) {
      console.error('Error updating location:', error);
      toast.error('Failed to update location on server');
    }
  };
  
  const formatAccuracy = (accuracy: number): string => {
    if (accuracy < 1000) {
      return `${Math.round(accuracy)}m`;
    }
    return `${(accuracy / 1000).toFixed(1)}km`;
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location Sharing
        </CardTitle>
        <CardDescription>
          Share your location to find nearby matches
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Permission Status */}
        {permission === 'denied' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Location access is blocked. Please enable location permissions in your browser settings.
            </AlertDescription>
          </Alert>
        )}
        
        {permission === 'prompt' && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You'll be asked for permission to access your location.
            </AlertDescription>
          </Alert>
        )}
        
        {/* Current Location */}
        {location && (
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 text-green-800 mb-2">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">Location Updated</span>
            </div>
            <div className="text-sm text-green-700 space-y-1">
              <div>
                Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </div>
              {showAccuracy && location.accuracy && (
                <div>
                  Accuracy: {formatAccuracy(location.accuracy)}
                </div>
              )}
              <div>
                Updated: {new Date(location.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        )}
        
        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Action Button */}
        <Button 
          onClick={requestLocation} 
          disabled={isRequesting || permission === 'denied'}
          className="w-full"
        >
          {isRequesting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Getting Location...
            </>
          ) : (
            <>
              <MapPin className="mr-2 h-4 w-4" />
              {location ? 'Update Location' : 'Share Location'}
            </>
          )}
        </Button>
        
        {/* Helper Text */}
        <p className="text-xs text-gray-600 text-center">
          Your location is used to show distance to other users and improve matching.
          We never share your exact location.
        </p>
      </CardContent>
    </Card>
  );
}

export default LocationShare;
