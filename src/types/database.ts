/**
 * Enhanced Database Types for Production
 * Generated from JSON schemas in SCHEMAS/ and enhanced for application use
 */

// Union types for enums
export type UserRole = 'user' | 'support' | 'editor' | 'admin';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';
export type SubscriptionTier = 'free' | 'plus' | 'pro' | 'premium';
export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due' | 'incomplete' | 'trialing';
export type PaymentProvider = 'stripe' | 'apple' | 'google' | 'admin_comp';
export type BillingCycle = 'monthly' | 'yearly';

// New types from schemas
export type MessageType = 'text' | 'image' | 'voice' | 'video' | 'location' | 'gif' | 'sticker';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
export type MatchType = 'like' | 'super_like';
export type MatchStatus = 'active' | 'unmatched' | 'blocked' | 'expired';
export type ChurchDenomination = 'catholic' | 'protestant' | 'orthodox' | 'baptist' | 'methodist' | 
  'presbyterian' | 'pentecostal' | 'lutheran' | 'anglican' | 'evangelical' | 'non_denominational' | 'other';
export type ChurchVerificationStatus = 'pending' | 'verified' | 'rejected';
export type ProfileVisibility = 'public' | 'matches_only' | 'private';
export type AppTheme = 'light' | 'dark' | 'system' | 'faith';

// Admin action types
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

// Notification types
export type NotificationChannel = 'push' | 'email' | 'popup' | 'sms';
export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed' | 'paused';
export type ScheduleType = 'immediate' | 'scheduled' | 'recurring';
export type RecurringPattern = 'daily' | 'weekly' | 'monthly';
export type ActionType = 'open_app' | 'open_url' | 'deep_link';

// Core interfaces
export interface User {
  id: string;
  email: string;
  full_name?: string;
  age?: number;
  bio?: string;
  location?: {
    lat: number;
    lng: number;
    geohash?: string;
    locality?: string;
    country?: string;
  };
  denomination?: ChurchDenomination;
  church_attendance?: 'weekly' | 'monthly' | 'occasionally' | 'holidays_only' | 'never';
  love_language?: string;
  personality_type?: string;
  looking_for?: string;
  interests?: string[];
  availability?: string;
  preferred_age_min?: number;
  preferred_age_max?: number;
  max_distance?: number;
  onboarding_complete?: boolean;
  profile_visibility?: ProfileVisibility;
  show_age?: boolean;
  show_distance?: boolean;
  face_photo_url?: string;
  additional_photos?: string[];
  id_type?: string;
  id_photo_url?: string;
  role: UserRole;
  is_banned: boolean;
  verification_status: VerificationStatus;
  invited_by_invite_code?: string;
  signup_method?: 'email' | 'google' | 'apple' | 'facebook';
  subscription_tier: SubscriptionTier;
  entitlements?: string[];
  badges?: string[];
  blocked_users?: string[];
  streak_count?: number;
  total_points?: number;
  level?: number;
  last_active_at?: string;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
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
    profile_visibility: ProfileVisibility;
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
    preferred_denominations?: ChurchDenomination[];
    required_verification: boolean;
    preferred_church_attendance?: ('weekly' | 'monthly' | 'occasionally' | 'holidays_only' | 'never')[];
  };
  blocked_user_ids: string[];
  theme: AppTheme;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  message_type: MessageType;
  attachments?: Array<{
    id: string;
    url: string;
    type: 'image' | 'video' | 'audio' | 'document';
    filename?: string;
    size?: number;
    mime_type?: string;
  }>;
  status: MessageStatus;
  read_at?: string | null;
  delivered_at?: string | null;
  edited_at?: string | null;
  reply_to_id?: string | null;
  is_deleted: boolean;
  metadata?: {
    client_id?: string;
    platform?: string;
    location?: {
      lat: number;
      lng: number;
      address?: string;
    };
  };
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  conversation_id?: string | null;
  match_type: MatchType;
  status: MatchStatus;
  initiator_id: string;
  user1_liked_at?: string | null;
  user2_liked_at?: string | null;
  matched_at: string;
  unmatched_at?: string | null;
  unmatched_by?: string | null;
  unmatch_reason?: 'no_interest' | 'inappropriate' | 'spam' | 'other' | null;
  last_message_at?: string | null;
  expires_at?: string | null;
  metadata?: {
    compatibility_score?: number;
    mutual_interests?: string[];
    distance_km?: number;
  };
  created_at: string;
  updated_at: string;
}

export interface Church {
  id: string;
  name: string;
  denomination: ChurchDenomination;
  description?: string | null;
  website?: string | null;
  phone?: string | null;
  email?: string | null;
  address: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  location: {
    lat: number;
    lng: number;
    geohash?: string;
  };
  service_times: Array<{
    day: 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
    time: string;
    service_type: 'worship' | 'prayer' | 'bible_study' | 'youth' | 'children' | 'special';
    description?: string;
  }>;
  pastor_name?: string | null;
  membership_size?: 'small' | 'medium' | 'large' | 'megachurch' | null;
  languages: string[];
  facilities: Array<'parking' | 'nursery' | 'wheelchair_accessible' | 'youth_center' | 'gym' | 'kitchen' | 'bookstore'>;
  photo_urls: string[];
  verification_status: ChurchVerificationStatus;
  verified_at?: string | null;
  verified_by?: string | null;
  is_active: boolean;
  social_media?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  created_by?: string | null;
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

// Enhanced derived types
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

// Request/Response types for new APIs
export interface UpdateUserProfileRequest {
  full_name?: string;
  age?: number;
  bio?: string;
  denomination?: ChurchDenomination;
  church_attendance?: 'weekly' | 'monthly' | 'occasionally' | 'holidays_only' | 'never';
  interests?: string[];
  looking_for?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface UpdateUserSettingsRequest {
  push_preferences?: Partial<UserSettings['push_preferences']>;
  email_preferences?: Partial<UserSettings['email_preferences']>;
  privacy_preferences?: Partial<UserSettings['privacy_preferences']>;
  discovery_preferences?: Partial<UserSettings['discovery_preferences']>;
  theme?: AppTheme;
  language?: string;
}

export interface BlockUserRequest {
  reason?: string;
}

export interface UpdateLocationRequest {
  lat: number;
  lng: number;
  timestamp?: string;
  sharing?: boolean;
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
