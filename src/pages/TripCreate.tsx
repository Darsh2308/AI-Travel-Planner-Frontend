import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  MapPin, Calendar, Users, ArrowRight, ArrowLeft, Loader2,
  Sparkles, CheckCircle2, DollarSign, Heart, Utensils, Accessibility,
  Brain, Compass, Plane,
} from 'lucide-react';
import { useTrips } from '@/hooks/useTrips';
import { tripStep1Schema, tripStep2Schema, type TripStep1Values, type TripStep2Values } from '@/utils/validators';
import { TRAVEL_STYLES, INTERESTS, FOOD_PREFERENCES } from '@/constants';
import { cn } from '@/lib/utils';

const stepLabels = ['Destination', 'Preferences', 'Review', 'Creating'];

function computeTotalDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff + 1);
}

export default function TripCreate() {
  const navigate = useNavigate();
  const { createTrip, isCreating } = useTrips();
  const [step, setStep] = useState(0);
  const [step1Data, setStep1Data] = useState<TripStep1Values | null>(null);
  const [step2Data, setStep2Data] = useState<TripStep2Values | null>(null);
  const [generatingPhase, setGeneratingPhase] = useState(0);

  const form1 = useForm<TripStep1Values>({ resolver: zodResolver(tripStep1Schema), defaultValues: { travelers: 1 } });
  const form2 = useForm<TripStep2Values>({ resolver: zodResolver(tripStep2Schema), defaultValues: { budgetTier: 'standard', interests: [], foodPreferences: [] } });

  const onStep1 = (data: TripStep1Values) => { setStep1Data(data); setStep(1); };
  const onStep2 = (data: TripStep2Values) => { setStep2Data(data); setStep(2); };

  const onSubmit = async () => {
    if (!step1Data || !step2Data) return;
    setStep(3);
    const phases = ['Analyzing destination...', 'Crafting itinerary...', 'Checking weather...', 'Finding hotels...', 'Optimizing plan...'];
    for (let i = 0; i < phases.length; i++) {
      setGeneratingPhase(i);
      await new Promise((r) => setTimeout(r, 1500));
    }
    try {
      const totalDays = computeTotalDays(step1Data.startDate, step1Data.endDate);
      const trip = await createTrip({
        destinationCity: step1Data.destinationCity,
        destinationCountry: step1Data.destinationCountry,
        startDate: step1Data.startDate,
        endDate: step1Data.endDate,
        totalDays,
        budgetTier: step2Data.budgetTier,
        generateWithAi: true,
      });
      navigate(`/trips/${trip._id ?? trip.id}`);
    } catch {
      setStep(2);
    }
  };

  const phases = ['Analyzing destination...', 'Crafting itinerary...', 'Checking weather...', 'Finding hotels...', 'Optimizing plan...'];

  return (
    <div className="mx-auto max-w-3xl">
      {/* Progress Steps */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {stepLabels.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={cn('flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all',
              i <= step ? 'bg-brand-500 text-white' : 'bg-muted text-muted-foreground'
            )}>{i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}</div>
            <span className="hidden text-sm font-medium text-muted-foreground sm:block">{label}</span>
            {i < 3 && <div className={cn('hidden h-px w-8 sm:block', i < step ? 'bg-brand-500' : 'bg-border')} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Destination */}
        {step === 0 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10"><MapPin className="h-6 w-6 text-brand-500" /></div>
              <h2 className="font-display text-2xl font-bold text-foreground">Where are you going?</h2>
              <p className="text-sm text-muted-foreground">Tell us about your destination and travel dates.</p>
            </div>
            <form onSubmit={form1.handleSubmit(onStep1)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Destination City</label>
                  <input {...form1.register('destinationCity')} placeholder="e.g., Paris" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
                  {form1.formState.errors.destinationCity && <p className="mt-1 text-xs text-danger-500">{form1.formState.errors.destinationCity.message}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Country</label>
                  <input {...form1.register('destinationCountry')} placeholder="e.g., France" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
                  {form1.formState.errors.destinationCountry && <p className="mt-1 text-xs text-danger-500">{form1.formState.errors.destinationCountry.message}</p>}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Start Date</label>
                  <input type="date" {...form1.register('startDate')} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">End Date</label>
                  <input type="date" {...form1.register('endDate')} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Number of Travelers</label>
                <input type="number" min={1} max={20} {...form1.register('travelers', { valueAsNumber: true })} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
              </div>
              <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white hover:bg-brand-600">
                Next <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}

        {/* Step 2: Preferences */}
        {step === 1 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-500/10"><Heart className="h-6 w-6 text-accent-500" /></div>
              <h2 className="font-display text-2xl font-bold text-foreground">Your Preferences</h2>
              <p className="text-sm text-muted-foreground">Help our AI craft the perfect experience for you.</p>
            </div>
            <form onSubmit={form2.handleSubmit(onStep2)} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Budget Tier</label>
                <div className="grid grid-cols-4 gap-3">
                  {(['budget', 'standard', 'premium', 'luxury'] as const).map((tier) => (
                    <label key={tier} className={cn('cursor-pointer rounded-xl border-2 p-3 text-center text-sm font-medium transition-all',
                      form2.watch('budgetTier') === tier ? 'border-brand-500 bg-brand-500/10 text-brand-500' : 'border-border text-muted-foreground hover:border-brand-500/30')}>
                      <input type="radio" value={tier} {...form2.register('budgetTier')} className="hidden" />
                      <DollarSign className="mx-auto mb-1 h-5 w-5" />
                      {tier.charAt(0).toUpperCase() + tier.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Travel Style</label>
                <div className="flex flex-wrap gap-2">
                  {TRAVEL_STYLES.map((style) => {
                    const selected = form2.watch('travelStyle') === style;
                    return (
                      <button key={style} type="button" onClick={() => form2.setValue('travelStyle', selected ? '' : style)}
                        className={cn('rounded-full px-3 py-1.5 text-xs font-medium transition-all',
                          selected ? 'bg-brand-500 text-white' : 'bg-muted text-muted-foreground hover:bg-brand-500/10 hover:text-brand-500')}>
                        {style}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Interests</label>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map((interest) => {
                    const selected = form2.watch('interests')?.includes(interest);
                    return (
                      <button key={interest} type="button" onClick={() => {
                        const current = form2.getValues('interests') || [];
                        form2.setValue('interests', selected ? current.filter((i) => i !== interest) : [...current, interest]);
                      }} className={cn('rounded-full px-3 py-1.5 text-xs font-medium transition-all',
                        selected ? 'bg-brand-500 text-white' : 'bg-muted text-muted-foreground hover:bg-brand-500/10 hover:text-brand-500')}>
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Food Preferences</label>
                <div className="flex flex-wrap gap-2">
                  {FOOD_PREFERENCES.map((pref) => {
                    const selected = form2.watch('foodPreferences')?.includes(pref);
                    return (
                      <button key={pref} type="button" onClick={() => {
                        const current = form2.getValues('foodPreferences') || [];
                        form2.setValue('foodPreferences', selected ? current.filter((p) => p !== pref) : [...current, pref]);
                      }} className={cn('rounded-full px-3 py-1.5 text-xs font-medium transition-all',
                        selected ? 'bg-accent-500 text-white' : 'bg-muted text-muted-foreground hover:bg-accent-500/10 hover:text-accent-500')}>
                        {pref}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(0)} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-medium text-foreground hover:bg-muted">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button type="submit" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white hover:bg-brand-600">
                  Next <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Step 3: Review */}
        {step === 2 && step1Data && step2Data && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-success-50 dark:bg-success-500/10"><CheckCircle2 className="h-6 w-6 text-success-500" /></div>
              <h2 className="font-display text-2xl font-bold text-foreground">Review Your Trip</h2>
              <p className="text-sm text-muted-foreground">Make sure everything looks good before AI creates your plan.</p>
            </div>
            <div className="space-y-4 rounded-xl bg-muted/50 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: 'Destination', value: `${step1Data.destinationCity}, ${step1Data.destinationCountry}` },
                  { label: 'Dates', value: `${step1Data.startDate} → ${step1Data.endDate}` },
                  { label: 'Total Days', value: computeTotalDays(step1Data.startDate, step1Data.endDate).toString() },
                  { label: 'Travelers', value: step1Data.travelers.toString() },
                  { label: 'Budget Tier', value: step2Data.budgetTier },
                  { label: 'Travel Style', value: step2Data.travelStyle },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
                    <p className="font-medium text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
              {step2Data.interests.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">Interests</p>
                  <div className="flex flex-wrap gap-1">{step2Data.interests.map((i) => <span key={i} className="rounded-full bg-brand-500/10 px-2 py-0.5 text-xs text-brand-500">{i}</span>)}</div>
                </div>
              )}
            </div>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-medium text-foreground hover:bg-muted">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button onClick={onSubmit} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white hover:bg-brand-600 shadow-lg shadow-brand-500/25">
                <Sparkles className="h-4 w-4" /> Generate with AI
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 4: AI Generating */}
        {step === 3 && (
          <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-border bg-card p-8 md:p-12 text-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full gradient-brand shadow-2xl shadow-brand-500/30">
              <Brain className="h-10 w-10 text-white" />
            </motion.div>
            <h2 className="mb-2 font-display text-2xl font-bold text-foreground">AI is crafting your trip</h2>
            <p className="mb-8 text-muted-foreground">This usually takes 15-30 seconds. Please wait...</p>
            <div className="mx-auto max-w-sm space-y-3">
              {phases.map((phase, i) => (
                <motion.div key={phase} initial={{ opacity: 0, x: -10 }} animate={{ opacity: i <= generatingPhase ? 1 : 0.3, x: 0 }} transition={{ delay: i * 0.3 }}
                  className="flex items-center gap-3">
                  {i < generatingPhase ? <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-success-500" /> :
                   i === generatingPhase ? <Loader2 className="h-5 w-5 flex-shrink-0 animate-spin text-brand-500" /> :
                   <div className="h-5 w-5 flex-shrink-0 rounded-full border-2 border-border" />}
                  <span className={cn('text-sm', i <= generatingPhase ? 'font-medium text-foreground' : 'text-muted-foreground')}>{phase}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
