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
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useSupabase } from '@/contexts/SupabaseProvider';

export function Sidebar() {
  const [location] = useLocation();
  const { isConfigured } = useSupabase();
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
    <aside className="w-72 bg-sidebar border-r border-sidebar-border flex flex-col" data-testid="sidebar">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <Bot className="text-sidebar-primary-foreground" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-sidebar-foreground" data-testid="text-app-title">
              AI Inbox Manager
            </h1>
            <p className="text-xs text-muted-foreground">Content Moderation Hub</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2" data-testid="navigation">
        {navigationItems.map(({ href, icon: Icon, label, count, variant }) => {
          const isActive = location === href;
          
          return (
            <Link
              key={href}
              href={href}
              className={`sidebar-link flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'active'
                  : 'text-muted-foreground hover:text-sidebar-foreground'
              }`}
              data-testid={`link-${label.toLowerCase().replace(' ', '-')}`}
            >
              <Icon size={20} />
              <span>{label}</span>
              {count > 0 && (
                <Badge
                  variant={variant || 'secondary'}
                  className="ml-auto text-xs"
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
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 bg-green-500 rounded-full real-time-indicator" data-testid="indicator-realtime" />
          <span>Real-time sync active</span>
        </div>
      </div>
    </aside>
  );
}
