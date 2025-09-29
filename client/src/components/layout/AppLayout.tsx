import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  lastUpdated?: string;
}

export function AppLayout({ children, title, lastUpdated }: AppLayoutProps) {
  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden" data-testid="app-layout">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header title={title} lastUpdated={lastUpdated} />
        <main className="flex-1 overflow-auto p-3 sm:p-4 lg:p-6" data-testid="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
