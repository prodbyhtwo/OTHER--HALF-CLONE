// client/components/builder/LocationShare.tsx
import React, { useState, useEffect, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  MapPin,
  Navigation,
  AlertTriangle,
  Check,
  Loader2,
  MapPinOff,
  Clock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocationUpdates } from "@/hooks/use-realtime";
import { validateComponentProps, locationShareSchema } from "./registry";

export interface LocationShareProps {
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
  locality?: string;
  country?: string;
  sharing: boolean;
  source: "gps" | "network" | "manual";
  timestamp: string;
  updated_at?: string;
}

interface LocationPermission {
  permission: "granted" | "denied" | "prompt";
  updated_at?: string;
}

export function LocationShare(props: LocationShareProps) {
  const validatedProps = validateComponentProps(
    "LocationShare",
    props,
    locationShareSchema,
  );
  const {
    userId,
    autoRequest = false,
    showAccuracy = false,
    onLocationUpdate,
    className,
  } = validatedProps;

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { lastUpdate } = useLocationUpdates(userId);

  const [manualAddress, setManualAddress] = useState("");
  const [locationTimeout, setLocationTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );

  // Get current location data
  const { data: locationData, error: locationError } = useQuery<{
    success: boolean;
    data: { location: LocationData | null };
  }>({
    queryKey: ["location", userId],
    queryFn: async () => {
      const response = await fetch("/api/location", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch location");
      return response.json();
    },
    staleTime: 30000, // 30 seconds
  });

  // Get location permission status
  const { data: permissionData } = useQuery<{
    success: boolean;
    data: LocationPermission;
  }>({
    queryKey: ["location-permission", userId],
    queryFn: async () => {
      const response = await fetch("/api/location/permission", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch permission");
      return response.json();
    },
  });

  // Update location permission
  const updatePermissionMutation = useMutation({
    mutationFn: async (permissionData: {
      granted?: boolean;
      denied?: boolean;
      error?: string;
    }) => {
      const response = await fetch("/api/location/permission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify(permissionData),
      });
      if (!response.ok) throw new Error("Failed to update permission");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["location-permission", userId],
      });
    },
  });

  // Update GPS location
  const updateLocationMutation = useMutation({
    mutationFn: async (locationData: {
      lat: number;
      lng: number;
      accuracy?: number;
      source: "gps" | "network" | "manual";
      sharing?: boolean;
      timestamp?: string;
    }) => {
      const response = await fetch("/api/location", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify(locationData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update location");
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["location", userId] });
      toast({
        title: "Location updated",
        description: "Your location has been successfully updated.",
      });

      if (onLocationUpdate) {
        console.log(`Triggering action: ${onLocationUpdate}`, data);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Location update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Geocode address and set manual location
  const setManualLocationMutation = useMutation({
    mutationFn: async (address: string) => {
      const response = await fetch("/api/location/manual", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({ address }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to set location from address");
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["location", userId] });
      setManualAddress("");
      toast({
        title: "Location set",
        description: "Your location has been set from the address.",
      });

      if (onLocationUpdate) {
        console.log(`Triggering action: ${onLocationUpdate}`, data);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Address not found",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Toggle location sharing
  const toggleSharingMutation = useMutation({
    mutationFn: async (sharing: boolean) => {
      const response = await fetch("/api/location/sharing", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({ sharing }),
      });
      if (!response.ok) throw new Error("Failed to update sharing preference");
      return response.json();
    },
    onSuccess: (data, sharing) => {
      queryClient.invalidateQueries({ queryKey: ["location", userId] });
      toast({
        title: `Location sharing ${sharing ? "enabled" : "disabled"}`,
        description: sharing
          ? "Your location is now visible to others"
          : "Your location is now private",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update sharing",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Clear location timeout
  const clearLocationTimeout = useCallback(() => {
    if (locationTimeout) {
      clearTimeout(locationTimeout);
      setLocationTimeout(null);
    }
  }, [locationTimeout]);

  // Request GPS location
  const requestLocation = useCallback(async () => {
    clearLocationTimeout();

    try {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by this browser");
      }

      // Check/request permission
      let permission: PermissionState = "prompt";
      try {
        const result = await navigator.permissions.query({
          name: "geolocation",
        });
        permission = result.state;
      } catch (e) {
        console.warn(
          "Permission API not supported, proceeding with geolocation request",
        );
      }

      if (permission === "denied") {
        updatePermissionMutation.mutate({ denied: true });
        throw new Error(
          "Location permission denied. Please enable location access in your browser settings.",
        );
      }

      // Set timeout for location request
      const timeoutId = setTimeout(() => {
        throw new Error(
          "Location request timed out. Please try again or enter your address manually.",
        );
      }, 15000); // 15 second timeout

      setLocationTimeout(timeoutId);

      // Get current position
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000, // 5 minutes
          });
        },
      );

      clearTimeout(timeoutId);
      setLocationTimeout(null);

      // Update permission status
      updatePermissionMutation.mutate({ granted: true });

      // Update location
      updateLocationMutation.mutate({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        source: "gps",
        sharing: true,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      clearLocationTimeout();

      let errorMessage = "Failed to get location";
      let permissionDenied = false;

      if (error.code === 1) {
        // PERMISSION_DENIED
        errorMessage =
          "Location permission denied. Please enable location access in your browser settings.";
        permissionDenied = true;
      } else if (error.code === 2) {
        // POSITION_UNAVAILABLE
        errorMessage =
          "Location unavailable. Please check your GPS or try entering your address manually.";
      } else if (error.code === 3) {
        // TIMEOUT
        errorMessage =
          "Location request timed out. Please try again or enter your address manually.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      if (permissionDenied) {
        updatePermissionMutation.mutate({ denied: true, error: errorMessage });
      }

      toast({
        title: "Location access failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [
    clearLocationTimeout,
    updatePermissionMutation,
    updateLocationMutation,
    toast,
  ]);

  // Handle manual address entry
  const handleManualLocation = useCallback(() => {
    if (!manualAddress.trim()) {
      toast({
        title: "Address required",
        description: "Please enter an address",
        variant: "destructive",
      });
      return;
    }

    setManualLocationMutation.mutate(manualAddress.trim());
  }, [manualAddress, setManualLocationMutation, toast]);

  // Handle Enter key in address input
  const handleAddressKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleManualLocation();
      }
    },
    [handleManualLocation],
  );

  // Auto-request location on mount if enabled
  useEffect(() => {
    if (autoRequest && permissionData?.data.permission === "prompt") {
      requestLocation();
    }
  }, [autoRequest, permissionData?.data.permission, requestLocation]);

  // Handle real-time location updates
  useEffect(() => {
    if (lastUpdate?.type === "location_update") {
      queryClient.invalidateQueries({ queryKey: ["location", userId] });
    }
  }, [lastUpdate, queryClient, userId]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      clearLocationTimeout();
    };
  }, [clearLocationTimeout]);

  const location = locationData?.data.location;
  const permission = permissionData?.data.permission || "prompt";
  const isLoading =
    updateLocationMutation.isPending || setManualLocationMutation.isPending;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location Sharing
        </CardTitle>
        <CardDescription>
          Share your location to find people nearby
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Permission Denied Alert */}
        {permission === "denied" && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Location permission denied. You can still enter your location
              manually below.
            </AlertDescription>
          </Alert>
        )}

        {/* Location Error Alert */}
        {locationError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to load location data. Please try again.
            </AlertDescription>
          </Alert>
        )}

        {/* Current Location Display */}
        {location && (
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              {location.sharing ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <MapPinOff className="h-4 w-4 text-orange-600" />
              )}
              <span className="font-medium">
                {location.sharing
                  ? "Location Shared"
                  : "Location Set (Private)"}
              </span>
              {location.source === "manual" && (
                <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                  Manual
                </span>
              )}
            </div>

            <div className="text-sm text-muted-foreground space-y-1">
              {location.locality && location.country && (
                <div className="font-medium">
                  {location.locality}, {location.country}
                </div>
              )}
              <div>Latitude: {location.lat.toFixed(6)}</div>
              <div>Longitude: {location.lng.toFixed(6)}</div>
              {showAccuracy && location.accuracy && (
                <div>Accuracy: ±{Math.round(location.accuracy)}m</div>
              )}
              <div className="flex items-center gap-1 text-xs">
                <Clock className="h-3 w-3" />
                Updated: {new Date(location.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        )}

        {/* GPS Location Button */}
        <Button
          onClick={requestLocation}
          disabled={isLoading}
          className="w-full"
          variant={location ? "outline" : "default"}
        >
          {updateLocationMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Navigation className="mr-2 h-4 w-4" />
          )}
          {updateLocationMutation.isPending
            ? "Getting Location..."
            : "Use Current Location"}
        </Button>

        {/* Manual Address Entry */}
        <div className="space-y-2">
          <Label htmlFor="manual-address">Or enter address manually:</Label>
          <div className="flex gap-2">
            <Input
              id="manual-address"
              placeholder="Enter your city or address..."
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
              onKeyPress={handleAddressKeyPress}
              disabled={isLoading}
            />
            <Button
              onClick={handleManualLocation}
              disabled={isLoading || !manualAddress.trim()}
              variant="outline"
            >
              {setManualLocationMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Set"
              )}
            </Button>
          </div>
        </div>

        {/* Sharing Toggle */}
        {location && (
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <Label htmlFor="sharing-toggle" className="font-medium">
                Share location with others
              </Label>
              <p className="text-xs text-muted-foreground">
                Allow others to see your location
              </p>
            </div>
            <Switch
              id="sharing-toggle"
              checked={location.sharing}
              onCheckedChange={(checked) =>
                toggleSharingMutation.mutate(checked)
              }
              disabled={toggleSharingMutation.isPending}
            />
          </div>
        )}
      </CardContent>

      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Your location helps us show you relevant matches nearby. You can
          change sharing preferences anytime in Settings.
        </p>
      </CardFooter>
    </Card>
  );
}

export default LocationShare;
