import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Calendar, Wallet, CloudSun, Hotel, Sparkles,
  Clock, ChevronDown, ChevronUp, Star, AlertTriangle,
  RefreshCw, Edit3, Trash2, Plus, Brain, CheckCircle2,
  Flag, Activity, X, Loader2,
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTrip } from '@/hooks/useTrips';
import { useWeather } from '@/hooks/useWeather';
import { useHotels } from '@/hooks/useHotels';
import { useActivities } from '@/hooks/useActivities';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { cn } from '@/lib/utils';
import { formatDateRange, formatCurrency, getTripDuration } from '@/utils/formatters';
import { WEATHER_ICONS, ACTIVITY_CATEGORIES } from '@/constants';
import type { Activity as ActivityType, DayPlan } from '@/types';

type ActivityFormValues = {
  title: string;
  description: string;
  category: string;
  locationName: string;
  estimatedCost: number;
  startTime: string;
  endTime: string;
};

type ActivityModalState =
  | { mode: 'add'; dayNumber: number }
  | { mode: 'edit'; dayNumber: number; activity: ActivityType }
  | null;

const stageIcons: Record<string, React.ElementType> = {
  draft: MapPin, planned: Brain, weather_review_pending: CloudSun,
  booked: CheckCircle2, completed: Flag, cancelled: Trash2,
};

