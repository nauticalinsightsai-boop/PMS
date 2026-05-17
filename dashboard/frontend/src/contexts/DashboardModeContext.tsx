import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  SOCIAL_ROUTE_PREFIXES, 
  BOOKINGS_ROUTE_PREFIXES, 
  WEBSITE_ROUTE_PREFIXES 
} from '../constants/dashboardRoutes';

export type DashboardMode = 'social' | 'bookings' | 'website';

interface DashboardModeContextType {
  mode: DashboardMode;
  setMode: (mode: DashboardMode) => void;
}

const DashboardModeContext = createContext<DashboardModeContextType | undefined>(undefined);

export const DashboardModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<DashboardMode>('website');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname;
    
    if (SOCIAL_ROUTE_PREFIXES.some(prefix => path.startsWith(prefix))) {
      setMode('social');
    } else if (BOOKINGS_ROUTE_PREFIXES.some(prefix => path.startsWith(prefix))) {
      setMode('bookings');
    } else if (WEBSITE_ROUTE_PREFIXES.some(prefix => path.startsWith(prefix))) {
      setMode('website');
    }
  }, [location.pathname]);

  const handleSetMode = (newMode: DashboardMode) => {
    setMode(newMode);
    // Redirect to default page for mode if not already in that section
    if (newMode === 'social') navigate('/dashboard/control-tower');
    if (newMode === 'bookings') navigate('/dashboard/members-revenue');
    if (newMode === 'website') navigate('/dashboard/site-system/home');
  };

  return (
    <DashboardModeContext.Provider value={{ mode, setMode: handleSetMode }}>
      {children}
    </DashboardModeContext.Provider>
  );
};

export const useDashboardMode = () => {
  const context = useContext(DashboardModeContext);
  if (!context) {
    throw new Error('useDashboardMode must be used within a DashboardModeProvider');
  }
  return context;
};
