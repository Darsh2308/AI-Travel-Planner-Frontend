// ===== Auth Types =====
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences?: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  travelStyle?: 'budget' | 'comfort' | 'luxury' | 'adventure';
  dietaryPreferences?: string[];
  activityLevel?: 'low' | 'moderate' | 'high';
  interests?: string[];
  mobilityNeeds?: string;
  theme?: 'light' | 'dark' | 'system';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// ===== Budget Types =====
export interface Budget {
  id: string;
  userId: string;
  totalBudget: number;
  allocatedBudget: number;
  spentBudget: number;
  remainingBudget: number;
  currency: string;
  categories: BudgetCategory[];
}

export interface BudgetCategory {
  name: string;
  allocated: number;
  spent: number;
  color: string;
}

export interface LedgerEntry {
  id: string;
  type: 'credit' | 'debit' | 'allocation';
  amount: number;
  description: string;
  category: string;
  tripId?: string;
  tripName?: string;
  createdAt: string;
}

// ===== Trip Types =====
export type TripStatus =
  | 'created'
  | 'ai_generated'
  | 'weather_checked'
  | 'hotels_ready'
  | 'activities_ready'
  | 'user_confirmed'
  | 'optimized'
  | 'active'
  | 'completed'
  | 'cancelled';

export interface Trip {
  id: string;
  userId: string;
  destination: string;
  country: string;
  startDate: string;
  endDate: string;
  travelers: number;
  status: TripStatus;
  budgetTier: 'budget' | 'mid-range' | 'luxury';
  travelStyle: string;
  interests: string[];
  foodPreferences: string[];
  mobilityPreferences: string;
  totalBudget: number;
  spentBudget: number;
  itinerary: DayItinerary[];
  score?: TripScore;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DayItinerary {
  day: number;
  date: string;
  title: string;
  activities: Activity[];
  weather?: DayWeather;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  time: string;
  duration: string;
  location: string;
  category: ActivityCategory;
  cost: number;
  currency: string;
  bookingUrl?: string;
  bookingStatus?: 'not_booked' | 'pending' | 'confirmed' | 'cancelled';
  rating?: number;
  imageUrl?: string;
  notes?: string;
}

export type ActivityCategory =
  | 'sightseeing'
  | 'dining'
  | 'adventure'
  | 'relaxation'
  | 'cultural'
  | 'shopping'
  | 'transport'
  | 'accommodation'
  | 'entertainment'
  | 'nature';

export interface CreateTripPayload {
  destination: string;
  country: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budgetTier: string;
  travelStyle: string;
  interests: string[];
  foodPreferences: string[];
  mobilityPreferences: string;
}

export interface TripScore {
  overall: number;
  categories: {
    budget: number;
    weather: number;
    activities: number;
    timing: number;
    diversity: number;
  };
  recommendations: string[];
}

// ===== Weather Types =====
export interface DayWeather {
  date: string;
  condition: WeatherCondition;
  temperature: {
    high: number;
    low: number;
    unit: 'celsius' | 'fahrenheit';
  };
  humidity: number;
  windSpeed: number;
  precipitation: number;
  advisory?: string;
  icon: string;
  impactsActivities: boolean;
}

export type WeatherCondition =
  | 'sunny'
  | 'partly_cloudy'
  | 'cloudy'
  | 'rainy'
  | 'stormy'
  | 'snowy'
  | 'windy'
  | 'foggy'
  | 'clear';

export interface WeatherReview {
  tripId: string;
  approved: boolean;
  notes?: string;
}

// ===== Hotel Types =====
export interface Hotel {
  id: string;
  name: string;
  description: string;
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  currency: string;
  images: string[];
  amenities: string[];
  location: string;
  coordinates?: { lat: number; lng: number };
  stars: number;
  bookingOptions: BookingOption[];
}

export interface BookingOption {
  id: string;
  provider: string;
  price: number;
  currency: string;
  roomType: string;
  url: string;
  cancellationPolicy: string;
  breakfast: boolean;
}

// ===== AI Assistant Types =====
export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  type?: 'text' | 'optimization' | 'conflict' | 'alternative' | 'score';
  data?: Record<string, unknown>;
  timestamp: string;
}

export interface OptimizationResult {
  suggestions: Suggestion[];
  savingsEstimate: number;
  scoreImprovement: number;
}

export interface Suggestion {
  id: string;
  type: 'swap' | 'remove' | 'add' | 'reschedule';
  description: string;
  impact: string;
  savings?: number;
  accepted?: boolean;
}

export interface ConflictResult {
  conflicts: Conflict[];
  severity: 'none' | 'low' | 'medium' | 'high';
}

export interface Conflict {
  id: string;
  type: 'time_overlap' | 'distance' | 'weather' | 'budget';
  description: string;
  affectedActivities: string[];
  suggestion: string;
}

export interface AlternativeResult {
  alternatives: Alternative[];
}

export interface Alternative {
  id: string;
  original: string;
  suggestion: string;
  reason: string;
  costDifference: number;
  rating?: number;
}

// ===== API Response Types =====
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}
