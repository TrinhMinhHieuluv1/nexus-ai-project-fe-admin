// Admin Sidebar Navigation

import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Receipt, 
  ChevronLeft,
  ChevronRight,
  Shield
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export function Sidebar() {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard, path: '/dashboard' },
    { id: 'users', label: t('nav.users'), icon: Users, path: '/users' },
    { id: 'coinPackages', label: t('nav.coinPackages'), icon: CreditCard, path: '/coin-packages' },
    { id: 'transactions', label: t('nav.transactions'), icon: Receipt, path: '/transactions' },
  ];

  return (
    <nav
      className={cn(
        "bg-white border-r border-border min-h-screen p-4 flex flex-col transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className={cn("mb-8 flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            <span className="font-bold text-lg">Admin</span>
          </div>
        )}
        {isCollapsed && <Shield className="w-8 h-8 text-primary" />}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg transition-all font-medium",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
                isCollapsed && "justify-center"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
