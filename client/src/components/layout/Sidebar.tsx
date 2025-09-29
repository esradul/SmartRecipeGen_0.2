import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Home, 
  ShieldCheck, 
  MessageSquare, 
  AlertTriangle, 
  Star,
  Bot
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useSupabase } from '@/contexts/SupabaseProvider';

export function Sidebar() {
  const [location] = useLocation();
  const { isConfigured } = useSupabase();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { useRecords } = useSupabaseData();

  // Only fetch counts if Supabase is configured
  const sendGuardQuery = useRecords(
    isConfigured ? "sendguard" : undefined
  );
  const manualReplyQuery = useRecords(
    isConfigured ? "manual-reply" : undefined
  );
  const escalationQuery = useRecords(
    isConfigured ? "escalation" : undefined
  );
  const importantQuery = useRecords(
    isConfigured ? "important" : undefined
  );

  const navigationItems = [
    {
      href: '/',
      icon: Home,
      label: 'Monitoring',
      count: 0,
    },
    {
      href: '/sendguard',
      icon: ShieldCheck,
      label: 'SendGuard',
      count: sendGuardQuery.data?.length || 0,
    },
    {
      href: '/manual-reply',
      icon: MessageSquare,
      label: 'Manual Reply',
      count: manualReplyQuery.data?.length || 0,
    },
    {
      href: '/escalation',
      icon: AlertTriangle,
      label: 'Escalation',
      count: escalationQuery.data?.length || 0,
      variant: 'destructive' as const,
    },
    {
      href: '/important',
      icon: Star,
      label: 'Important',
      count: importantQuery.data?.length || 0,
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-background"
        >
          <Bot size={16} />
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-40 w-72 bg-sidebar border-r border-sidebar-border flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `} 
        data-testid="sidebar"
      >
        {/* Sidebar Header */}
        <div className="p-4 lg:p-6 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-sidebar-primary rounded-lg flex items-center justify-center">
                <Bot className="text-sidebar-primary-foreground" size={16} />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base lg:text-lg font-semibold text-sidebar-foreground" data-testid="text-app-title">
                  AI Inbox Manager
                </h1>
                <p className="text-xs text-muted-foreground">Content Moderation Hub</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              ×
            </Button>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-3 lg:p-4 space-y-1 lg:space-y-2" data-testid="navigation">
          {navigationItems.map(({ href, icon: Icon, label, count, variant }) => {
            const isActive = location === href;
            
            return (
              <Link
                key={href}
                href={href}
                className={`sidebar-link flex items-center space-x-2 lg:space-x-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'active'
                    : 'text-muted-foreground hover:text-sidebar-foreground'
                }`}
                data-testid={`link-${label.toLowerCase().replace(' ', '-')}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon size={18} />
                <span className="truncate">{label}</span>
                {count > 0 && (
                  <Badge
                    variant={variant || 'secondary'}
                    className="ml-auto text-xs shrink-0"
                    data-testid={`badge-${label.toLowerCase().replace(' ', '-')}-count`}
                  >
                    {count}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>
        
        {/* Sidebar Footer */}
        <div className="p-3 lg:p-4 border-t border-sidebar-border">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full real-time-indicator" data-testid="indicator-realtime" />
            <span className="hidden sm:inline">Real-time sync active</span>
            <span className="sm:hidden">Live</span>
          </div>
        </div>
      </aside>
    </>
  );
}
