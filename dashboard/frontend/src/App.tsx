import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './components/shared/ThemeProvider';
import { DashboardModeProvider } from './contexts/DashboardModeContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Pages
import { Login } from './pages/admin/Login';
import { DashboardHome } from './pages/admin/DashboardHome';
import { InteractionsInbox } from './pages/admin/InteractionsInbox';
import { Settings } from './pages/admin/Settings';
import { WebsiteDataEditor } from './pages/admin/WebsiteData';
import { BlogEditor } from './pages/admin/BlogEditor';
import { NewsletterManagement } from './pages/admin/NewsletterManagement';

// Placeholder common page component
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="space-y-6">
    <h1 className="text-4xl font-black">{title}</h1>
    <div className="p-20 border-2 border-dashed border-white/10 rounded-3xl flex items-center justify-center">
      <p className="text-gw-text-secondary text-sm italic">The {title} module is currently under active development.</p>
    </div>
  </div>
);

export default function App() {
  return (
    <Router>
      <ThemeProvider defaultTheme="dark">
        <AuthProvider>
          <DashboardModeProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              
              {/* Dashboard Private Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <DashboardHome />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              {/* Mode 1 - Social */}
              <Route path="/dashboard/control-tower" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <PlaceholderPage title="Social Control Tower" />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              {/* Mode 2 - Members & Revenue */}
              <Route path="/dashboard/members-revenue/*" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Routes>
                      <Route index element={<PlaceholderPage title="Revenue Overview" />} />
                      <Route path="users" element={<PlaceholderPage title="Users & Leads" />} />
                      <Route path="members" element={<PlaceholderPage title="Members Management" />} />
                      <Route path="bookings" element={<PlaceholderPage title="Client Bookings" />} />
                      <Route path="interactions" element={<InteractionsInbox />} />
                      <Route path="monetization" element={<PlaceholderPage title="Monetization Strategy" />} />
                      <Route path="newsletter" element={<NewsletterManagement />} />
                      <Route path="blogs" element={<BlogEditor />} />
                      <Route path="cta/*" element={<PlaceholderPage title="CTA Engine" />} />
                    </Routes>
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              {/* Mode 3 - Admin Controls */}
              <Route path="/dashboard/site-system/*" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Routes>
                      <Route index element={<PlaceholderPage title="Admin Center" />} />
                      <Route path="home" element={<PlaceholderPage title="Home CMS" />} />
                      <Route path="website-data" element={<WebsiteDataEditor />} />
                      <Route path="service-scopes" element={<PlaceholderPage title="Service Engagement" />} />
                      <Route path="portfolio" element={<PlaceholderPage title="Portfolio Gallery" />} />
                      <Route path="insights" element={<PlaceholderPage title="Insights / Blog" />} />
                      <Route path="media" element={<PlaceholderPage title="Media Production" />} />
                      <Route path="media-library" element={<PlaceholderPage title="Global Media Vault" />} />
                      <Route path="security" element={<PlaceholderPage title="Security & Audit" />} />
                      <Route path="seo" element={<PlaceholderPage title="SEO Control" />} />
                      <Route path="settings" element={<Settings />} />
                      <Route path="discovery-call-email" element={<PlaceholderPage title="Booking Email Template" />} />
                    </Routes>
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              <Route path="/dashboard/migrate" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <PlaceholderPage title="System Migration" />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              {/* Fallbacks */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </DashboardModeProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}
