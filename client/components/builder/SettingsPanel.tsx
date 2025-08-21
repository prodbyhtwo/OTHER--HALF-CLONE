// client/components/builder/SettingsPanel.tsx
import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save, Check } from "lucide-react";
import { toast } from "sonner";
import { validateComponentProps, settingsPanelSchema } from "./registry";
import { useDebouncedCallback } from 'use-debounce';
import type { UserSettings } from "../../src/types/database";

interface SettingsPanelProps {
  userId: string;
  section?: 'push' | 'email' | 'privacy' | 'discovery' | 'all';
  showSaveButton?: boolean;
  autoSave?: boolean;
  autoSaveDelay?: number;
}

interface SettingsFormData {
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
    profile_visibility: 'public' | 'matches_only' | 'private';
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
    required_verification: boolean;
  };
}

export function SettingsPanel(props: SettingsPanelProps) {
  // Validate props at runtime
  const validatedProps = validateComponentProps('SettingsPanel', props, settingsPanelSchema);
  const { 
    userId, 
    section = 'all', 
    showSaveButton = true, 
    autoSave = false, 
    autoSaveDelay = 600 
  } = validatedProps;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  
  const form = useForm<SettingsFormData>();
  
  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/me/settings', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to load settings');
        }
        
        const data: { success: boolean; data: { settings: UserSettings } } = await response.json();
        const settings = data.data.settings;
        
        form.reset({
          push_preferences: settings.push_preferences,
          email_preferences: settings.email_preferences,
          privacy_preferences: settings.privacy_preferences,
          discovery_preferences: settings.discovery_preferences,
        });
        
      } catch (error) {
        console.error('Error loading settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [userId, form]);
  
  // Debounced auto-save
  const debouncedSave = useDebouncedCallback(
    async (data: SettingsFormData) => {
      if (autoSave && isDirty) {
        await handleSave(data, true);
      }
    },
    autoSaveDelay
  );
  
  // Watch for changes and trigger auto-save
  useEffect(() => {
    const subscription = form.watch((data) => {
      setIsDirty(true);
      if (autoSave) {
        debouncedSave(data as SettingsFormData);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, autoSave, debouncedSave]);
  
  const handleSave = async (data: SettingsFormData, isAutoSave = false) => {
    try {
      if (!isAutoSave) {
        setIsSaving(true);
      }
      
      const response = await fetch('/api/me/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save settings');
      }
      
      setIsDirty(false);
      setLastSaved(new Date());
      
      if (!isAutoSave) {
        toast.success('Settings saved successfully!');
      }
      
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings. Please try again.');
    } finally {
      if (!isAutoSave) {
        setIsSaving(false);
      }
    }
  };
  
  const onSubmit = (data: SettingsFormData) => {
    handleSave(data);
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading settings...</span>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Push Notifications */}
            {(section === 'all' || section === 'push') && (
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
                          <FormLabel className="text-base">Social Activity</FormLabel>
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
                    name="push_preferences.security"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Security</FormLabel>
                          <FormDescription>
                            Important security alerts and account changes
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
            
            {(section === 'all' || section === 'push') && (section === 'all' || section === 'email') && (
              <Separator />
            )}
            
            {/* Email Notifications */}
            {(section === 'all' || section === 'email') && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email_preferences.marketing"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Marketing Emails</FormLabel>
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
                    name="email_preferences.weekly_digest"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Weekly Digest</FormLabel>
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
                          <FormLabel className="text-base">Security Emails</FormLabel>
                          <FormDescription>
                            Critical security alerts (cannot be disabled)
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={true}
                            disabled={true}
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
                  disabled={isSaving || (!isDirty && !autoSave)}
                >
                  {isSaving ? (
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
