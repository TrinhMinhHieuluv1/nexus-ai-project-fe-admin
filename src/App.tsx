import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/modules/auth/AuthProvider';
import { LoginPage } from '@/modules/auth/ui/LoginPage';
import { AdminLayout } from '@/shared/components/AdminLayout';
import { Dashboard } from '@/modules/dashboard/ui/pages/Dashboard';
import { UserListPage } from '@/modules/users/ui/pages/UserListPage';
import { UserDetailPage } from '@/modules/users/ui/pages/UserDetailPage';
import { UserFormPage } from '@/modules/users/ui/pages/UserFormPage';
import { PlanListPage } from '@/modules/subscriptions/ui/pages/PlanListPage';
import { PlanFormPage } from '@/modules/subscriptions/ui/pages/PlanFormPage';
import { TransactionListPage } from '@/modules/transactions/ui/pages/TransactionListPage';
import { TransactionDetailPage } from '@/modules/transactions/ui/pages/TransactionDetailPage';
import { Toaster } from 'sonner';

// Protected Route Wrapper for Admin
const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                {/* Dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />

                {/* User Management */}
                <Route path="/users" element={<UserListPage />} />
                <Route path="/users/new" element={<UserFormPage />} />
                <Route path="/users/:id" element={<UserDetailPage />} />
                <Route path="/users/:id/edit" element={<UserFormPage />} />

                {/* Subscription Plan Management */}
                <Route path="/subscriptions" element={<PlanListPage />} />
                <Route path="/subscriptions/new" element={<PlanFormPage />} />
                <Route path="/subscriptions/:id/edit" element={<PlanFormPage />} />

                {/* Transaction Management */}
                <Route path="/transactions" element={<TransactionListPage />} />
                <Route path="/transactions/:id" element={<TransactionDetailPage />} />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}
