import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight, Edit3, Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useBudget } from '@/hooks/useBudget';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { formatCurrency, formatRelativeTime, getPercentage } from '@/utils/formatters';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { toast } from 'sonner';

const categoryColors = ['#6366f1', '#f59e0b', '#10b981', '#f43f5e', '#8b5cf6', '#ec4899'];

export default function Budget() {
  const { budget, ledger, isLoading, updateBudget, isUpdating } = useBudget();
  const [editing, setEditing] = useState(false);
  const [newBudget, setNewBudget] = useState('');

  if (isLoading) return <PageLoader />;

  const stats = [
    { label: 'Total Budget', value: formatCurrency(budget?.totalBudget || 0), icon: Wallet, color: 'text-brand-500', bg: 'bg-brand-500/10' },
    { label: 'Allocated', value: formatCurrency(budget?.allocatedBudget || 0), icon: TrendingUp, color: 'text-accent-500', bg: 'bg-accent-500/10' },
    { label: 'Spent', value: formatCurrency(budget?.spentBudget || 0), icon: TrendingDown, color: 'text-danger-500', bg: 'bg-danger-50 dark:bg-danger-500/10' },
    { label: 'Remaining', value: formatCurrency(budget?.remainingBudget || 0), icon: DollarSign, color: 'text-success-500', bg: 'bg-success-50 dark:bg-success-500/10' },
  ];

  const pieData = budget?.categories?.map((c, i) => ({
    name: c.name, value: c.allocated, color: categoryColors[i % categoryColors.length] || '#64748b',
  })) || [];

  const barData = budget?.categories?.map((c) => ({
    name: c.name, allocated: c.allocated, spent: c.spent,
  })) || [];

  const handleSaveBudget = async () => {
    const val = parseFloat(newBudget);
    if (isNaN(val) || val < 100) { toast.error('Minimum budget is $100'); return; }
    await updateBudget({ totalBudget: val });
    setEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Budget Management</h1>
          <p className="text-sm text-muted-foreground">Track your travel spending and allocations.</p>
        </div>
        <button onClick={() => { setEditing(!editing); setNewBudget(String(budget?.totalBudget || '')); }}
          className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
          <Edit3 className="h-4 w-4" /> Edit Budget
        </button>
      </div>

      {editing && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-2xl border border-brand-500/30 bg-brand-500/5 p-4">
          <DollarSign className="h-5 w-5 text-brand-500" />
          <input type="number" value={newBudget} onChange={(e) => setNewBudget(e.target.value)} placeholder="Enter total budget"
            className="flex-1 rounded-xl border border-border bg-background px-4 py-2 text-sm focus:border-brand-500 focus:outline-none" />
          <button onClick={handleSaveBudget} disabled={isUpdating}
            className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60">
            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
          </button>
          <button onClick={() => setEditing(false)} className="rounded-xl border border-border px-4 py-2 text-sm text-foreground hover:bg-muted">Cancel</button>
        </motion.div>
      )}

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
            {s.label === 'Spent' && budget && (
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-danger-500 transition-all" style={{ width: `${getPercentage(budget.spentBudget, budget.totalBudget)}%` }} />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-4 font-semibold text-foreground">Budget Allocation</h3>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" stroke="none">
                    {pieData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {pieData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-xs text-muted-foreground">{d.name}</span>
                  </div>
                ))}
              </div>
            </>
          ) : <p className="py-12 text-center text-sm text-muted-foreground">No budget categories yet</p>}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-4 font-semibold text-foreground">Allocated vs Spent</h3>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="allocated" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="spent" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="py-12 text-center text-sm text-muted-foreground">No spending data yet</p>}
        </motion.div>
      </div>

      {/* Ledger */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="rounded-2xl border border-border bg-card p-6">
        <h3 className="mb-4 font-semibold text-foreground">Transaction Ledger</h3>
        {ledger.length > 0 ? (
          <div className="space-y-3">
            {ledger.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between rounded-xl border border-border/50 p-4">
                <div className="flex items-center gap-3">
                  <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg',
                    entry.type === 'credit' ? 'bg-success-50 dark:bg-success-500/10' :
                    entry.type === 'debit' ? 'bg-danger-50 dark:bg-danger-500/10' : 'bg-brand-500/10')}>
                    {entry.type === 'credit' ? <ArrowDownRight className="h-4 w-4 text-success-500" /> :
                     entry.type === 'debit' ? <ArrowUpRight className="h-4 w-4 text-danger-500" /> :
                     <DollarSign className="h-4 w-4 text-brand-500" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{entry.description}</p>
                    <p className="text-xs text-muted-foreground">{entry.category} · {formatRelativeTime(entry.createdAt)}</p>
                  </div>
                </div>
                <span className={cn('text-sm font-semibold',
                  entry.type === 'credit' ? 'text-success-500' : entry.type === 'debit' ? 'text-danger-500' : 'text-foreground')}>
                  {entry.type === 'credit' ? '+' : '-'}{formatCurrency(entry.amount)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-sm text-muted-foreground">No transactions yet</p>
        )}
      </motion.div>
    </div>
  );
}
