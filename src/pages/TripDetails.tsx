import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Calendar, Users, Wallet, CloudSun, Hotel, Sparkles,
  Clock, ChevronDown, ChevronUp, ExternalLink, Star, AlertTriangle,
  RefreshCw, Edit3, Trash2, Plus, Brain, CheckCircle2, Plane,
  Flag, Compass, Building2, Activity,
} from 'lucide-react';
import { useState } from 'react';
import { useTrip } from '@/hooks/useTrips';
import { useWeather } from '@/hooks/useWeather';
import { useHotels } from '@/hooks/useHotels';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { cn } from '@/lib/utils';
import { formatDateRange, formatCurrency, formatDate, getTripDuration, getPercentage } from '@/utils/formatters';
import { TRIP_STAGES, WEATHER_ICONS } from '@/constants';
import type { DayItinerary, TripStatus } from '@/types';

const stageIcons: Record<string, React.ElementType> = {
  created: MapPin, ai_generated: Brain, weather_checked: CloudSun,
  hotels_ready: Building2, activities_ready: Compass, user_confirmed: CheckCircle2,
  optimized: Sparkles, active: Plane, completed: Flag,
};

export default function TripDetails() {
  const { tripId } = useParams<{ tripId: string }>();
  const { trip, isLoading } = useTrip(tripId!);
  const { weather } = useWeather(tripId!);
  const { hotels } = useHotels(tripId!);
  const [expandedDay, setExpandedDay] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<'itinerary' | 'hotels' | 'weather'>('itinerary');

  if (isLoading || !trip) return <PageLoader />;

  const stageIndex = TRIP_STAGES.findIndex((s) => s.key === trip.status);
  const duration = getTripDuration(trip.startDate, trip.endDate);
  const budgetPercent = getPercentage(trip.spentBudget, trip.totalBudget);

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
              <h1 className="font-display text-3xl font-bold md:text-4xl">{trip.destination}</h1>
              <p className="mt-1 text-brand-200">{trip.country}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-brand-200">
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{formatDateRange(trip.startDate, trip.endDate)}</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{duration} days</span>
                <span className="flex items-center gap-1.5"><Users className="h-4 w-4" />{trip.travelers} travelers</span>
                <span className="flex items-center gap-1.5"><Wallet className="h-4 w-4" />{formatCurrency(trip.totalBudget)}</span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium backdrop-blur-sm">
              <Activity className="h-3.5 w-3.5" />
              {TRIP_STAGES[stageIndex]?.label || trip.status}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Trip Progress Tracker — Flipkart/Amazon Style */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl border border-border bg-card p-4 md:p-6">
        <h3 className="mb-4 font-semibold text-foreground">Trip Progress</h3>
        <div className="overflow-x-auto pb-2">
          <div className="flex items-center" style={{ minWidth: '800px' }}>
            {TRIP_STAGES.map((stage, i) => {
              const isCompleted = i <= stageIndex;
              const isCurrent = i === stageIndex;
              const Icon = stageIcons[stage.key] || CheckCircle2;
              return (
                <div key={stage.key} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center">
                    <motion.div initial={false} animate={{ scale: isCurrent ? 1.1 : 1 }}
                      className={cn('relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all',
                        isCompleted ? 'border-brand-500 bg-brand-500 text-white' :
                        isCurrent ? 'border-brand-500 bg-brand-500/10 text-brand-500' :
                        'border-border bg-muted text-muted-foreground')}>
                      <Icon className="h-4 w-4" />
                      {isCurrent && (
                        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 rounded-full border-2 border-brand-500" />
                      )}
                    </motion.div>
                    <span className={cn('mt-2 whitespace-nowrap text-center text-xs font-medium',
                      isCompleted ? 'text-brand-500' : 'text-muted-foreground')}>{stage.label}</span>
                  </div>
                  {i < TRIP_STAGES.length - 1 && (
                    <div className="mx-1 h-0.5 flex-1">
                      <div className={cn('h-full rounded-full transition-all',
                        i < stageIndex ? 'bg-brand-500' : 'bg-border')} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Budget Used', value: `${budgetPercent}%`, sub: `${formatCurrency(trip.spentBudget)} of ${formatCurrency(trip.totalBudget)}`, color: budgetPercent > 80 ? 'text-danger-500' : 'text-brand-500' },
          { label: 'Trip Score', value: trip.score ? `${trip.score.overall}%` : '—', sub: 'Overall health', color: 'text-success-500' },
          { label: 'Activities', value: trip.itinerary?.reduce((acc: number, d: DayItinerary) => acc + (d.activities?.length || 0), 0) || 0, sub: `Across ${duration} days`, color: 'text-accent-500' },
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
          {trip.itinerary && trip.itinerary.length > 0 ? trip.itinerary.map((day: DayItinerary, i: number) => {
            const isExpanded = expandedDay === i;
            const dayWeather = weather.find((w) => w.date === day.date);
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-border bg-card overflow-hidden">
                <button onClick={() => setExpandedDay(isExpanded ? null : i)}
                  className="flex w-full items-center justify-between p-4 text-left md:p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 font-bold text-brand-500 text-sm">D{day.day}</div>
                    <div>
                      <h4 className="font-semibold text-foreground">{day.title || `Day ${day.day}`}</h4>
                      <p className="text-sm text-muted-foreground">{formatDate(day.date, 'EEEE, MMM dd')} · {day.activities?.length || 0} activities</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {dayWeather && <span className="text-lg">{WEATHER_ICONS[dayWeather.condition] || '☀️'}</span>}
                    {isExpanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                  </div>
                </button>
                {isExpanded && day.activities && (
                  <div className="border-t border-border px-4 py-4 md:px-5">
                    {dayWeather?.impactsActivities && (
                      <div className="mb-4 flex items-center gap-2 rounded-xl bg-warning-50 dark:bg-warning-500/10 px-4 py-3 text-sm">
                        <AlertTriangle className="h-4 w-4 flex-shrink-0 text-warning-600" />
                        <span className="text-warning-600 dark:text-warning-500">{dayWeather.advisory || 'Weather may impact planned activities'}</span>
                        <button className="ml-auto flex items-center gap-1 rounded-lg bg-warning-500 px-3 py-1 text-xs font-medium text-white hover:bg-warning-600">
                          <RefreshCw className="h-3 w-3" /> Regenerate
                        </button>
                      </div>
                    )}
                    <div className="relative space-y-4 pl-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                      {day.activities.map((activity) => (
                        <div key={activity.id} className="relative">
                          <div className="absolute -left-6 top-1.5 h-3 w-3 rounded-full border-2 border-brand-500 bg-background" />
                          <div className="rounded-xl border border-border/50 bg-muted/30 p-4 transition-all hover:border-brand-500/30">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="mb-1 flex items-center gap-2">
                                  <span className="text-xs font-medium text-brand-500">{activity.time}</span>
                                  <span className="text-xs text-muted-foreground">· {activity.duration}</span>
                                </div>
                                <h5 className="font-medium text-foreground">{activity.name}</h5>
                                <p className="mt-1 text-sm text-muted-foreground">{activity.description}</p>
                                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{activity.location}</span>
                                  <span className="rounded-full bg-brand-500/10 px-2 py-0.5 text-brand-500">{activity.category}</span>
                                  {activity.cost > 0 && <span className="font-medium text-foreground">{formatCurrency(activity.cost)}</span>}
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {activity.bookingUrl && (
                                  <a href={activity.bookingUrl} target="_blank" rel="noopener noreferrer"
                                    className="rounded-lg bg-brand-500 p-2 text-white transition-all hover:bg-brand-600">
                                    <ExternalLink className="h-3.5 w-3.5" />
                                  </a>
                                )}
                                <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><Edit3 className="h-3.5 w-3.5" /></button>
                                <button className="rounded-lg p-2 text-muted-foreground hover:bg-danger-50 hover:text-danger-500 dark:hover:bg-danger-500/10"><Trash2 className="h-3.5 w-3.5" /></button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="mt-4 flex items-center gap-2 rounded-xl border border-dashed border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-brand-500 hover:text-brand-500">
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
            <motion.div key={hotel.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border bg-card overflow-hidden transition-all hover:shadow-card-hover">
              <div className="h-40 bg-gradient-to-br from-brand-400 to-brand-600" />
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-foreground">{hotel.name}</h4>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex items-center gap-0.5">{Array.from({ length: hotel.stars }).map((_, j) => <Star key={j} className="h-3 w-3 fill-accent-500 text-accent-500" />)}</div>
                      <span className="text-xs text-muted-foreground">({hotel.reviewCount} reviews)</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">{formatCurrency(hotel.pricePerNight)}</p>
                    <p className="text-xs text-muted-foreground">/night</p>
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{hotel.description}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {hotel.amenities?.slice(0, 4).map((a) => <span key={a} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{a}</span>)}
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

      {/* Weather Tab */}
      {activeTab === 'weather' && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {weather.length > 0 ? weather.map((w) => (
            <motion.div key={w.date} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={cn('rounded-2xl border bg-card p-5 transition-all', w.impactsActivities ? 'border-warning-500/50' : 'border-border')}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{formatDate(w.date, 'EEE, MMM dd')}</p>
                  <p className="text-xs text-muted-foreground capitalize">{w.condition.replace('_', ' ')}</p>
                </div>
                <span className="text-3xl">{WEATHER_ICONS[w.condition] || '☀️'}</span>
              </div>
              <div className="mt-3 flex items-center gap-4 text-sm">
                <span className="font-semibold text-foreground">{w.temperature.high}°</span>
                <span className="text-muted-foreground">{w.temperature.low}°</span>
                <span className="text-xs text-muted-foreground">💧 {w.humidity}%</span>
              </div>
              {w.advisory && (
                <div className="mt-3 rounded-lg bg-warning-50 dark:bg-warning-500/10 px-3 py-2 text-xs text-warning-600 dark:text-warning-500">
                  <AlertTriangle className="mb-1 inline h-3 w-3" /> {w.advisory}
                </div>
              )}
            </motion.div>
          )) : (
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
