export const ROUTES = {
  LANDING: '/',
  ONBOARDING: '/onboarding',
  DASHBOARD: '/dashboard',
  DISCOVER: '/discover', 
  MESSAGES: '/messages',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  CHURCHES: '/churches',
  LEARNING: '/learning',
  GAMES: '/games',
  PLANNER: '/planner',
  AGENT: '/agent',
  ADMIN: '/admin'
} as const;

export const ONBOARDING_STEPS = [
  { step: 1, title: 'Personal Info', route: '/onboarding/personal' },
  { step: 2, title: 'Faith Profile', route: '/onboarding/faith' },
  { step: 3, title: 'Interests', route: '/onboarding/interests' },
  { step: 4, title: 'Preferences', route: '/onboarding/preferences' },
  { step: 5, title: 'Availability', route: '/onboarding/availability' },
  { step: 6, title: 'Photos', route: '/onboarding/photos' },
  { step: 7, title: 'Verification', route: '/onboarding/verification' }
] as const;

export const DENOMINATIONS = [
  'Baptist',
  'Methodist', 
  'Presbyterian',
  'Lutheran',
  'Catholic',
  'Episcopal',
  'Pentecostal',
  'Non-denominational',
  'Orthodox',
  'Reformed',
  'Other'
] as const;

export const CHURCH_ATTENDANCE = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'occasionally', label: 'Occasionally' },
  { value: 'rarely', label: 'Rarely' }
] as const;

export const LOVE_LANGUAGES = [
  { value: 'words_of_affirmation', label: 'Words of Affirmation' },
  { value: 'acts_of_service', label: 'Acts of Service' },
  { value: 'receiving_gifts', label: 'Receiving Gifts' },
  { value: 'quality_time', label: 'Quality Time' },
  { value: 'physical_touch', label: 'Physical Touch' }
] as const;

export const LOOKING_FOR_OPTIONS = [
  { value: 'dating', label: 'Dating' },
  { value: 'marriage', label: 'Marriage' },
  { value: 'friendship', label: 'Friendship' },
  { value: 'community', label: 'Community' }
] as const;

export const AVAILABILITY_OPTIONS = [
  'weekday_mornings',
  'weekday_afternoons', 
  'weekday_evenings',
  'weekend_mornings',
  'weekend_afternoons',
  'weekend_evenings'
] as const;

export const ID_TYPES = [
  { value: 'drivers_license', label: "Driver's License" },
  { value: 'passport', label: 'Passport' },
  { value: 'state_id', label: 'State ID' }
] as const;

export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
} as const;

export const GAME_TYPES = {
  SCRIPTURE_SPARKS: 'scripture_sparks',
  VALUES_COMPASS: 'values_compass',
  WOULD_YOU_RATHER: 'would_you_rather'
} as const;

export const CONTENT_CATEGORIES = [
  'relationship',
  'faith',
  'personal_growth',
  'communication'
] as const;

export const DATE_IDEA_CATEGORIES = [
  'low_key',
  'outdoors',
  'service'
] as const;

export const THEME_MODES = [
  'neo-brutalism',
  'claymorphism', 
  'material',
  'glassmorphism'
] as const;

export const AUDIT_EVENTS = {
  // UI Events
  UI_CLICK: 'ui.click',
  UI_SUBMIT: 'ui.submit',
  UI_ROUTE_CHANGE: 'ui.route_change',
  UI_ANIM_START: 'ui.anim_start',
  UI_ANIM_STOP: 'ui.anim_stop',
  
  // Network Events
  NET_REQUEST: 'net.request',
  NET_RESPONSE: 'net.response',
  
  // Error Events
  ERROR_BOUNDARY: 'error.boundary',
  UI_CONTROL_WITHOUT_HANDLER: 'ui.control_without_handler',
  
  // Admin Events
  ADMIN_ACTION: 'admin.action'
} as const;

export const ANIMATION_CONFIG = {
  EASING: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  DURATION: {
    QUICK: 120,
    NORMAL: 220,
    SLOW: 300
  }
} as const;

export const BIBLICAL_VERSES = [
  "Love is patient, love is kind. - 1 Corinthians 13:4",
  "Two are better than one. - Ecclesiastes 4:9", 
  "Above all else, guard your heart. - Proverbs 4:23",
  "A wife of noble character who can find? - Proverbs 31:10",
  "He who finds a wife finds what is good. - Proverbs 18:22",
  "Be completely humble and gentle. - Ephesians 4:2"
] as const;
