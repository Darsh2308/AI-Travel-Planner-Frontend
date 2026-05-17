import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Map, DollarSign, Calendar } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTrips } from '@/hooks/useTrips';
import { useBudget } from '@/hooks/useBudget';
import { cn } from '@/lib/utils';
import { formatCurrency, formatDate } from '@/utils/formatters';

const monthlyData = [
  { month: 'Jan', spent: 1200, budget: 2000 },
  { month: 'Feb', spent: 800, budget: 1500 },
  { month: 'Mar', spent: 2400, budget: 3000 },
  { month: 'Apr', spent: 1800, budget: 2500 },
  { month: 'May', spent: 3200, budget: 4000 },
  { month: 'Jun', spent: 2100, budget: 3500 },
];

const categorySpending = [
  { name: 'Accommodation', value: 4200, color: '#6366f1' },
  { name: 'Activities', value: 2800, color: '#f59e0b' },
  { name: 'Dining', value: 2100, color: '#10b981' },
  { name: 'Transport', value: 1500, color: '#8b5cf6' },
  { name: 'Shopping', value: 900, color: '#ec4899' },
];

const travelFrequency = [
  { month: 'Jan', trips: 1 }, { month: 'Feb', trips: 0 }, { month: 'Mar', trips: 2 },
  { month: 'Apr', trips: 1 }, { month: 'May', trips: 3 }, { month: 'Jun', trips: 2 },
];

export default function Analytics() {
  const { trips } = useTrips();
  const { budget } = useBudget();

  const totalSpent = categorySpending.reduce((sum, c) => sum + c.value, 0);

  const stats = [
    { label: 'Total Trips', value: trips.length || 12, icon: Map, color: 'text-brand-500', bg: 'bg-brand-500/10' },
    { label: 'Total Spent', value: formatCurrency(totalSpent), icon: DollarSign, color: 'text-accent-500', bg: 'bg-accent-500/10' },
    { label: 'Avg. per Trip', value: formatCurrency(trips.length ? totalSpent / (trips.length || 1) : 960), icon: TrendingUp, color: 'text-success-500', bg: 'bg-success-50 dark:bg-success-500/10' },
    { label: 'Countries', value: new Set(trips.map((t) => t.country)).size || 8, icon: BarChart3, color: 'text-brand-500', bg: 'bg-brand-500/10' },
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
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis hide />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="budget" fill="#e2e8f0" radius={[6, 6, 0, 0]} />
              <Bar dataKey="spent" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category spending */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-4 font-semibold text-foreground">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categorySpending} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" stroke="none">
                {categorySpending.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
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
        </motion.div>

        {/* Travel frequency */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
          <h3 className="mb-4 font-semibold text-foreground">Travel Frequency</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={travelFrequency}>
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
                  <tr key={trip.id} className="border-b border-border/50">
                    <td className="py-3 font-medium text-foreground">{trip.destination}, {trip.country}</td>
                    <td className="py-3 text-muted-foreground">{formatDate(trip.startDate)}</td>
                    <td className="py-3 text-foreground">{formatCurrency(trip.totalBudget)}</td>
                    <td className="py-3"><span className="rounded-full bg-brand-500/10 px-2 py-0.5 text-xs font-medium text-brand-500">{trip.status}</span></td>
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
