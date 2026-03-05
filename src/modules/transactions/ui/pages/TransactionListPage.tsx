// Transaction List Page

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Eye, ArrowUpRight, ArrowDownLeft, RefreshCw, CreditCard, ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { PageLoading } from '@/shared/components/PageLoading';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent } from '@/shared/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { formatDateTime, formatCurrency } from '@/shared/lib/utils';

export function TransactionListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, loading, error, filters, setFilters } = useTransactions();
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchInput, page: 1 });
  };

  const handleSort = (sortBy: string) => {
    const newSortOrder = 
      filters.sortBy === sortBy && filters.sortOrder === 'desc' 
        ? 'asc' 
        : 'desc';
    setFilters({ ...filters, sortBy, sortOrder: newSortOrder, page: 1 });
  };

  const getSortIcon = (columnName: string) => {
    if (filters.sortBy !== columnName) {
      return <ChevronsUpDown className="w-4 h-4 ml-1 text-gray-400" />;
    }
    return filters.sortOrder === 'desc' 
      ? <ArrowDown className="w-4 h-4 ml-1 text-primary" />
      : <ArrowUp className="w-4 h-4 ml-1 text-primary" />;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="w-4 h-4 text-green-600" />;
      case 'refund':
        return <RefreshCw className="w-4 h-4 text-orange-600" />;
      case 'subscription':
        return <CreditCard className="w-4 h-4 text-purple-600" />;
      default:
        return <ArrowUpRight className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'destructive';
      case 'refunded':
        return 'secondary';
      default:
        return 'default';
    }
  };

  if (loading && !data) return <PageLoading />;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{t('transactions.title')}</h1>
        <p className="text-muted-foreground">{t('transactions.list')}</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-200px relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t('common.search')}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filters.type || 'all'}
              onChange={(e) => setFilters({ ...filters, type: e.target.value as any, page: 1 })}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">{t('transactions.types.all')}</option>
              <option value="deposit">{t('transactions.types.deposit')}</option>
              <option value="withdraw">{t('transactions.types.withdraw')}</option>
              <option value="purchase">{t('transactions.types.purchase')}</option>
              <option value="subscription">{t('transactions.types.subscription')}</option>
              <option value="refund">{t('transactions.types.refund')}</option>
              <option value="reward">{t('transactions.types.reward')}</option>
            </select>
            <select
              value={filters.status || 'all'}
              onChange={(e) => setFilters({ ...filters, status: e.target.value as any, page: 1 })}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">{t('transactions.statuses.all')}</option>
              <option value="pending">{t('transactions.statuses.pending')}</option>
              <option value="completed">{t('transactions.statuses.completed')}</option>
              <option value="failed">{t('transactions.statuses.failed')}</option>
              <option value="cancelled">{t('transactions.statuses.cancelled')}</option>
            </select>
            <Button type="submit">{t('common.filter')}</Button>
          </form>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('created_at')}
                >
                  <div className="flex items-center">
                    {t('transactions.code')}
                    {getSortIcon('created_at')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('user_name')}
                >
                  <div className="flex items-center">
                    {t('transactions.user')}
                    {getSortIcon('user_name')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('type')}
                >
                  <div className="flex items-center">
                    {t('transactions.type')}
                    {getSortIcon('type')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center">
                    {t('transactions.amount')}
                    {getSortIcon('amount')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    {t('transactions.status')}
                    {getSortIcon('status')}
                  </div>
                </TableHead>
                <TableHead>{t('transactions.balance')}</TableHead>
                <TableHead className="text-right">{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div>
                      <p className="font-mono text-sm">{transaction.transactionCode}</p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(transaction.createdAt)}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{transaction.userName}</p>
                      <p className="text-sm text-muted-foreground">{transaction.userEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(transaction.type)}
                      <span className="capitalize">{transaction.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className={transaction.type === 'refund' || transaction.type === 'withdraw' ? 'text-orange-600 font-medium' : 'text-green-600 font-medium'}>
                    {(transaction.type === 'refund' || transaction.type === 'withdraw') ? '-' : '+'}{formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(transaction.status) as any}>
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="text-muted-foreground">
                        Before: {formatCurrency(transaction.balanceBefore)}
                      </div>
                      <div className="font-medium">
                        After: {formatCurrency(transaction.balanceAfter)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/transactions/${transaction.id}`)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {data?.transactions.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              {t('common.noData')}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((filters.page || 1) - 1) * (filters.pageSize || 10) + 1} to{' '}
            {Math.min((filters.page || 1) * (filters.pageSize || 10), data.total)} of {data.total}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={(filters.page || 1) <= 1}
              onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={(filters.page || 1) >= data.totalPages}
              onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
