import { format, formatDistanceToNow, parseISO, differenceInDays, isAfter, isBefore } from 'date-fns';

export function formatDate(date: string | Date, formatStr = 'MMM dd, yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, formatStr);
}

export function formatDateRange(start: string, end: string): string {
  const s = parseISO(start);
  const e = parseISO(end);
  const sameMonth = format(s, 'MMM') === format(e, 'MMM');
  const sameYear = format(s, 'yyyy') === format(e, 'yyyy');

  if (sameMonth && sameYear) {
    return `${format(s, 'MMM dd')} - ${format(e, 'dd, yyyy')}`;
  }
  if (sameYear) {
    return `${format(s, 'MMM dd')} - ${format(e, 'MMM dd, yyyy')}`;
  }
  return `${format(s, 'MMM dd, yyyy')} - ${format(e, 'MMM dd, yyyy')}`;
}

export function formatRelativeTime(date: string): string {
  return formatDistanceToNow(parseISO(date), { addSuffix: true });
}

export function getDaysUntil(date: string): number {
  return differenceInDays(parseISO(date), new Date());
}

export function getTripDuration(start: string, end: string): number {
  return differenceInDays(parseISO(end), parseISO(start)) + 1;
}

export function isFutureDate(date: string): boolean {
  return isAfter(parseISO(date), new Date());
}

export function isPastDate(date: string): boolean {
  return isBefore(parseISO(date), new Date());
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function getPercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}
