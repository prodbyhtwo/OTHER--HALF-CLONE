import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

// Import custom styles
import './styles/global.css';

// Import components and pages
import { Layout } from './components/Layout';
import Landing from './pages/Landing';
import { ROUTES } from './lib/constants';

// Placeholder components for remaining pages
import { OnboardingWizard } from './pages/OnboardingWizard';
import { Dashboard } from './pages/Dashboard';
import { Discover } from './pages/Discover';
import { Messages } from './pages/Messages';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Churches } from './pages/Churches';
import { LearningHub } from './pages/LearningHub';
import { Games } from './pages/Games';
import { Planner } from './pages/Planner';
import { AgentChat } from './pages/AgentChat';
import { AdminDashboard } from './pages/AdminDashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      }
    }
  }
});

export function OtherHalfApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path={ROUTES.LANDING} element={<Landing />} />
              
              {/* Onboarding */}
              <Route path={`${ROUTES.ONBOARDING}/*`} element={<OnboardingWizard />} />
              
              {/* Protected Routes */}
              <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
              <Route path={ROUTES.DISCOVER} element={<Discover />} />
              <Route path={ROUTES.MESSAGES} element={<Messages />} />
              <Route path={ROUTES.PROFILE} element={<Profile />} />
              <Route path={ROUTES.SETTINGS} element={<Settings />} />
              <Route path={ROUTES.CHURCHES} element={<Churches />} />
              <Route path={ROUTES.LEARNING} element={<LearningHub />} />
              <Route path={ROUTES.GAMES} element={<Games />} />
              <Route path={ROUTES.PLANNER} element={<Planner />} />
              <Route path={ROUTES.AGENT} element={<AgentChat />} />
              
              {/* Admin Routes */}
              <Route path={`${ROUTES.ADMIN}/*`} element={<AdminDashboard />} />
              
              {/* Fallback */}
              <Route path="*" element={<Landing />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default OtherHalfApp;
