import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, PlusCircle, Calendar, Wallet, ChevronRight, Trash2 } from 'lucide-react';
import { useTrips } from '@/hooks/useTrips';
import { EmptyState } from '@/components/common/EmptyState';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { cn } from '@/lib/utils';
import { formatDateRange, formatCurrency, getDaysUntil } from '@/utils/formatters';

export default function Trips() {
  const { trips, isLoading, deleteTrip } = useTrips();

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">My Trips</h1>
          <p className="text-sm text-muted-foreground">{trips.length} trip{trips.length !== 1 ? 's' : ''} planned</p>
        </div>
        <Link to="/trips/create" className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 hover:bg-brand-600">
          <PlusCircle className="h-4 w-4" /> New Trip
        </Link>
      </div>

      {trips.length === 0 ? (
        <EmptyState icon={<Map className="h-8 w-8" />} title="No trips yet" description="Create your first AI-powered trip and start exploring." action={{ label: 'Create Trip', onClick: () => window.location.href = '/trips/create' }} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip, i) => {
            const daysUntil = trip.startDate ? getDaysUntil(trip.startDate) : 0;
            return (
              <motion.div key={trip._id ?? trip.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="group relative rounded-2xl border border-border bg-card overflow-hidden transition-all hover:shadow-card-hover">
                {/* Cover gradient */}
                <div className="h-32 bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 relative">
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-3 left-4">
                    <h3 className="text-lg font-bold text-white">{trip.title || trip.destinationCity}</h3>
                    <p className="text-sm text-white/80">{trip.destinationCountry}</p>
                  </div>
                  <button onClick={(e) => { e.preventDefault(); deleteTrip(trip._id ?? trip.id ?? ''); }}
                    className="absolute right-3 top-3 rounded-lg bg-black/30 p-1.5 text-white/70 opacity-0 backdrop-blur-sm transition-all hover:bg-danger-500 hover:text-white group-hover:opacity-100">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <Link to={`/trips/${trip._id ?? trip.id}`} className="block p-4">
                  <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{trip.startDate && trip.endDate ? formatDateRange(trip.startDate, trip.endDate) : '—'}</span>
                    <span className="flex items-center gap-1"><Wallet className="h-3 w-3" />{formatCurrency(trip.allocatedBudgetAmount ?? 0)}</span>
                  </div>

                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className={cn('rounded-full px-2 py-0.5 font-medium',
                      trip.tripStatus === 'booked' ? 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500' :
                      trip.tripStatus === 'completed' ? 'bg-muted text-muted-foreground' :
                      'bg-brand-500/10 text-brand-500'
                    )}>{trip.tripStatus}</span>
                    {daysUntil > 0 && <span className="text-muted-foreground">{daysUntil}d away</span>}
                  </div>

                  <div className="mt-1 text-xs text-muted-foreground">
                    {trip.totalDays} day{trip.totalDays !== 1 ? 's' : ''} · {trip.budgetTier}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
