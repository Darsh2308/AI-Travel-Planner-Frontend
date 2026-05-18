import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Map, DollarSign } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTrips } from '@/hooks/useTrips';
import { useAnalytics } from '@/hooks/useAnalytics';
import { cn } from '@/lib/utils';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { PageLoader } from '@/components/common/LoadingSpinner';

const CATEGORY_COLORS: Record<string, string> = {
  Accommodation: '#6366f1',
  Activities: '#f59e0b',
  Dining: '#10b981',
  Transport: '#8b5cf6',
  Shopping: '#ec4899',
};

export default function Analytics() {
  const { trips } = useTrips();
  const { analytics, isLoading } = useAnalytics();

  if (isLoading) return <PageLoader />;

  const categorySpending = (analytics?.spendingByCategory ?? []).map((d) => ({
    ...d,
    color: CATEGORY_COLORS[d.name] ?? '#64748b',
  }));

  const stats = [
    { label: 'Total Trips', value: analytics?.totalTrips ?? 0, icon: Map, color: 'text-brand-500', bg: 'bg-brand-500/10' },
    { label: 'Total Spent', value: formatCurrency(analytics?.totalSpent ?? 0), icon: DollarSign, color: 'text-accent-500', bg: 'bg-accent-500/10' },
    { label: 'Avg. per Trip', value: formatCurrency(analytics?.avgPerTrip ?? 0), icon: TrendingUp, color: 'text-success-500', bg: 'bg-success-50 dark:bg-success-500/10' },
    { label: 'Countries', value: analytics?.uniqueCountries ?? 0, icon: BarChart3, color: 'text-brand-500', bg: 'bg-brand-500/10' },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">Insights into your travel patterns and spending.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-border bg-card p-5">
            <div className={cn('mb-3 flex h-10 w-10 items-center justify-center rounded-xl', s.bg)}>
              <s.icon className={cn('h-5 w-5', s.color)} />
            </div>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly spending */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-4 font-semibold text-foreground">Monthly Spending vs Budget</h3>
          {(analytics?.monthlySpending?.length ?? 0) > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={analytics!.monthlySpending.map((d) => ({ ...d, month: d.label }))}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  formatter={(val: number) => formatCurrency(val)} />
                <Bar dataKey="budget" fill="#e2e8f0" radius={[6, 6, 0, 0]} name="Budget" />
                <Bar dataKey="spent" fill="#6366f1" radius={[6, 6, 0, 0]} name="Spent" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-16 text-center text-sm text-muted-foreground">No spending data yet</p>
          )}
        </motion.div>

        {/* Category spending */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-4 font-semibold text-foreground">Spending by Category</h3>
          {categorySpending.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={categorySpending} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" stroke="none">
                    {categorySpending.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }}
                    formatter={(val: number) => formatCurrency(val)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {categorySpending.map((d) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-xs text-muted-foreground">{d.name} — {formatCurrency(d.value)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="py-16 text-center text-sm text-muted-foreground">No category data yet</p>
          )}
        </motion.div>

        {/* Travel frequency */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
          <h3 className="mb-4 font-semibold text-foreground">Travel Frequency</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={(analytics?.travelFrequency ?? []).map((d) => ({ ...d, month: d.label }))}>
              <defs>
                <linearGradient id="freqGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis hide />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
              <Area type="monotone" dataKey="trips" stroke="#6366f1" strokeWidth={2} fill="url(#freqGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Trip history */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="rounded-2xl border border-border bg-card p-6">
        <h3 className="mb-4 font-semibold text-foreground">Trip History</h3>
        {trips.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Destination</th>
                  <th className="pb-3 font-medium text-muted-foreground">Dates</th>
                  <th className="pb-3 font-medium text-muted-foreground">Budget</th>
                  <th className="pb-3 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {trips.map((trip) => (
                  <tr key={trip._id ?? trip.id} className="border-b border-border/50">
                    <td className="py-3 font-medium text-foreground">{trip.destinationCity}{trip.destinationCountry ? `, ${trip.destinationCountry}` : ''}</td>
                    <td className="py-3 text-muted-foreground">{trip.startDate ? formatDate(trip.startDate) : '—'}</td>
                    <td className="py-3 text-foreground">{formatCurrency(trip.allocatedBudgetAmount ?? 0)}</td>
                    <td className="py-3"><span className="rounded-full bg-brand-500/10 px-2 py-0.5 text-xs font-medium text-brand-500">{trip.tripStatus}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">No trip history to display</p>
        )}
      </motion.div>
    </div>
  );
}
