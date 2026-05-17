import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LogoProps {
  collapsed?: boolean;
  className?: string;
  linkTo?: string;
}

export function Logo({ collapsed = false, className, linkTo = '/' }: LogoProps) {
  return (
    <Link
      to={linkTo}
      className={cn('flex items-center gap-2.5 transition-all', className)}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-brand shadow-lg shadow-brand-500/25">
        <Compass className="h-5 w-5 text-white" />
      </div>
      {!collapsed && (
        <span className="font-display text-xl font-bold tracking-tight text-foreground">
          Voyageur
        </span>
      )}
    </Link>
  );
}
