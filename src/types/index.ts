// ===== Auth Types =====
export interface User {
  id: string;
  _id?: string;
  fullName: string;
  email: string;
  phone?: string;
  country?: string;
  city?: string;
  avatarUrl?: string;
  isEmailVerified?: boolean;
  preferences?: UserPreferences;
  budgetLedger?: BudgetLedger;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  travelStyle?: 'adventure' | 'cultural' | 'relaxation' | 'family' | 'business' | 'backpacker' | 'luxury' | 'eco' | '';
  hotelTier?: 'budget' | 'standard' | 'premium' | 'luxury' | '';
  preferredCurrency?: string;
  dietaryPreferences?: string[];
  activityPreferences?: string[];
  avoidActivities?: string[];
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// ===== Budget Types =====
export interface BudgetLedger {
  totalBudget: number;
  allocatedBudget: number;
  spentBudget: number;
  remainingBudget: number;
  currency: string;
  entries?: LedgerEntry[];
}

// Legacy alias kept for hook compatibility
export type Budget = BudgetLedger;

export interface LedgerEntry {
  type: 'allocation' | 'release' | 'update';
  amount: number;
  description: string;
  createdAt: string;
}

export interface UpdateBudgetPayload {
  currency: string;
  total: number;
}

export interface BudgetAllocationPayload {
  amount: number;
  description: string;
}

// ===== Trip Types =====
export type TripStatus =
  | 'draft'
  | 'planned'
  | 'weather_review_pending'
  | 'booked'
  | 'completed'
  | 'cancelled';

export type BudgetTier = 'budget' | 'standard' | 'premium' | 'luxury';

export interface Trip {
  id: string;
  _id?: string;
  owner: string;
  title: string;
  destinationCity: string;
  destinationCountry?: string;
  latitude?: number;
  longitude?: number;
  startDate?: string;
  endDate?: string;
  totalDays: number;
  budgetTier: BudgetTier;
  allocatedBudgetAmount?: number;
  estimatedCost?: EstimatedCost;
  tripStatus: TripStatus;
  itinerary: DayPlan[];
  hotelRecommendations: HotelRecommendation[];
  decisionCheckpoints: DecisionCheckpoint[];
  createdAt: string;
  updatedAt: string;
}

export interface EstimatedCost {
  flights: number;
  accommodation: number;
  food: number;
  activities: number;
  localTransport: number;
  contingency: number;
  total: number;
}

export interface DayPlan {
  dayNumber: number;
  title?: string;
  summary?: string;
  dayStatus?: 'draft' | 'planned' | 'confirmed' | 'completed';
  activities: Activity[];
  weatherSnapshot?: WeatherSnapshot;
}

// Legacy alias
export type DayItinerary = DayPlan;

export interface Activity {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  locationName?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  estimatedCost: number;
  startTime?: string;
  endTime?: string;
  bookingRequired?: boolean;
  rating?: number;
  reviewCount?: number;
  notes?: string;
  bookingOptions?: BookingOption[];
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
  destinationCity: string;
  destinationCountry?: string;
  totalDays: number;
  budgetTier: BudgetTier;
  startDate?: string;
  endDate?: string;
  allocatedBudgetAmount?: number;
  title?: string;
  generateWithAi?: boolean;
}

export interface TripScore {
  score: number;
  dimensions: {
    budgetEfficiency: number;
    weatherSuitability: number;
    scheduleRealism: number;
    travelConvenience: number;
    activityBalance: number;
    preferenceAlignment: number;
  };
  weakAreas: string[];
}

// ===== Weather Types =====
export interface WeatherSnapshot {
  forecastDate?: string;
  temperatureCelsius?: number;
  feelsLikeCelsius?: number;
  humidity?: number;
  windSpeed?: number;
  precipitationChance?: number;
  weatherType?: string;
  advisoryMessage?: string;
  isOutdoorFriendly?: boolean;
  source?: string;
}

// Legacy alias
export type DayWeather = WeatherSnapshot;

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
  affectedDay: number;
  userDecision: 'accept_risk' | 'regenerate' | 'dismiss';
}

export interface RegenerateWeatherDayPayload {
  affectedDay: number;
}

// ===== Hotel Types =====
export interface HotelRecommendation {
  _id: string;
  name: string;
  tier?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  nightlyRateEstimate?: number;
  currency?: string;
  rating?: number;
  reviewCount?: number;
  bookingOptions?: BookingOption[];
}

// Legacy alias
export type Hotel = HotelRecommendation;

export interface BookingOption {
  providerName?: string;
  providerType?: string;
  bookingUrl?: string;
  priceEstimate?: number;
  currency?: string;
  availabilityStatus?: string;
}

export interface DecisionCheckpoint {
  checkpointType: string;
  message: string;
  triggeredAt?: string;
  userDecision?: string;
  affectedDay?: number;
}

// ===== AI Assistant Types =====
export type OptimizationGoal =
  | 'reduce cost'
  | 'luxury upgrade'
  | 'family friendly'
  | 'less walking'
  | 'food focused'
  | 'fewer transitions';

export type AlternativeReason =
  | 'bad weather'
  | 'attraction unavailable'
  | 'user preference change'
  | 'budget concern';

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  type?: 'text' | 'optimization' | 'conflict' | 'alternative' | 'score';
  data?: Record<string, unknown>;
  timestamp: string;
}

export interface OptimizationResult {
  optimizationGoal: string;
  suggestions: string[];
  score: TripScore;
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
