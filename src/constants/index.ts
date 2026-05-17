export const API_BASE_URL = 'http://localhost:5000/api/v1';

export const API_ENDPOINTS = {
  // Auth
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGIN: '/auth/login',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_REFRESH: '/auth/refresh',
  AUTH_ME: '/auth/me',

  // Users
  USER_PROFILE: '/users/profile',

  // Budget
  BUDGET: '/budget',
  BUDGET_LEDGER: '/budget/ledger',

  // Trips
  TRIPS: '/trips',
  TRIP_DETAIL: (tripId: string) => `/trips/${tripId}`,

  // Weather
  TRIP_WEATHER: (tripId: string) => `/trips/${tripId}/weather`,
  TRIP_WEATHER_REVIEW: (tripId: string) => `/trips/${tripId}/weather/review`,
  TRIP_REGENERATE_WEATHER_DAY: (tripId: string) => `/trips/${tripId}/regenerate-weather-impacted-day`,

  // Hotels
  TRIP_HOTELS: (tripId: string) => `/trips/${tripId}/hotels`,
  HOTEL_BOOKING_OPTIONS: (tripId: string, hotelId: string) =>
    `/trips/${tripId}/hotels/${hotelId}/booking-options`,

  // Activities
  ACTIVITY_BOOKING: (tripId: string, activityId: string) =>
    `/trips/${tripId}/activities/${activityId}/booking-options`,
  TRIP_ACTIVITIES: (tripId: string) => `/trips/${tripId}/activities`,
  TRIP_ACTIVITY: (tripId: string, activityId: string) =>
    `/trips/${tripId}/activities/${activityId}`,

  // AI Assistant
  ASSISTANT_OPTIMIZE: '/assistant/optimize-trip',
  ASSISTANT_CONFLICTS: '/assistant/check-conflicts',
  ASSISTANT_ALTERNATIVES: '/assistant/recommend-alternatives',
  ASSISTANT_SCORE: (tripId: string) => `/assistant/trips/${tripId}/score`,
} as const;

export const TRIP_STAGES = [
  { key: 'created', label: 'Trip Created', icon: 'MapPin' },
  { key: 'ai_generated', label: 'AI Plan Generated', icon: 'Brain' },
  { key: 'weather_checked', label: 'Weather Checked', icon: 'CloudSun' },
  { key: 'hotels_ready', label: 'Hotels Ready', icon: 'Building2' },
  { key: 'activities_ready', label: 'Activities Ready', icon: 'Compass' },
  { key: 'user_confirmed', label: 'User Confirmed', icon: 'CheckCircle2' },
  { key: 'optimized', label: 'Trip Optimized', icon: 'Sparkles' },
  { key: 'active', label: 'Trip Active', icon: 'Plane' },
  { key: 'completed', label: 'Trip Completed', icon: 'Flag' },
] as const;

export const ACTIVITY_CATEGORIES = [
  { value: 'sightseeing', label: 'Sightseeing', color: '#6366f1' },
  { value: 'dining', label: 'Dining', color: '#f59e0b' },
  { value: 'adventure', label: 'Adventure', color: '#ef4444' },
  { value: 'relaxation', label: 'Relaxation', color: '#10b981' },
  { value: 'cultural', label: 'Cultural', color: '#8b5cf6' },
  { value: 'shopping', label: 'Shopping', color: '#ec4899' },
  { value: 'transport', label: 'Transport', color: '#64748b' },
  { value: 'entertainment', label: 'Entertainment', color: '#f97316' },
  { value: 'nature', label: 'Nature', color: '#22c55e' },
] as const;

export const TRAVEL_STYLES = [
  'Backpacker',
  'Budget-Friendly',
  'Comfort',
  'Luxury',
  'Adventure',
  'Cultural',
  'Romantic',
  'Family',
  'Solo',
  'Group',
] as const;

export const INTERESTS = [
  'History',
  'Architecture',
  'Art & Museums',
  'Food & Cuisine',
  'Nature & Hiking',
  'Beaches',
  'Nightlife',
  'Shopping',
  'Photography',
  'Adventure Sports',
  'Wellness & Spa',
  'Local Culture',
  'Music & Concerts',
  'Wildlife',
  'Water Sports',
  'Mountain Trekking',
] as const;

export const FOOD_PREFERENCES = [
  'Local Cuisine',
  'Vegetarian',
  'Vegan',
  'Halal',
  'Kosher',
  'Gluten-Free',
  'Seafood',
  'Street Food',
  'Fine Dining',
  'No Preference',
] as const;

export const WEATHER_ICONS: Record<string, string> = {
  sunny: '☀️',
  partly_cloudy: '⛅',
  cloudy: '☁️',
  rainy: '🌧️',
  stormy: '⛈️',
  snowy: '❄️',
  windy: '💨',
  foggy: '🌫️',
  clear: '🌙',
};
