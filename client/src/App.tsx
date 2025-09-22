import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { SupabaseProvider } from "@/contexts/SupabaseProvider";
import { useEffect, useState } from "react";
import { authSupabase } from "@/lib/supabase-auth";
import type { User } from "@supabase/supabase-js";

// Pages
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import SendGuard from "@/pages/sendguard";
import ManualReply from "@/pages/manual-reply";
import Escalation from "@/pages/escalation";
import Important from "@/pages/important";
import Recovery from "@/pages/recovery";
import NotFound from "@/pages/not-found";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    authSupabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = authSupabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background" data-testid="loading-auth">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={Dashboard} />
      <Route path="/sendguard" component={SendGuard} />
      <Route path="/manual-reply" component={ManualReply} />
      <Route path="/escalation" component={Escalation} />
      <Route path="/important" component={Important} />
      <Route path="/recovery" component={Recovery} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SupabaseProvider>
          <TooltipProvider>
            <AuthGuard>
              <Router />
            </AuthGuard>
            <Toaster />
          </TooltipProvider>
        </SupabaseProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
