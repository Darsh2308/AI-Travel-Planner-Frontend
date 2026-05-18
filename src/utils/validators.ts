import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val, 'You must accept the terms'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const tripStep1Schema = z.object({
  destinationCity: z.string().min(2, 'Destination is required'),
  destinationCountry: z.string().min(2, 'Country is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  travelers: z.number().min(1, 'At least 1 traveler required').max(20),
});

export const tripStep2Schema = z.object({
  budgetTier: z.enum(['budget', 'standard', 'premium', 'luxury']),
  travelStyle: z.string().min(1, 'Please select a travel style'),
  interests: z.array(z.string()).min(1, 'Select at least one interest'),
  foodPreferences: z.array(z.string()),
  mobilityPreferences: z.string().optional(),
});

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  travelStyle: z.string().optional(),
  dietaryPreferences: z.array(z.string()).optional(),
  activityLevel: z.enum(['low', 'moderate', 'high']).optional(),
  interests: z.array(z.string()).optional(),
});

export const budgetSchema = z.object({
  totalBudget: z.number().min(100, 'Minimum budget is $100'),
  currency: z.string().default('USD'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type TripStep1Values = z.infer<typeof tripStep1Schema>;
export type TripStep2Values = z.infer<typeof tripStep2Schema>;
export type ProfileFormValues = z.infer<typeof profileSchema>;
export type BudgetFormValues = z.infer<typeof budgetSchema>;