export default function TripDetails() {
  const { tripId } = useParams<{ tripId: string }>();
  const { trip, isLoading } = useTrip(tripId!);
  const { weather } = useWeather(tripId!);
  const { hotels } = useHotels(tripId!);
  const { createActivity, updateActivity, deleteActivity, isCreating, isUpdating, isDeleting } = useActivities(tripId!);
  const [expandedDay, setExpandedDay] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<'itinerary' | 'hotels' | 'weather'>('itinerary');
  const [modal, setModal] = useState<ActivityModalState>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ dayNumber: number; activityId: string; title: string } | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ActivityFormValues>();

  const openAdd = (dayNumber: number) => {
    reset({ title: '', description: '', category: '', locationName: '', estimatedCost: 0, startTime: '', endTime: '' });
    setModal({ mode: 'add', dayNumber });
  };

  const openEdit = (dayNumber: number, activity: ActivityType) => {
    reset({
      title: activity.title,
      description: activity.description ?? '',
      category: activity.category ?? '',
      locationName: activity.locationName ?? '',
      estimatedCost: activity.estimatedCost ?? 0,
      startTime: activity.startTime ?? '',
      endTime: activity.endTime ?? '',
    });
    setModal({ mode: 'edit', dayNumber, activity });
  };

  const onSubmit = async (values: ActivityFormValues) => {
    if (!modal) return;
    if (modal.mode === 'add') {
      await createActivity({ dayNumber: modal.dayNumber, payload: values });
    } else {
      await updateActivity({ dayNumber: modal.dayNumber, activityId: modal.activity._id, payload: values });
    }
    setModal(null);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    await deleteActivity({ dayNumber: deleteConfirm.dayNumber, activityId: deleteConfirm.activityId });
    setDeleteConfirm(null);
  };

  if (isLoading || !trip) return <PageLoader />;

  const duration = getTripDuration(trip.startDate, trip.endDate) || trip.totalDays;
  const totalEstimated = trip.estimatedCost?.total ?? 0;
  const allocated = trip.allocatedBudgetAmount ?? 0;
  const totalActivities = trip.itinerary?.reduce((acc, d) => acc + (d.activities?.length || 0), 0) ?? 0;

  return (
    <div className="space-y-6">
      {/* Trip Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 p-6 text-white md:p-8">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-accent-500/20 blur-3xl" />
        </div>
        <div className="relative">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold md:text-4xl">{trip.title || trip.destinationCity}</h1>
              <p className="mt-1 text-brand-200">{trip.destinationCity}{trip.destinationCountry ? `, ${trip.destinationCountry}` : ''}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-brand-200">
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{formatDateRange(trip.startDate, trip.endDate)}</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{duration} days</span>
                <span className="flex items-center gap-1.5"><Wallet className="h-4 w-4" />{formatCurrency(allocated)}</span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium backdrop-blur-sm">
              <Activity className="h-3.5 w-3.5" />
              {trip.tripStatus}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Est. Total Cost', value: formatCurrency(totalEstimated), sub: `${trip.budgetTier} tier`, color: 'text-brand-500' },
          { label: 'Budget Allocated', value: formatCurrency(allocated), sub: 'Available budget', color: 'text-success-500' },
          { label: 'Activities', value: totalActivities, sub: `Across ${duration} days`, color: 'text-accent-500' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }}
            className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className={cn('mt-1 text-2xl font-bold', s.color)}>{s.value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 rounded-xl bg-muted/50 p-1">
        {(['itinerary', 'hotels', 'weather'] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn('flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all',
              activeTab === tab ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Itinerary Tab */}
      {activeTab === 'itinerary' && (
        <div className="space-y-4">
          {trip.itinerary && trip.itinerary.length > 0 ? trip.itinerary.map((day: DayPlan, i: number) => {
            const isExpanded = expandedDay === i;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-border bg-card overflow-hidden">
                <button onClick={() => setExpandedDay(isExpanded ? null : i)}
                  className="flex w-full items-center justify-between p-4 text-left md:p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 font-bold text-brand-500 text-sm">D{day.dayNumber}</div>
                    <div>
                      <h4 className="font-semibold text-foreground">{day.title || `Day ${day.dayNumber}`}</h4>
                      <p className="text-sm text-muted-foreground">{day.activities?.length || 0} activities</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {day.weatherSnapshot?.weatherType && (
                      <span className="text-lg">{WEATHER_ICONS[day.weatherSnapshot.weatherType] || '☀️'}</span>
                    )}
                    {isExpanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                  </div>
                </button>
                {isExpanded && day.activities && (
                  <div className="border-t border-border px-4 py-4 md:px-5">
                    {day.weatherSnapshot && !day.weatherSnapshot.isOutdoorFriendly && (
                      <div className="mb-4 flex items-center gap-2 rounded-xl bg-warning-50 dark:bg-warning-500/10 px-4 py-3 text-sm">
                        <AlertTriangle className="h-4 w-4 flex-shrink-0 text-warning-600" />
                        <span className="text-warning-600 dark:text-warning-500">{day.weatherSnapshot.advisoryMessage || 'Weather may impact planned activities'}</span>
                        <button className="ml-auto flex items-center gap-1 rounded-lg bg-warning-500 px-3 py-1 text-xs font-medium text-white hover:bg-warning-600">
                          <RefreshCw className="h-3 w-3" /> Regenerate
                        </button>
                      </div>
                    )}
                    <div className="relative space-y-4 pl-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                      {day.activities.map((activity) => (
                        <div key={activity._id} className="relative">
                          <div className="absolute -left-6 top-1.5 h-3 w-3 rounded-full border-2 border-brand-500 bg-background" />
                          <div className="rounded-xl border border-border/50 bg-muted/30 p-4 transition-all hover:border-brand-500/30">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="mb-1 flex items-center gap-2">
                                  {activity.startTime && <span className="text-xs font-medium text-brand-500">{activity.startTime}</span>}
                                  {activity.endTime && <span className="text-xs text-muted-foreground">→ {activity.endTime}</span>}
                                </div>
                                <h5 className="font-medium text-foreground">{activity.title}</h5>
                                <p className="mt-1 text-sm text-muted-foreground">{activity.description}</p>
                                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                  {activity.locationName && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{activity.locationName}</span>}
                                  {activity.category && <span className="rounded-full bg-brand-500/10 px-2 py-0.5 text-brand-500">{activity.category}</span>}
                                  {activity.estimatedCost > 0 && <span className="font-medium text-foreground">{formatCurrency(activity.estimatedCost)}</span>}
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <button onClick={() => openEdit(day.dayNumber, activity)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><Edit3 className="h-3.5 w-3.5" /></button>
                                <button onClick={() => setDeleteConfirm({ dayNumber: day.dayNumber, activityId: activity._id, title: activity.title })} className="rounded-lg p-2 text-muted-foreground hover:bg-danger-50 hover:text-danger-500 dark:hover:bg-danger-500/10"><Trash2 className="h-3.5 w-3.5" /></button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => openAdd(day.dayNumber)} className="mt-4 flex items-center gap-2 rounded-xl border border-dashed border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-brand-500 hover:text-brand-500">
                      <Plus className="h-4 w-4" /> Add Activity
                    </button>
                  </div>
                )}
              </motion.div>
            );
          }) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
              <Sparkles className="mb-4 h-8 w-8 text-brand-500" />
              <p className="font-medium text-foreground">Itinerary not yet generated</p>
              <p className="text-sm text-muted-foreground">AI is still working on your plan...</p>
            </div>
          )}
        </div>
      )}

      {/* Hotels Tab */}
      {activeTab === 'hotels' && (
        <div className="grid gap-4 sm:grid-cols-2">
          {hotels.length > 0 ? hotels.map((hotel) => (
            <motion.div key={hotel._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border bg-card overflow-hidden transition-all hover:shadow-card-hover">
              <div className="h-40 bg-gradient-to-br from-brand-400 to-brand-600" />
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-foreground">{hotel.name}</h4>
                    <div className="mt-1 flex items-center gap-2">
                      {hotel.rating && (
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: Math.round(hotel.rating) }).map((_, j) => (
                            <Star key={j} className="h-3 w-3 fill-accent-500 text-accent-500" />
                          ))}
                        </div>
                      )}
                      {hotel.reviewCount ? <span className="text-xs text-muted-foreground">({hotel.reviewCount} reviews)</span> : null}
                    </div>
                  </div>
                  <div className="text-right">
                    {hotel.nightlyRateEstimate ? (
                      <>
                        <p className="text-lg font-bold text-foreground">{formatCurrency(hotel.nightlyRateEstimate)}</p>
                        <p className="text-xs text-muted-foreground">/night</p>
                      </>
                    ) : null}
                  </div>
                </div>
                {hotel.address && <p className="mt-2 text-sm text-muted-foreground">{hotel.address}</p>}
                <div className="mt-3 flex flex-wrap gap-1">
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{hotel.tier || 'Standard'}</span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{hotel.currency || 'USD'}</span>
                </div>
                <button className="mt-4 w-full rounded-xl bg-brand-500 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-600">
                  View Booking Options
                </button>
              </div>
            </motion.div>
          )) : (
            <div className="col-span-2 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
              <Hotel className="mb-4 h-8 w-8 text-brand-500" />
              <p className="font-medium text-foreground">No hotels available yet</p>
              <p className="text-sm text-muted-foreground">Hotels will appear once your plan is generated</p>
            </div>
          )}
        </div>
      )}

      {/* Activity Add/Edit Modal */}
      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModal(null)} />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', modal.mode === 'add' ? 'bg-brand-500/10' : 'bg-accent-500/10')}>
                    {modal.mode === 'add'
                      ? <Plus className={cn('h-4 w-4 text-brand-500')} />
                      : <Edit3 className="h-4 w-4 text-accent-500" />}
                  </div>
                  <h3 className="font-semibold text-foreground">{modal.mode === 'add' ? 'Add Activity' : 'Edit Activity'}</h3>
                </div>
                <button onClick={() => setModal(null)}
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4 px-6 py-5">
                  {/* Title */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Title <span className="text-danger-500">*</span></label>
                    <input
                      {...register('title', { required: 'Title is required' })}
                      placeholder="e.g. Visit Brandenburg Gate"
                      className={cn(
                        'w-full rounded-xl border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:outline-none focus:ring-2',
                        errors.title ? 'border-danger-500 focus:ring-danger-500/20' : 'border-border focus:border-brand-500 focus:ring-brand-500/20'
                      )}
                    />
                    {errors.title && <p className="mt-1 text-xs text-danger-500">{errors.title.message}</p>}
                  </div>

                  {/* Time row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Start Time</label>
                      <input type="time" {...register('startTime')}
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">End Time</label>
                      <input type="time" {...register('endTime')}
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
                    </div>
                  </div>

                  {/* Category + Cost row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Category</label>
                      <select {...register('category')}
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20">
                        <option value="">Select...</option>
                        {ACTIVITY_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Est. Cost ($)</label>
                      <input type="number" min="0" step="0.01" {...register('estimatedCost', { valueAsNumber: true })}
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input {...register('locationName')} placeholder="e.g. Pariser Platz, Berlin"
                        className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Description</label>
                    <textarea rows={2} {...register('description')} placeholder="Brief notes about this activity..."
                      className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 border-t border-border px-6 py-4">
                  <button type="button" onClick={() => setModal(null)}
                    className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    Cancel
                  </button>
                  <button type="submit" disabled={isCreating || isUpdating}
                    className={cn(
                      'flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition-all disabled:opacity-60',
                      modal.mode === 'add'
                        ? 'bg-brand-500 hover:bg-brand-600 shadow-lg shadow-brand-500/25'
                        : 'bg-accent-500 hover:bg-accent-600 shadow-lg shadow-accent-500/25'
                    )}>
                    {(isCreating || isUpdating) ? <Loader2 className="h-4 w-4 animate-spin" /> : modal.mode === 'add' ? <Plus className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                    {modal.mode === 'add' ? 'Add Activity' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            >
              <div className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-danger-500/10">
                  <Trash2 className="h-5 w-5 text-danger-500" />
                </div>
                <h3 className="mb-1 text-lg font-semibold text-foreground">Delete Activity</h3>
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to remove <span className="font-medium text-foreground">"{deleteConfirm.title}"</span>? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3 border-t border-border px-6 py-4">
                <button onClick={() => setDeleteConfirm(null)}
                  className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                  Cancel
                </button>
                <button onClick={confirmDelete} disabled={isDeleting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-danger-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-danger-500/25 transition-all hover:bg-danger-600 disabled:opacity-60">
                  {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Weather Tab */}
      {activeTab === 'weather' && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {trip.itinerary && trip.itinerary.length > 0 ? trip.itinerary.map((day, i) => {
            const snap = day.weatherSnapshot;
            if (!snap?.weatherType) return null;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={cn('rounded-2xl border bg-card p-5 transition-all', !snap.isOutdoorFriendly ? 'border-warning-500/50' : 'border-border')}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Day {day.dayNumber}</p>
                    <p className="text-xs text-muted-foreground capitalize">{snap.weatherType}</p>
                  </div>
                  <span className="text-3xl">{WEATHER_ICONS[snap.weatherType] || '☀️'}</span>
                </div>
                <div className="mt-3 flex items-center gap-4 text-sm">
                  {snap.temperatureCelsius && <span className="font-semibold text-foreground">{snap.temperatureCelsius}°C</span>}
                  {snap.humidity && <span className="text-xs text-muted-foreground">💧 {snap.humidity}%</span>}
                  {snap.precipitationChance ? <span className="text-xs text-muted-foreground">🌧 {snap.precipitationChance}%</span> : null}
                </div>
                {snap.advisoryMessage && (
                  <div className="mt-3 rounded-lg bg-warning-50 dark:bg-warning-500/10 px-3 py-2 text-xs text-warning-600 dark:text-warning-500">
                    <AlertTriangle className="mb-1 inline h-3 w-3" /> {snap.advisoryMessage}
                  </div>
                )}
              </motion.div>
            );
          }) : (
            <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
              <CloudSun className="mb-4 h-8 w-8 text-brand-500" />
              <p className="font-medium text-foreground">Weather data not available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
