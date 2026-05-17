import { useMutation, useQuery } from '@tanstack/react-query';
import { assistantApi } from '@/api/assistant';
import { useAssistantStore } from '@/store/assistantStore';
import type { AssistantMessage } from '@/types';
import { toast } from 'sonner';

export function useAssistant(tripId: string) {
  const { addMessage, setLoading } = useAssistantStore();

  const scoreQuery = useQuery({
    queryKey: ['assistant', 'score', tripId],
    queryFn: () => assistantApi.getTripScore(tripId),
    enabled: !!tripId,
    staleTime: 5 * 60 * 1000,
  });

  const optimizeMutation = useMutation({
    mutationFn: () => assistantApi.optimizeTrip(tripId),
    onMutate: () => {
      setLoading(true);
      addMessage({
        id: Date.now().toString(),
        role: 'user',
        content: 'Optimize my trip',
        timestamp: new Date().toISOString(),
      });
    },
    onSuccess: (data) => {
      const msg: AssistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Found ${data.suggestions.length} optimization suggestions that could save you $${data.savingsEstimate}!`,
        type: 'optimization',
        data: data as unknown as Record<string, unknown>,
        timestamp: new Date().toISOString(),
      };
      addMessage(msg);
      setLoading(false);
    },
    onError: () => {
      setLoading(false);
      toast.error('Failed to optimize trip');
    },
  });

  const conflictsMutation = useMutation({
    mutationFn: () => assistantApi.checkConflicts(tripId),
    onMutate: () => {
      setLoading(true);
      addMessage({
        id: Date.now().toString(),
        role: 'user',
        content: 'Check for conflicts in my itinerary',
        timestamp: new Date().toISOString(),
      });
    },
    onSuccess: (data) => {
      const msg: AssistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          data.conflicts.length === 0
            ? 'No conflicts found! Your itinerary looks great.'
            : `Found ${data.conflicts.length} potential conflicts.`,
        type: 'conflict',
        data: data as unknown as Record<string, unknown>,
        timestamp: new Date().toISOString(),
      };
      addMessage(msg);
      setLoading(false);
    },
    onError: () => {
      setLoading(false);
      toast.error('Failed to check conflicts');
    },
  });

  const alternativesMutation = useMutation({
    mutationFn: () => assistantApi.recommendAlternatives(tripId),
    onMutate: () => {
      setLoading(true);
      addMessage({
        id: Date.now().toString(),
        role: 'user',
        content: 'Suggest alternatives for my activities',
        timestamp: new Date().toISOString(),
      });
    },
    onSuccess: (data) => {
      const msg: AssistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Here are ${data.alternatives.length} alternative suggestions for your trip.`,
        type: 'alternative',
        data: data as unknown as Record<string, unknown>,
        timestamp: new Date().toISOString(),
      };
      addMessage(msg);
      setLoading(false);
    },
    onError: () => {
      setLoading(false);
      toast.error('Failed to get alternatives');
    },
  });

  return {
    score: scoreQuery.data,
    isScoreLoading: scoreQuery.isLoading,
    optimize: optimizeMutation.mutate,
    checkConflicts: conflictsMutation.mutate,
    getAlternatives: alternativesMutation.mutate,
    isOptimizing: optimizeMutation.isPending,
    isCheckingConflicts: conflictsMutation.isPending,
    isGettingAlternatives: alternativesMutation.isPending,
  };
}
