import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { budgetApi } from '@/api/budget';
import type { BudgetLedger, UpdateBudgetPayload } from '@/types';
import { toast } from 'sonner';

export function useBudget() {
  const queryClient = useQueryClient();

  const budgetQuery = useQuery({
    queryKey: ['budget'],
    queryFn: budgetApi.getBudget,
    staleTime: 5 * 60 * 1000,
  });

  const ledgerQuery = useQuery({
    queryKey: ['budget', 'ledger'],
    queryFn: budgetApi.getLedger,
    staleTime: 2 * 60 * 1000,
  });

  const updateBudgetMutation = useMutation({
    mutationFn: (payload: UpdateBudgetPayload) => budgetApi.updateBudget(payload),
    onMutate: async (newBudget) => {
      await queryClient.cancelQueries({ queryKey: ['budget'] });
      const previous = queryClient.getQueryData<BudgetLedger>(['budget']);
      queryClient.setQueryData<BudgetLedger>(['budget'], (old) =>
        old ? { ...old, totalBudget: newBudget.total, currency: newBudget.currency } : old
      );
      return { previous };
    },
    onError: (_err, _new, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['budget'], context.previous);
      }
      toast.error('Failed to update budget');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget'] });
      toast.success('Budget updated');
    },
  });

  return {
    budget: budgetQuery.data,
    ledger: ledgerQuery.data ?? [],
    isLoading: budgetQuery.isLoading,
    isLedgerLoading: ledgerQuery.isLoading,
    updateBudget: updateBudgetMutation.mutateAsync,
    isUpdating: updateBudgetMutation.isPending,
  };
}
