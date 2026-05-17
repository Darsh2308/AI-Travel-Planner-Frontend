import { motion } from 'framer-motion';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/30 px-8 py-16 text-center',
        className
      )}
    >
      <div className="mb-4 rounded-2xl bg-brand-500/10 p-4 text-brand-500">
        {icon || <FileQuestion className="h-8 w-8" />}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="rounded-xl bg-brand-500 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-brand-600 hover:shadow-lg"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
}

export function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary?: () => void;
}) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center"
    >
      <div className="mb-6 rounded-2xl bg-danger-50 dark:bg-danger-500/10 p-5">
        <FileQuestion className="h-10 w-10 text-danger-500" />
      </div>
      <h2 className="mb-2 text-2xl font-bold text-foreground">Something went wrong</h2>
      <p className="mb-6 max-w-md text-muted-foreground">
        {error.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </button>
        {resetErrorBoundary && (
          <button
            onClick={resetErrorBoundary}
            className="rounded-xl bg-brand-500 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-brand-600"
          >
            Try Again
          </button>
        )}
      </div>
    </motion.div>
  );
}

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-8"
        >
          <span className="text-[120px] font-display font-bold text-gradient leading-none md:text-[180px]">
            404
          </span>
        </motion.div>
        <h1 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">
          Lost in the journey?
        </h1>
        <p className="mb-8 max-w-md text-lg text-muted-foreground">
          The page you&apos;re looking for has wandered off the map. Let&apos;s get you back on track.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl bg-brand-500 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-600 hover:shadow-xl hover:shadow-brand-500/25"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 rounded-xl border border-border px-8 py-3 text-sm font-semibold text-foreground transition-all hover:bg-muted"
          >
            Go to Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
