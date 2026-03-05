import { TransactionGateway } from '../domain/ports/TransactionGateway';
import { Transaction, TransactionListResponse, TransactionFilters } from '../domain/entities/TransactionEntities';
import { httpClient } from '../../../shared/infrastructure/HttpClient';
import { apiConfig } from '../../../shared/config/api.config';

export class TransactionApiGateway implements TransactionGateway {
  async getTransactions(filters: TransactionFilters): Promise<TransactionListResponse> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.pageSize) params.append('page_size', filters.pageSize.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.type && filters.type !== 'all') params.append('type', filters.type);
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters.sortBy) params.append('sort_by', filters.sortBy);
    if (filters.sortOrder) params.append('sort_order', filters.sortOrder);

    const url = `${apiConfig.transactions.list}?${params.toString()}`;
    const response = await httpClient.get<{
      transactions: any[];
      total: number;
      page: number;
      page_size: number;
      total_pages: number;
    }>(url);

    return {
      transactions: response.transactions.map(this.transformTransaction),
      total: response.total,
      page: response.page,
      pageSize: response.page_size,
      totalPages: response.total_pages,
    };
  }

  async getTransaction(id: string): Promise<Transaction> {
    const url = apiConfig.transactions.get(id);
    const response = await httpClient.get<any>(url);
    return this.transformTransaction(response);
  }

  private transformTransaction(data: any): Transaction {
    return {
      id: data.id,
      userId: data.user_id,
      userName: data.user_name,
      userEmail: data.user_email,
      transactionCode: data.transaction_code,
      type: data.type,
      amount: data.amount,
      balanceBefore: data.balance_before,
      balanceAfter: data.balance_after,
      status: data.status,
      note: data.note,
      createdAt: data.created_at,
    };
  }
}
