import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Map,
  Wallet,
  User,
  Bot,
  BarChart3,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  Menu,
  X,
  LogOut,
  Settings,
  ChevronDown,
  Compass,
} from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Trips', href: '/trips', icon: Map },
  { name: 'Create Trip', href: '/trips/create', icon: PlusCircle },
  { name: 'Budget', href: '/budget', icon: Wallet },
  { name: 'AI Assistant', href: '/assistant', icon: Bot },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

const secondaryNav = [
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function RootLayout() {
  const location = useLocation();
  const { user } = useAuthStore();
  const { sidebarCollapsed, setSidebarCollapsed, sidebarMobileOpen, setSidebarMobileOpen } = useUIStore();
  const { logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const pageTitle = (() => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/trips/create') return 'Create Trip';
    if (path.startsWith('/trips/')) return 'Trip Details';
    if (path === '/trips') return 'My Trips';
    if (path === '/budget') return 'Budget';
    if (path === '/assistant') return 'AI Assistant';
    if (path === '/analytics') return 'Analytics';
    if (path === '/profile') return 'Profile';
    if (path === '/settings') return 'Settings';
    return 'Voyageur';
  })();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 lg:relative',
          sidebarCollapsed ? 'w-[72px]' : 'w-[260px]',
          sidebarMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Sidebar header */}
        <div className={cn('flex h-16 items-center border-b border-sidebar-border px-4', sidebarCollapsed ? 'justify-center' : 'justify-between')}>
          <Logo collapsed={sidebarCollapsed} />
          <button
            onClick={() => setSidebarMobileOpen(false)}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <div className={cn('mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground', sidebarCollapsed ? 'text-center' : 'px-3')}>
            {sidebarCollapsed ? '•' : 'Main'}
          </div>
          {navigation.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={() => setSidebarMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  sidebarCollapsed && 'justify-center px-2',
                  isActive
                    ? 'bg-brand-500/10 text-brand-500 dark:bg-brand-500/15'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-brand-500')} />
                  {!sidebarCollapsed && <span>{item.name}</span>}
                  {isActive && !sidebarCollapsed && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-500"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}

          <div className="my-4 border-t border-sidebar-border" />

          <div className={cn('mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground', sidebarCollapsed ? 'text-center' : 'px-3')}>
            {sidebarCollapsed ? '•' : 'Account'}
          </div>
          {secondaryNav.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={() => setSidebarMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  sidebarCollapsed && 'justify-center px-2',
                  isActive
                    ? 'bg-brand-500/10 text-brand-500'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )
              }
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!sidebarCollapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-sidebar-border p-3">
          {/* Collapse button - desktop only */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden w-full items-center justify-center rounded-xl p-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground lg:flex"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <div className="flex w-full items-center gap-2">
                <ChevronLeft className="h-5 w-5" />
                <span className="text-sm">Collapse</span>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-xl md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarMobileOpen(true)}
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-foreground">{pageTitle}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Search */}
            <button
              onClick={() => useUIStore.getState().setCommandPaletteOpen(true)}
              className="hidden items-center gap-2 rounded-xl border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-muted md:flex"
            >
              <Search className="h-4 w-4" />
              <span>Search...</span>
              <kbd className="ml-4 rounded-md border border-border bg-background px-1.5 py-0.5 text-xs">
                ⌘K
              </kbd>
            </button>

            <button className="relative rounded-xl p-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground md:hidden">
              <Search className="h-5 w-5" />
            </button>

            <ThemeToggle />

            {/* Notifications */}
            <button className="relative rounded-xl p-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger-500" />
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-xl p-1.5 transition-all hover:bg-muted"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-xs font-semibold text-white">
                  {user ? getInitials(user.fullName) : <User className="h-4 w-4" />}
                </div>
                <div className="hidden text-left md:block">
                  <p className="text-sm font-medium text-foreground">{user?.fullName || 'User'}</p>
                </div>
                <ChevronDown className="hidden h-4 w-4 text-muted-foreground md:block" />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-border bg-popover p-1.5 shadow-elevated"
                    >
                      <div className="border-b border-border px-3 py-2.5 mb-1.5">
                        <p className="text-sm font-medium text-foreground">{user?.fullName}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                      <NavLink
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted"
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </NavLink>
                      <NavLink
                        to="/settings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted"
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </NavLink>
                      <div className="my-1.5 border-t border-border" />
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          logout();
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-500/10"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
