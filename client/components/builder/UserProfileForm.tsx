// client/components/builder/UserProfileForm.tsx
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, MapPin } from "lucide-react";
import { toast } from "sonner";
import { validateComponentProps, userProfileFormSchema } from "./registry";
import type { User, ChurchDenomination } from "../../src/types/database";

// Form validation schema
const profileFormSchema = z.object({
  full_name: z.string().min(1, "Name is required").max(255),
  age: z.number().min(18, "Must be 18 or older").max(100),
  bio: z.string().max(1000, "Bio must be under 1000 characters").optional(),
  denomination: z.enum([
    'catholic', 'protestant', 'orthodox', 'baptist', 'methodist',
    'presbyterian', 'pentecostal', 'lutheran', 'anglican', 
    'evangelical', 'non_denominational', 'other'
  ]).optional(),
  church_attendance: z.enum(['weekly', 'monthly', 'occasionally', 'holidays_only', 'never']).optional(),
  interests: z.array(z.string()).max(20, "Maximum 20 interests allowed").optional(),
  looking_for: z.string().max(100).optional(),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

interface UserProfileFormProps {
  userId: string;
  showFullForm?: boolean;
  onSaveSuccess?: string;
  redirectAfterSave?: string;
}

interface UserProfileData {
  user: User;
}

export function UserProfileForm(props: UserProfileFormProps) {
  // Validate props at runtime
  const validatedProps = validateComponentProps('UserProfileForm', props, userProfileFormSchema);
  const { userId, showFullForm = true, onSaveSuccess, redirectAfterSave } = validatedProps;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [newInterest, setNewInterest] = useState("");
  
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: "",
      interests: [],
    }
  });

  // Load user data
  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/me', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to load user data');
        }
        
        const data: { success: boolean; data: UserProfileData } = await response.json();
        const userData = data.data.user;
        
        setUser(userData);
        
        // Populate form with user data
        form.reset({
          full_name: userData.full_name || "",
          age: userData.age || 18,
          bio: userData.bio || "",
          denomination: userData.denomination as ChurchDenomination,
          church_attendance: userData.church_attendance,
          interests: userData.interests || [],
          looking_for: userData.looking_for || "",
        });
      } catch (error) {
        console.error('Error loading user:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [userId, form]);

  const handleSave = async (data: ProfileFormData) => {
    try {
      setIsSaving(true);
      
      const response = await fetch('/api/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save profile');
      }
      
      const result = await response.json();
      
      toast.success('Profile updated successfully!');
      
      // Trigger success action if specified
      if (onSaveSuccess) {
        // In a real implementation, this would trigger the specified action
        console.log('Triggering success action:', onSaveSuccess);
      }
      
      // Redirect if specified
      if (redirectAfterSave) {
        window.location.href = redirectAfterSave;
      }
      
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const addInterest = () => {
    if (newInterest.trim() && !form.getValues('interests')?.includes(newInterest.trim())) {
      const currentInterests = form.getValues('interests') || [];
      if (currentInterests.length < 20) {
        form.setValue('interests', [...currentInterests, newInterest.trim()]);
        setNewInterest("");
      } else {
        toast.error('Maximum 20 interests allowed');
      }
    }
  };

  const removeInterest = (interest: string) => {
    const currentInterests = form.getValues('interests') || [];
    form.setValue('interests', currentInterests.filter(i => i !== interest));
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading profile...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Edit Profile</span>
          {!showFullForm && <Badge variant="secondary">Quick Edit</Badge>}
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
                      <Input placeholder="Enter your full name" {...field} />
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
                        min="18" 
                        max="100"
                        placeholder="Enter your age"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell others about yourself..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Share what makes you unique (max 1000 characters)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Faith & Lifestyle (Full Form Only) */}
            {showFullForm && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Faith & Lifestyle</h3>
                
                <FormField
                  control={form.control}
                  name="denomination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Denomination</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your denomination" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="catholic">Catholic</SelectItem>
                          <SelectItem value="protestant">Protestant</SelectItem>
                          <SelectItem value="orthodox">Orthodox</SelectItem>
                          <SelectItem value="baptist">Baptist</SelectItem>
                          <SelectItem value="methodist">Methodist</SelectItem>
                          <SelectItem value="presbyterian">Presbyterian</SelectItem>
                          <SelectItem value="pentecostal">Pentecostal</SelectItem>
                          <SelectItem value="lutheran">Lutheran</SelectItem>
                          <SelectItem value="anglican">Anglican</SelectItem>
                          <SelectItem value="evangelical">Evangelical</SelectItem>
                          <SelectItem value="non_denominational">Non-denominational</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="How often do you attend church?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="occasionally">Occasionally</SelectItem>
                          <SelectItem value="holidays_only">Holidays Only</SelectItem>
                          <SelectItem value="never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="looking_for"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Looking For</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., meaningful relationship, friendship, marriage"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Interests */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Interests</h3>
              
              {/* Current Interests */}
              <div className="flex flex-wrap gap-2">
                {form.watch('interests')?.map((interest, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="cursor-pointer hover:bg-red-100"
                    onClick={() => removeInterest(interest)}
                  >
                    {interest} ×
                  </Badge>
                ))}
              </div>
              
              {/* Add Interest */}
              <div className="flex gap-2">
                <Input
                  placeholder="Add an interest"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                />
                <Button type="button" variant="outline" onClick={addInterest}>
                  Add
                </Button>
              </div>
              
              <FormDescription>
                Add up to 20 interests. Click on a tag to remove it.
              </FormDescription>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
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
