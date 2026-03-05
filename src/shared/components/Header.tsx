// Admin Header

import { useAuth } from '@/modules/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components/ui/button';
import { LogOut, User } from 'lucide-react';

export function Header() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-border px-6 flex items-center justify-between">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Nexus AI Admin</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <span className="text-muted-foreground">
            {user?.fullName || user?.email}
          </span>
        </div>
        
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          {t('auth.logout')}
        </Button>
      </div>
    </header>
  );
}
