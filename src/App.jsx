import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { SelectedServicesProvider } from './context/SelectedServicesContext';
import { Suspense } from 'react';
import Index from './pages/Index';
import Notes from './pages/Notes';
import Settings from './pages/Settings';
import Subscriptions from './pages/Subscriptions';
import Analytics from './pages/Analytics';
import TemplateAndServiceManagement from './pages/TemplateAndServiceManagement';
import ErrorBoundary from './components/ErrorBoundary';

const queryClient = new QueryClient();

const App = () => {
  return (
    <ErrorBoundary>
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <SelectedServicesProvider>
              <Toaster />
              <BrowserRouter>
                <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
                  <div className="animate-pulse text-lg">読み込み中...</div>
                </div>}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/notes" element={<Notes />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/subscriptions" element={<Subscriptions />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/template-and-service" element={<TemplateAndServiceManagement />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </SelectedServicesProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </I18nextProvider>
    </ErrorBoundary>
  );
};

export default App;