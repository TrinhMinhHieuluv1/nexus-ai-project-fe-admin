// Transaction Gateway Port

import { Transaction, TransactionListResponse, TransactionFilters } from '../entities/TransactionEntities';

export interface TransactionGateway {
  getTransactions(filters: TransactionFilters): Promise<TransactionListResponse>;
  getTransaction(id: string): Promise<Transaction>;
}
