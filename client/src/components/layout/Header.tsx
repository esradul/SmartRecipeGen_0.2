import { useState } from 'react';
import { User, Settings, Trash2, LogOut, Sliders } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ConfigurationDialog } from '@/components/dialogs/ConfigurationDialog';
import { useSupabase } from '@/contexts/SupabaseProvider';
import { useTheme } from '@/contexts/ThemeProvider';
import { authSupabase } from '@/lib/supabase-auth';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

interface HeaderProps {
  title: string;
  lastUpdated?: string;
}

export function Header({ title, lastUpdated }: HeaderProps) {
  const [, setLocation] = useLocation();
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const { disconnect } = useSupabase();
  const { toggleTheme } = useTheme();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await authSupabase.auth.signOut();
      disconnect();
      setLocation('/login');
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast({
      title: 'Disconnected',
      description: 'Supabase data connection has been cleared.',
    });
  };

  return (
    <>
      <header className="bg-card border-b border-border px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between" data-testid="header">
        <div className="flex items-center space-x-2 lg:space-x-4 min-w-0">
          <h2 className="text-lg lg:text-2xl font-semibold text-foreground truncate" data-testid="text-page-title">
            {title}
          </h2>
          {lastUpdated && (
            <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Last updated: <span data-testid="text-last-updated">{lastUpdated}</span></span>
            </div>
          )}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 lg:space-x-3 shrink-0" data-testid="button-user-menu">
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="text-primary-foreground" size={16} />
              </div>
              <span className="hidden lg:inline text-sm font-medium">admin@example.com</span>
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-56" data-testid="dropdown-user-menu">
            <DropdownMenuItem onClick={() => setConfigDialogOpen(true)} data-testid="menu-item-configuration">
              <Settings className="mr-3 h-4 w-4" />
              Configuration
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLocation('/recovery')} data-testid="menu-item-data-recovery">
              <Trash2 className="mr-3 h-4 w-4" />
              Data Recovery
            </DropdownMenuItem>
            <DropdownMenuItem onClick={toggleTheme} data-testid="menu-item-settings">
              <Sliders className="mr-3 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDisconnect} data-testid="menu-item-disconnect">
              <LogOut className="mr-3 h-4 w-4" />
              Disconnect
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive" data-testid="menu-item-sign-out">
              <LogOut className="mr-3 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <ConfigurationDialog
        isOpen={configDialogOpen}
        onClose={() => setConfigDialogOpen(false)}
      />
    </>
  );
}
