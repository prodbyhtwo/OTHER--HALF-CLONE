/**
 * Enhanced Database Types for Production
 * Generated from JSON schemas in SCHEMAS/
 */

export type UserRole = 'user' | 'support' | 'editor' | 'admin';
export type VerificationStatus = 'pending' | 'approved' | 'rejected';
export type SubscriptionTier = 'free' | 'plus' | 'pro' | 'premium';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'incomplete' | 'trialing' | 'paused';
export type PaymentProvider = 'stripe' | 'apple' | 'google' | 'admin_comp';
export type BillingCycle = 'monthly' | 'annual' | 'lifetime';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  age?: number;
  location?: string;
  bio?: string;
  denomination?: string;
  church_attendance?: 'weekly' | 'monthly' | 'occasionally' | 'rarely';
  love_language?: 'words_of_affirmation' | 'acts_of_service' | 'receiving_gifts' | 'quality_time' | 'physical_touch';
  personality_type?: string;
  looking_for?: 'dating' | 'marriage' | 'friendship' | 'community';
  interests: string[];
  availability: string[];
  preferred_age_min?: number;
  preferred_age_max?: number;
  max_distance?: number;
  onboarding_complete: boolean;
  profile_visible: boolean;
  show_location: boolean;
  face_photo_url?: string;
  id_type?: 'drivers_license' | 'passport' | 'state_id';
  id_photo_url?: string;
  
  // Enhanced fields for production
  role: UserRole;
  is_banned: boolean;
  verification_status: VerificationStatus;
  subscription_tier: SubscriptionTier;
  entitlements: string[];
  badges: string[];
  blocked_users: string[];
  
  // Gamification
  streak_count: number;
  total_points: number;
  level: number;
  
  // Timestamps
  last_active_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  provider: PaymentProvider;
  customer_id?: string;
  subscription_id?: string;
  status: SubscriptionStatus;
  price_id?: string;
  current_tier: SubscriptionTier;
  billing_cycle?: BillingCycle;
  amount?: number;
  currency: string;
  trial_start?: string;
  trial_end?: string;
  started_at?: string;
  renews_at?: string;
  ends_at?: string;
  cancel_at_period_end: boolean;
  canceled_at?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export type AdminActionType = 
  | 'user_ban'
  | 'user_unban'
  | 'user_approve'
  | 'user_reject'
  | 'user_promote'
  | 'user_demote'
  | 'subscription_change'
  | 'subscription_comp'
  | 'content_create'
  | 'content_update'
  | 'content_delete'
  | 'notification_send'
  | 'bulk_approve_all'
  | 'bulk_approve_verified'
  | 'church_create'
  | 'church_update'
  | 'church_delete'
  | 'learning_content_create'
  | 'learning_content_update'
  | 'learning_content_delete'
  | 'system_setting_change';

export type TargetType = 'user' | 'subscription' | 'church' | 'learning_content' | 'notification' | 'system';

export interface AdminAction {
  id: string;
  admin_id: string;
  action_type: AdminActionType;
  target_id?: string;
  target_type?: TargetType;
  metadata?: {
    before?: Record<string, any>;
    after?: Record<string, any>;
    reason?: string;
    bulk_count?: number;
    filters_applied?: Record<string, any>;
  };
  correlation_id: string;
  session_id?: string;
  timestamp: string;
  ip_address: string;
  user_agent?: string;
  success: boolean;
  error_message?: string;
}

export type NotificationChannel = 'push' | 'email' | 'popup' | 'sms';
export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed' | 'paused';
export type ScheduleType = 'immediate' | 'scheduled' | 'recurring';
export type RecurringPattern = 'daily' | 'weekly' | 'monthly';
export type ActionType = 'open_app' | 'open_url' | 'deep_link';

export interface NotificationCampaign {
  id: string;
  name: string;
  channel: NotificationChannel;
  audience_query: {
    filters: {
      subscription_tiers?: SubscriptionTier[];
      verification_status?: VerificationStatus[];
      locations?: string[];
      age_min?: number;
      age_max?: number;
      denominations?: string[];
      last_active_within_days?: number;
    };
    estimated_reach?: number;
  };
  schedule?: {
    type: ScheduleType;
    send_at?: string;
    timezone?: string;
    recurring_pattern?: RecurringPattern;
    end_date?: string;
  };
  payload: {
    title: string;
    body: string;
    image_url?: string;
    action_url?: string;
    action_type?: ActionType;
    custom_data?: Record<string, any>;
  };
  frequency_cap?: {
    max_per_user_per_day?: number;
    min_hours_between?: number;
  };
  status: CampaignStatus;
  metrics?: {
    sent_count: number;
    delivered_count: number;
    opened_count: number;
    clicked_count: number;
    failed_count: number;
  };
  created_by: string;
  approved_by?: string;
  sent_at?: string;
  created_at: string;
  updated_at: string;
}

// Enhanced existing types
export interface DailyMatch {
  id: string;
  profile: User;
  compatibility_score: number;
  compatibility_breakdown: {
    faith: number;
    values: number;
    interests: number;
    lifestyle: number;
  };
}

export interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  is_mutual: boolean;
}

export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  text: string;
  created_at: string;
  type: 'text' | 'voice';
  voice_url?: string;
  voice_duration?: number;
}

export interface Church {
  id: string;
  name: string;
  denomination: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  website?: string;
  service_times: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface LearningContent {
  id: string;
  title: string;
  description: string;
  category: 'relationship' | 'faith' | 'personal_growth' | 'communication';
  content_type: 'article' | 'video' | 'podcast' | 'quiz';
  content_url?: string;
  content_text?: string;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

// Utility types for API responses
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  correlation_id: string;
}

// Entitlements mapping
export const ENTITLEMENTS_BY_TIER: Record<SubscriptionTier, string[]> = {
  free: ['basic_matches', 'basic_messaging'],
  plus: ['basic_matches', 'basic_messaging', 'enhanced_filters', 'see_who_liked'],
  pro: ['basic_matches', 'basic_messaging', 'enhanced_filters', 'see_who_liked', 'unlimited_likes', 'read_receipts'],
  premium: ['basic_matches', 'basic_messaging', 'enhanced_filters', 'see_who_liked', 'unlimited_likes', 'read_receipts', 'priority_support', 'exclusive_events']
};

export const PERMISSION_LEVELS: Record<UserRole, number> = {
  user: 0,
  support: 1,
  editor: 2,
  admin: 3
};
