// Transaction Detail Page

import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, User, Calendar, CreditCard, FileText, Hash } from 'lucide-react';
import { useTransaction } from '../hooks/useTransactions';
import { PageLoading } from '@/shared/components/PageLoading';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { formatDateTime, formatCurrency } from '@/shared/lib/utils';

export function TransactionDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { transaction, loading, error } = useTransaction(id!);

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

  if (loading) return <PageLoading />;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!transaction) return null;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/transactions')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{t('transactions.details')}</h1>
            <p className="text-muted-foreground font-mono">{transaction.id}</p>
          </div>
        </div>
        <Badge variant={getStatusVariant(transaction.status) as any} className="text-sm px-4 py-1">
          {transaction.status.toUpperCase()}
        </Badge>
      </div>

      <div className="grid gap-6">
        {/* Transaction Info */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
              <Hash className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Transaction ID</p>
                <p className="font-mono font-medium">{transaction.id}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="font-medium capitalize">{transaction.type}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">{formatDateTime(transaction.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {transaction.type === 'refund' ? '-' : '+'}{formatCurrency(transaction.amount)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">{transaction.userName}</p>
                <p className="text-sm text-muted-foreground">{transaction.userEmail}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto"
                onClick={() => navigate(`/users/${transaction.userId}`)}
              >
                View User
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
              <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
              <p>{transaction.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Metadata */}
        {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(transaction.metadata).map(([key, value]) => (
                  <div key={key} className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</span>
                    <span className="font-medium">{String(value)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
