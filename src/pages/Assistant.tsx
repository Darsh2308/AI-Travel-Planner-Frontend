import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, AlertTriangle, ArrowLeftRight, BarChart3, Loader2, Zap, CheckCircle2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAssistantStore } from '@/store/assistantStore';
import { useAssistant } from '@/hooks/useAssistant';
import { useTrips } from '@/hooks/useTrips';
import { cn } from '@/lib/utils';
import type { AssistantMessage } from '@/types';

export default function Assistant() {
  const { trips } = useTrips();
  const [selectedTripId, setSelectedTripId] = useState('');
  const { messages, isLoading: isAssistantLoading, clearMessages } = useAssistantStore();
  const { score, isScoreLoading, optimize, checkConflicts, getAlternatives, isOptimizing, isCheckingConflicts, isGettingAlternatives } = useAssistant(selectedTripId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (!selectedTripId && trips.length > 0) {
      setSelectedTripId(trips[0].id ?? trips[0]._id);
    }
  }, [trips, selectedTripId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickActions = [
    { label: 'Optimize Trip', icon: Sparkles, action: () => optimize(), loading: isOptimizing, color: 'text-accent-500 bg-accent-500/10' },
    { label: 'Check Conflicts', icon: AlertTriangle, action: () => checkConflicts(), loading: isCheckingConflicts, color: 'text-warning-600 bg-warning-50 dark:bg-warning-500/10' },
    { label: 'Get Alternatives', icon: ArrowLeftRight, action: () => getAlternatives({ affectedDay: 1, reason: 'user preference change' }), loading: isGettingAlternatives, color: 'text-brand-500 bg-brand-500/10' },
  ];

  return (
    <div className="flex h-[calc(100vh-10rem)] flex-col gap-4 lg:flex-row">
      {/* Chat area */}
      <div className="flex flex-1 flex-col rounded-2xl border border-border bg-card overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-brand">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">AI Travel Assistant</h3>
              <p className="text-xs text-muted-foreground">Powered by Voyageur AI</p>
            </div>
          </div>
          <select
            value={selectedTripId}
            onChange={(e) => { setSelectedTripId(e.target.value); clearMessages(); }}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500/50 cursor-pointer min-w-[130px]"
          >
            <option value="">Select trip...</option>
            {trips.map((t) => { const tid = t.id ?? t._id; return <option key={tid} value={tid}>{t.destinationCity}</option>; })}
          </select>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-brand shadow-xl shadow-brand-500/25">
                <Bot className="h-8 w-8 text-white" />
              </motion.div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">How can I help?</h3>
              <p className="mb-6 max-w-sm text-sm text-muted-foreground">
                Select a trip and ask me anything. I can optimize your itinerary, check for conflicts, and suggest alternatives.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {quickActions.map((a) => (
                  <button key={a.label} onClick={() => a.action()} disabled={!selectedTripId || a.loading}
                    className={cn('flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all hover:shadow-md disabled:opacity-50', a.color)}>
                    {a.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <a.icon className="h-4 w-4" />}
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
                {isAssistantLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin text-brand-500" />
                    <span>AI is thinking...</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Quick Actions bar */}
        {messages.length > 0 && (
          <div className="flex gap-2 border-t border-border px-4 py-3 overflow-x-auto">
            {quickActions.map((a) => (
              <button key={a.label} onClick={() => a.action()} disabled={!selectedTripId || a.loading}
                className="flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground disabled:opacity-50">
                {a.loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <a.icon className="h-3 w-3" />}
                {a.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Score sidebar */}
      <div className="w-full space-y-4 lg:w-80">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
            <BarChart3 className="h-4 w-4 text-brand-500" /> Trip Score
          </h3>
          {!selectedTripId ? (
            <p className="text-sm text-muted-foreground">Select a trip to see its score</p>
          ) : isScoreLoading ? (
            <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-4 w-full" />)}</div>
          ) : score ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-4 border-brand-500">
                  <span className="text-3xl font-bold text-foreground">{score.score}</span>
                  <span className="absolute -bottom-2 rounded-full bg-brand-500 px-2 py-0.5 text-xs font-medium text-white">/100</span>
                </div>
              </div>
              {Object.entries(score.dimensions ?? {}).map(([key, val]) => (
                <div key={key}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="capitalize text-muted-foreground">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="font-medium text-foreground">{val}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className={cn('h-full rounded-full', val >= 80 ? 'bg-success-500' : val >= 60 ? 'bg-accent-500' : 'bg-danger-500')} style={{ width: `${val}%` }} />
                  </div>
                </div>
              ))}
              {score.weakAreas?.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">Areas to Improve</p>
                  {score.weakAreas.map((r, i) => (
                    <div key={i} className="flex items-start gap-2 rounded-lg bg-muted/50 p-2.5 text-xs text-muted-foreground">
                      <Zap className="mt-0.5 h-3 w-3 flex-shrink-0 text-accent-500" />
                      {r.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Score not available yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: AssistantMessage }) {
  const isUser = message.role === 'user';
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div className={cn('max-w-[80%] rounded-2xl px-4 py-3',
        isUser ? 'bg-brand-500 text-white' : 'bg-muted text-foreground')}>
        <p className="text-sm">{message.content}</p>
        {message.type === 'optimization' && message.data && (
          <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
            {((message.data as { suggestions?: string[] }).suggestions || []).map((s, i) => (
              <div key={i} className="flex items-start gap-2 rounded-lg bg-white/10 p-2 text-xs">
                <CheckCircle2 className="mt-0.5 h-3 w-3 flex-shrink-0" />
                <span>{s}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
