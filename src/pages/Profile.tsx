import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Save, Loader2, Camera } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { usersApi } from '@/api/users';
import { profileSchema, type ProfileFormValues } from '@/utils/validators';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { TRAVEL_STYLES, INTERESTS, FOOD_PREFERENCES } from '@/constants';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';
import { toast } from 'sonner';
import { useState } from 'react';

export default function Profile() {
  const { user, setUser } = useAuthStore();
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch, setValue, getValues } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.fullName || '',
      email: user?.email || '',
      travelStyle: user?.preferences?.travelStyle || '',
      dietaryPreferences: user?.preferences?.dietaryPreferences || [],
      activityLevel: 'moderate',
      interests: user?.preferences?.activityPreferences || [],
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setSaving(true);
    try {
      await usersApi.updatePreferences({
        travelStyle: data.travelStyle,
        dietaryPreferences: data.dietaryPreferences,
        activityPreferences: data.interests,
      });
      const updated = await usersApi.updateProfile({ fullName: data.name });
      setUser(updated);
      toast.success('Profile updated');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and travel preferences.</p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Avatar & Basic Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-4 font-semibold text-foreground">Personal Information</h3>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500 text-xl font-bold text-white">
                {user ? getInitials(user.fullName) : 'U'}
              </div>
              <button type="button" className="absolute -bottom-1 -right-1 rounded-full bg-background p-1 shadow-md border border-border">
                <Camera className="h-3 w-3 text-muted-foreground" />
              </button>
            </div>
            <div>
              <p className="font-medium text-foreground">{user?.fullName}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Full Name</label>
              <input {...register('name')} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
              {errors.name && <p className="mt-1 text-xs text-danger-500">{errors.name.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
              <input {...register('email')} disabled className="w-full rounded-xl border border-border bg-muted px-4 py-2.5 text-sm text-muted-foreground" />
            </div>
          </div>
        </motion.div>

        {/* Travel Preferences */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-4 font-semibold text-foreground">Travel Preferences</h3>
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Travel Style</label>
              <select {...register('travelStyle')} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none">
                <option value="">Select...</option>
                {TRAVEL_STYLES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Activity Level</label>
              <div className="grid grid-cols-3 gap-3">
                {(['low', 'moderate', 'high'] as const).map((level) => (
                  <label key={level} className={cn('cursor-pointer rounded-xl border-2 p-3 text-center text-sm font-medium transition-all',
                    watch('activityLevel') === level ? 'border-brand-500 bg-brand-500/10 text-brand-500' : 'border-border text-muted-foreground hover:border-brand-500/30')}>
                    <input type="radio" value={level} {...register('activityLevel')} className="hidden" />
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Interests</label>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((interest) => {
                  const selected = watch('interests')?.includes(interest);
                  return (
                    <button key={interest} type="button" onClick={() => {
                      const current = getValues('interests') || [];
                      setValue('interests', selected ? current.filter((i) => i !== interest) : [...current, interest]);
                    }} className={cn('rounded-full px-3 py-1.5 text-xs font-medium transition-all',
                      selected ? 'bg-brand-500 text-white' : 'bg-muted text-muted-foreground hover:bg-brand-500/10')}>
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Dietary Preferences</label>
              <div className="flex flex-wrap gap-2">
                {FOOD_PREFERENCES.map((pref) => {
                  const selected = watch('dietaryPreferences')?.includes(pref);
                  return (
                    <button key={pref} type="button" onClick={() => {
                      const current = getValues('dietaryPreferences') || [];
                      setValue('dietaryPreferences', selected ? current.filter((p) => p !== pref) : [...current, pref]);
                    }} className={cn('rounded-full px-3 py-1.5 text-xs font-medium transition-all',
                      selected ? 'bg-accent-500 text-white' : 'bg-muted text-muted-foreground hover:bg-accent-500/10')}>
                      {pref}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Theme */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-4 font-semibold text-foreground">Appearance</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Theme</p>
              <p className="text-xs text-muted-foreground">Choose your preferred theme</p>
            </div>
            <ThemeToggle />
          </div>
        </motion.div>

        <button type="submit" disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-500/25 disabled:opacity-60">
          {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Changes</>}
        </button>
      </form>
    </div>
  );
}
