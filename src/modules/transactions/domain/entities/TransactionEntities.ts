// Transaction Domain Entities

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  transactionCode: string | null;
  type: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  status: string;
  note: string | null;
  createdAt: string;
}

export interface TransactionListResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface TransactionFilters {
  search?: string;
  type?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}
