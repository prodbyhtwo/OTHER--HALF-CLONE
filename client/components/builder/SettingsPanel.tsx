// client/components/builder/SettingsPanel.tsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Save, Check, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSettingsUpdates } from "@/hooks/use-realtime";
import { validateComponentProps, settingsPanelSchema } from "./registry";
import { useDebouncedCallback } from "use-debounce";

interface SettingsPanelProps {
  userId: string;
  section?: "push" | "email" | "privacy" | "discovery" | "all";
  showSaveButton?: boolean;
  autoSave?: boolean;
  autoSaveDelay?: number;
  className?: string;
}

interface UserSettings {
  user_id: string;
  push_preferences: {
    marketing: boolean;
    social: boolean;
    security: boolean;
    matches: boolean;
    messages: boolean;
    likes: boolean;
  };
  email_preferences: {
    marketing: boolean;
    social: boolean;
    security: boolean;
    matches: boolean;
    messages: boolean;
    weekly_digest: boolean;
  };
  privacy_preferences: {
    profile_visibility: "public" | "matches_only" | "private";
    show_age: boolean;
    show_distance: boolean;
    show_last_active: boolean;
    show_online_status: boolean;
    discoverable: boolean;
  };
  discovery_preferences: {
    min_age: number;
    max_age: number;
    max_distance_km: number;
    preferred_denominations?: string[];
    required_verification: boolean;
  };
  theme: "light" | "dark" | "system" | "faith";
  language: string;
  updated_at: string;
}

export function SettingsPanel(props: SettingsPanelProps) {
  const validatedProps = validateComponentProps(
    "SettingsPanel",
    props,
    settingsPanelSchema,
  );
  const {
    userId,
    section = "all",
    showSaveButton = true,
    autoSave = false,
    autoSaveDelay = 600,
    className,
  } = validatedProps;

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { lastUpdate } = useSettingsUpdates(userId);

  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const form = useForm<UserSettings>();

  // Load settings
  const {
    data: settingsData,
    isLoading,
    error,
  } = useQuery<{
    success: boolean;
    data: UserSettings;
  }>({
    queryKey: ["settings", userId],
    queryFn: async () => {
      const response = await fetch("/api/settings/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to load settings");
      return response.json();
    },
    staleTime: 30000, // 30 seconds
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (data: Partial<UserSettings>) => {
      const response = await fetch("/api/settings/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save settings");
      }

      return response.json();
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["settings", userId] });
      setIsDirty(false);
      setLastSaved(new Date());

      if (!context?.isAutoSave) {
        toast({
          title: "Settings saved",
          description: "Your settings have been updated successfully.",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to save settings",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Debounced auto-save
  const debouncedSave = useDebouncedCallback(async (data: UserSettings) => {
    if (autoSave && isDirty) {
      updateSettingsMutation.mutate(data, { context: { isAutoSave: true } });
    }
  }, autoSaveDelay);

  // Initialize form when settings are loaded
  useEffect(() => {
    if (settingsData?.data) {
      form.reset(settingsData.data);
    }
  }, [settingsData, form]);

  // Watch for changes and trigger auto-save
  useEffect(() => {
    const subscription = form.watch((data) => {
      setIsDirty(true);
      if (autoSave && data) {
        debouncedSave(data as UserSettings);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, autoSave, debouncedSave]);

  // Handle real-time settings updates
  useEffect(() => {
    if (lastUpdate?.type === "settings_update") {
      queryClient.invalidateQueries({ queryKey: ["settings", userId] });
    }
  }, [lastUpdate, queryClient, userId]);

  const handleSave = (data: UserSettings) => {
    updateSettingsMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading settings...</span>
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
              Failed to load settings. Please refresh the page and try again.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Settings</CardTitle>
        {autoSave && lastSaved && (
          <div className="flex items-center text-sm text-green-600">
            <Check className="h-4 w-4 mr-1" />
            Saved {lastSaved.toLocaleTimeString()}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-8">
            {/* Push Notifications */}
            {(section === "all" || section === "push") && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Push Notifications</h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="push_preferences.marketing"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Marketing</FormLabel>
                          <FormDescription>
                            Receive updates about new features and promotions
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="push_preferences.social"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Social Activity
                          </FormLabel>
                          <FormDescription>
                            Get notified about likes, matches, and messages
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="push_preferences.matches"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            New Matches
                          </FormLabel>
                          <FormDescription>
                            Be notified when you get a new match
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="push_preferences.messages"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Messages</FormLabel>
                          <FormDescription>
                            Get notified about new messages
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="push_preferences.security"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-yellow-50">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Security Alerts
                          </FormLabel>
                          <FormDescription>
                            Important security alerts (recommended)
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {section === "all" &&
              (section === "push" || section === "email") && <Separator />}

            {/* Email Notifications */}
            {(section === "all" || section === "email") && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email_preferences.marketing"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Marketing Emails
                          </FormLabel>
                          <FormDescription>
                            Receive promotional emails and newsletters
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email_preferences.matches"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Match Notifications
                          </FormLabel>
                          <FormDescription>
                            Email notifications for new matches
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email_preferences.weekly_digest"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Weekly Digest
                          </FormLabel>
                          <FormDescription>
                            Weekly summary of your activity and matches
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email_preferences.security"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-blue-50">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Security Emails
                          </FormLabel>
                          <FormDescription>
                            Critical security alerts (cannot be disabled)
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={true} disabled={true} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {section === "all" &&
              (section === "email" || section === "privacy") && <Separator />}

            {/* Privacy Settings */}
            {(section === "all" || section === "privacy") && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Privacy & Visibility</h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="privacy_preferences.profile_visibility"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Profile Visibility</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select visibility" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">
                                Public - Everyone can see
                              </SelectItem>
                              <SelectItem value="matches_only">
                                Matches Only - Only matched users
                              </SelectItem>
                              <SelectItem value="private">
                                Private - Hidden from discovery
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>
                          Control who can see your profile information
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="privacy_preferences.discoverable"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Show in Discovery
                          </FormLabel>
                          <FormDescription>
                            Allow others to find you in search and
                            recommendations
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="privacy_preferences.show_online_status"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Show Online Status
                          </FormLabel>
                          <FormDescription>
                            Let others see when you're online
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {section === "all" &&
              (section === "privacy" || section === "discovery") && (
                <Separator />
              )}

            {/* Discovery Settings */}
            {(section === "all" || section === "discovery") && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Discovery Preferences</h3>
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="discovery_preferences.min_age"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Minimum Age: {field.value}</FormLabel>
                        <FormControl>
                          <Slider
                            min={18}
                            max={100}
                            step={1}
                            value={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="discovery_preferences.max_age"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Maximum Age: {field.value}</FormLabel>
                        <FormControl>
                          <Slider
                            min={18}
                            max={100}
                            step={1}
                            value={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="discovery_preferences.max_distance_km"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>
                          Maximum Distance: {field.value} km
                        </FormLabel>
                        <FormControl>
                          <Slider
                            min={1}
                            max={500}
                            step={5}
                            value={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="discovery_preferences.required_verification"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Require Verification
                          </FormLabel>
                          <FormDescription>
                            Only show verified profiles in your discovery
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Save Button */}
            {showSaveButton && (
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={
                    updateSettingsMutation.isPending || (!isDirty && !autoSave)
                  }
                >
                  {updateSettingsMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Settings
                    </>
                  )}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default SettingsPanel;
