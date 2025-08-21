// client/components/builder/UserProfileForm.tsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Save,
  MapPin,
  User as UserIcon,
  AlertTriangle,
  Plus,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProfileUpdates } from "@/hooks/use-realtime";
import { validateComponentProps, userProfileFormSchema } from "./registry";

// Form validation schema
const profileFormSchema = z.object({
  full_name: z.string().min(1, "Name is required").max(255),
  age: z.number().min(18, "Must be 18 or older").max(100),
  bio: z.string().max(1000, "Bio must be under 1000 characters").optional(),
  denomination: z
    .enum([
      "catholic",
      "protestant",
      "orthodox",
      "baptist",
      "methodist",
      "presbyterian",
      "pentecostal",
      "lutheran",
      "anglican",
      "evangelical",
      "non_denominational",
      "other",
    ])
    .optional(),
  church_attendance: z
    .enum(["weekly", "monthly", "occasionally", "holidays_only", "never"])
    .optional(),
  interests: z
    .array(z.string())
    .max(20, "Maximum 20 interests allowed")
    .optional(),
  looking_for: z.string().max(100).optional(),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

interface UserProfileFormProps {
  userId: string;
  showFullForm?: boolean;
  onSaveSuccess?: string;
  redirectAfterSave?: string;
  className?: string;
}

interface User {
  id: string;
  email: string;
  full_name: string;
  age: number;
  bio?: string;
  denomination?: string;
  church_attendance?: string;
  interests?: string[];
  looking_for?: string;
  face_photo_url?: string;
  additional_photos?: string[];
  verification_status: string;
  created_at: string;
  updated_at: string;
  location?: {
    lat: number;
    lng: number;
    locality?: string;
    country?: string;
  };
}

const DENOMINATION_LABELS = {
  catholic: "Catholic",
  protestant: "Protestant",
  orthodox: "Orthodox",
  baptist: "Baptist",
  methodist: "Methodist",
  presbyterian: "Presbyterian",
  pentecostal: "Pentecostal",
  lutheran: "Lutheran",
  anglican: "Anglican",
  evangelical: "Evangelical",
  non_denominational: "Non-denominational",
  other: "Other",
};

const ATTENDANCE_LABELS = {
  weekly: "Weekly",
  monthly: "Monthly",
  occasionally: "Occasionally",
  holidays_only: "Holidays only",
  never: "Never",
};

export function UserProfileForm(props: UserProfileFormProps) {
  const validatedProps = validateComponentProps(
    "UserProfileForm",
    props,
    userProfileFormSchema,
  );
  const {
    userId,
    showFullForm = true,
    onSaveSuccess,
    redirectAfterSave,
    className,
  } = validatedProps;

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { lastUpdate } = useProfileUpdates(userId);

  const [newInterest, setNewInterest] = useState("");

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: "",
      age: 18,
      bio: "",
      interests: [],
      looking_for: "",
    },
  });

  // Get current user profile
  const {
    data: userData,
    isLoading,
    error,
  } = useQuery<{
    success: boolean;
    data: User;
  }>({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to load profile");
      return response.json();
    },
    staleTime: 30000, // 30 seconds
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update profile");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });

      if (onSaveSuccess) {
        console.log(`Triggering action: ${onSaveSuccess}`, data);
      }

      if (redirectAfterSave) {
        window.location.href = redirectAfterSave;
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Initialize form when user data is loaded
  useEffect(() => {
    if (userData?.data) {
      const user = userData.data;
      form.reset({
        full_name: user.full_name,
        age: user.age,
        bio: user.bio || "",
        denomination: user.denomination as any,
        church_attendance: user.church_attendance as any,
        interests: user.interests || [],
        looking_for: user.looking_for || "",
      });
    }
  }, [userData, form]);

  // Handle real-time profile updates
  useEffect(() => {
    if (lastUpdate?.type === "profile_update") {
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    }
  }, [lastUpdate, queryClient, userId]);

  const handleSave = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  const addInterest = () => {
    if (!newInterest.trim()) return;

    const currentInterests = form.getValues("interests") || [];
    if (currentInterests.length >= 20) {
      toast({
        title: "Maximum interests reached",
        description: "You can only add up to 20 interests.",
        variant: "destructive",
      });
      return;
    }

    if (currentInterests.includes(newInterest.trim())) {
      toast({
        title: "Interest already added",
        description: "This interest is already in your list.",
        variant: "destructive",
      });
      return;
    }

    form.setValue("interests", [...currentInterests, newInterest.trim()]);
    setNewInterest("");
  };

  const removeInterest = (index: number) => {
    const currentInterests = form.getValues("interests") || [];
    form.setValue(
      "interests",
      currentInterests.filter((_, i) => i !== index),
    );
  };

  const handleInterestKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addInterest();
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading profile...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="py-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to load profile. Please refresh the page and try again.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const currentInterests = form.watch("interests") || [];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserIcon className="h-5 w-5" />
          Edit Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>

              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your full name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                        min={18}
                        max={100}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {showFullForm && (
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Tell others about yourself..."
                          rows={4}
                        />
                      </FormControl>
                      <FormDescription>
                        Share something about your faith journey, interests, or
                        what you're looking for.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Faith Information */}
            {showFullForm && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Faith Background</h3>

                <FormField
                  control={form.control}
                  name="denomination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Denomination</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your denomination" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(DENOMINATION_LABELS).map(
                            ([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="church_attendance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Church Attendance</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="How often do you attend church?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(ATTENDANCE_LABELS).map(
                            ([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Interests */}
            {showFullForm && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Interests</h3>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add an interest..."
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      onKeyPress={handleInterestKeyPress}
                      disabled={currentInterests.length >= 20}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addInterest}
                      disabled={
                        !newInterest.trim() || currentInterests.length >= 20
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {currentInterests.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {currentInterests.map((interest, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {interest}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => removeInterest(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  <FormDescription>
                    Add up to 20 interests to help others learn about you. (
                    {currentInterests.length}/20)
                  </FormDescription>
                </div>
              </div>
            )}

            {/* What You're Looking For */}
            {showFullForm && (
              <FormField
                control={form.control}
                name="looking_for"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What You're Looking For</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., Serious relationship, friendship, fellowship"
                      />
                    </FormControl>
                    <FormDescription>
                      Briefly describe what type of connection you're seeking.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Current Location Display */}
            {userData?.data.location && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium">Current Location</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {userData.data.location.locality &&
                  userData.data.location.country
                    ? `${userData.data.location.locality}, ${userData.data.location.country}`
                    : `${userData.data.location.lat.toFixed(4)}, ${userData.data.location.lng.toFixed(4)}`}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Use the Location Share component to update your location.
                </p>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={updateProfileMutation.isPending}>
                {updateProfileMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Profile
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default UserProfileForm;
