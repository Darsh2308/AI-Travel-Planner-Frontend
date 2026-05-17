import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Map, Wallet, TrendingUp, Sparkles, PlusCircle, ArrowRight,
  CloudSun, AlertTriangle, Calendar, Clock, ChevronRight, Activity,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { useAuthStore } from '@/store/authStore';
import { useTrips } from '@/hooks/useTrips';
import { useBudget } from '@/hooks/useBudget';
import { cn } from '@/lib/utils';
import { formatCurrency, formatDateRange, getDaysUntil } from '@/utils/formatters';
import { TRIP_STAGES } from '@/constants';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const budgetChartData = [
  { name: 'Hotels', value: 35, color: '#6366f1' },
  { name: 'Activities', value: 25, color: '#f59e0b' },
  { name: 'Food', value: 20, color: '#10b981' },
  { name: 'Transport', value: 15, color: '#8b5cf6' },
  { name: 'Other', value: 5, color: '#64748b' },
];

const trendData = [
  { month: 'Jan', trips: 2 }, { month: 'Feb', trips: 1 }, { month: 'Mar', trips: 3 },
  { month: 'Apr', trips: 2 }, { month: 'May', trips: 4 }, { month: 'Jun', trips: 3 },
];

export default function Dashboard() {
  const { user } = useAuthStore();
  const { trips, isLoading } = useTrips();
  const { budget } = useBudget();

  const activeTrips = trips.filter((t) => ['active', 'user_confirmed', 'optimized'].includes(t.status));
  const upcomingTrips = trips.filter((t) => ['created', 'ai_generated', 'weather_checked', 'hotels_ready', 'activities_ready'].includes(t.status));

  const stats = [
    { label: 'Total Trips', value: trips.length || 0, icon: Map, color: 'text-brand-500', bg: 'bg-brand-500/10' },
    { label: 'Active Trips', value: activeTrips.length, icon: Activity, color: 'text-success-500', bg: 'bg-success-50 dark:bg-success-500/10' },
    { label: 'Budget Used', value: budget ? formatCurrency(budget.spentBudget) : '$0', icon: Wallet, color: 'text-accent-500', bg: 'bg-accent-50 dark:bg-accent-500/10' },
    { label: 'Trip Score', value: '87%', icon: TrendingUp, color: 'text-brand-500', bg: 'bg-brand-500/10' },
  ];

  const Skeleton = ({ className }: { className: string }) => <div className={cn('skeleton', className)} />;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              Welcome back, {user?.name?.split(' ')[0] || 'Traveler'} 👋
            </h1>
            <p className="mt-1 text-muted-foreground">Here's what's happening with your trips today.</p>
          </div>
          <Link to="/trips/create" className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:bg-brand-600">
            <PlusCircle className="h-4 w-4" /> New Trip
          </Link>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial="hidden" animate="visible" variants={fadeUp} custom={i + 1}
            className="rounded-2xl border border-border bg-card p-5 transition-all hover:shadow-card-hover">
            <div className="flex items-center justify-between">
              <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', s.bg)}>
                <s.icon className={cn('h-5 w-5', s.color)} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-foreground">{isLoading ? <Skeleton className="h-7 w-16" /> : s.value}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Budget chart */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5}
          className="rounded-2xl border border-border bg-card p-6 lg:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Budget Overview</h3>
            <Link to="/budget" className="text-xs font-medium text-brand-500 hover:text-brand-600">View All</Link>
          </div>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={budgetChartData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                  {budgetChartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {budgetChartData.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-xs text-muted-foreground">{d.name} ({d.value}%)</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Active / Upcoming Trips */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={6}
          className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Your Trips</h3>
            <Link to="/trips" className="text-xs font-medium text-brand-500 hover:text-brand-600">View All</Link>
          </div>
          {isLoading ? (
            <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div>
          ) : trips.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-2xl bg-brand-500/10 p-4">
                <Map className="h-8 w-8 text-brand-500" />
              </div>
              <p className="mb-1 font-medium text-foreground">No trips yet</p>
              <p className="mb-4 text-sm text-muted-foreground">Create your first AI-powered trip</p>
              <Link to="/trips/create" className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600">
                <PlusCircle className="h-4 w-4" /> Create Trip
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {trips.slice(0, 4).map((trip) => {
                const stageIndex = TRIP_STAGES.findIndex((s) => s.key === trip.status);
                const progress = ((stageIndex + 1) / TRIP_STAGES.length) * 100;
                const daysUntil = getDaysUntil(trip.startDate);
                return (
                  <Link key={trip.id} to={`/trips/${trip.id}`}
                    className="group flex items-center gap-4 rounded-xl border border-border/50 p-4 transition-all hover:border-brand-500/30 hover:bg-muted/50">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand-500/10">
                      <Map className="h-5 w-5 text-brand-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="truncate font-medium text-foreground">{trip.destination}</h4>
                        <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium',
                          trip.status === 'active' ? 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500' :
                          trip.status === 'completed' ? 'bg-muted text-muted-foreground' :
                          'bg-brand-500/10 text-brand-500'
                        )}>
                          {TRIP_STAGES[stageIndex]?.label || trip.status}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDateRange(trip.startDate, trip.endDate)}</span>
                        {daysUntil > 0 && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{daysUntil}d away</span>}
                      </div>
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </Link>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Travel trends */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={7}
          className="rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-4 font-semibold text-foreground">Travel Trends</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis hide />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="trips" stroke="#6366f1" strokeWidth={2} fill="url(#trendGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* AI Recommendations */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={8}
          className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">AI Insights</h3>
            <Sparkles className="h-4 w-4 text-accent-500" />
          </div>
          <div className="space-y-3">
            {[
              { icon: CloudSun, text: 'Weather alert for your Tokyo trip — rain expected on Day 3', type: 'warning' },
              { icon: TrendingUp, text: 'Your Paris trip score improved to 92% after optimization', type: 'success' },
              { icon: AlertTriangle, text: 'Budget utilization at 78% — consider reviewing dining costs', type: 'info' },
            ].map((item, i) => (
              <div key={i} className={cn('flex items-start gap-3 rounded-xl p-3',
                item.type === 'warning' ? 'bg-warning-50 dark:bg-warning-500/10' :
                item.type === 'success' ? 'bg-success-50 dark:bg-success-500/10' :
                'bg-brand-50 dark:bg-brand-500/10'
              )}>
                <item.icon className={cn('mt-0.5 h-4 w-4 flex-shrink-0',
                  item.type === 'warning' ? 'text-warning-600' :
                  item.type === 'success' ? 'text-success-600' : 'text-brand-500'
                )} />
                <p className="text-sm text-foreground">{item.text}</p>
              </div>
            ))}
          </div>
          <Link to="/assistant" className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-500 hover:text-brand-600">
            Ask AI Assistant <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
