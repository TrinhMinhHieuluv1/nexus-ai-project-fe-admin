// Transaction Domain Service

import { TransactionGateway } from '../ports/TransactionGateway';
import { Transaction, TransactionListResponse, TransactionFilters } from '../entities/TransactionEntities';

export class TransactionService {
  constructor(private gateway: TransactionGateway) {}

  async getTransactions(filters: TransactionFilters): Promise<TransactionListResponse> {
    return this.gateway.getTransactions(filters);
  }

  async getTransaction(id: string): Promise<Transaction> {
    return this.gateway.getTransaction(id);
  }

  getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      deposit: 'Deposit',
      purchase: 'Purchase',
      subscription: 'Subscription',
      refund: 'Refund',
    };
    return labels[type] || type;
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'Pending',
      completed: 'Completed',
      failed: 'Failed',
      refunded: 'Refunded',
    };
    return labels[status] || status;
  }
}
