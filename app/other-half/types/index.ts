export interface User {
  id: string;
  email: string;
  full_name: string;
  age: number;
  location: string;
  bio: string;
  denomination: string;
  church_attendance: 'weekly' | 'monthly' | 'occasionally' | 'rarely';
  love_language: 'words_of_affirmation' | 'acts_of_service' | 'receiving_gifts' | 'quality_time' | 'physical_touch';
  personality_type: string;
  looking_for: 'dating' | 'marriage' | 'friendship' | 'community';
  interests: string[];
  availability: string[];
  preferred_age_min: number;
  preferred_age_max: number;
  max_distance: number;
  onboarding_complete: boolean;
  verification_status: 'pending' | 'approved' | 'rejected';
  profile_visible: boolean;
  show_location: boolean;
  face_photo_url?: string;
  id_type?: 'drivers_license' | 'passport' | 'state_id';
  id_photo_url?: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

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
}

export interface Game {
  id: string;
  name: string;
  description: string;
  type: 'solo' | 'paired';
  category: 'scripture' | 'values' | 'compatibility';
}

export interface GameSession {
  id: string;
  game_id: string;
  user_id: string;
  score: number;
  completed_at: string;
}

export interface DateIdea {
  id: string;
  title: string;
  description: string;
  category: 'low_key' | 'outdoors' | 'service';
  estimated_duration: string;
  cost_level: 'free' | 'low' | 'medium' | 'high';
}

export interface NotificationSettings {
  new_match: boolean;
  new_message: boolean;
  event_updates: boolean;
  community_updates: boolean;
}

export interface AdminAction {
  id: string;
  admin_id: string;
  action_type: string;
  target_id?: string;
  details: Record<string, any>;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  session_id: string;
  correlation_id: string;
  event_type: string;
  event_data: Record<string, any>;
  timestamp: string;
  ip_address?: string;
  user_agent?: string;
}

export interface OnboardingStep {
  step: number;
  title: string;
  isComplete: boolean;
  isActive: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ThemeMode {
  mode: 'neo-brutalism' | 'claymorphism' | 'material' | 'glassmorphism';
}
