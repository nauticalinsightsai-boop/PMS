'use client'

import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';
import type { Notification } from '@/types/notification';

interface NotificationContextType {
 notifications: Notification[];
 addNotification: (type: 'success' | 'info' | 'warning' | 'error', message: string) => void;
 dismissNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
 const [notifications, setNotifications] = useState<Notification[]>([]);

 const addNotification = useCallback((type: 'success' | 'info' | 'warning' | 'error', message: string) => {
  const id = Date.now().toString();
  setNotifications(prev => [...prev, { id, type, message }]);
  setTimeout(() => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, 5000);
 }, []);

 const dismissNotification = useCallback((id: string) => {
  setNotifications(prev => prev.filter(n => n.id !== id));
 }, []);

 const value = useMemo(() => ({
   notifications,
   addNotification,
   dismissNotification
 }), [notifications, addNotification, dismissNotification]);

 return (
  <NotificationContext.Provider value={value}>
   {children}
   
   {/* Global Notification Toast Container */}
   <div
    className="fixed bottom-6 right-4 sm:right-6 z-modal-toast flex flex-col gap-2"
    aria-live="polite"
    aria-relevant="additions"
   >
     {notifications.map(n => (
       <div
        key={n.id}
        role={n.type === 'error' ? 'alert' : 'status'}
        className={`p-4 r-card-sm shadow-xl border text-toast animate-in slide-in-from-right-10 fade-in duration-300 flex items-center justify-between w-[calc(100vw-3rem)] sm:min-w-[300px] sm:w-auto max-w-[calc(100vw-3rem)] sm:max-w-[400px] z-modal-toast border-brand-border ${
         n.type === 'success' ? 'bg-brand-success-bg text-brand-success-text' :
         n.type === 'warning' ? 'bg-brand-warn-bg text-brand-warn-text' :
         n.type === 'error' ? 'bg-brand-danger-bg text-brand-danger-text' :
         'bg-brand-info-bg text-brand-info-text'
       }`}>
         <span>{n.message}</span>
         <button
          type="button"
          onClick={() => dismissNotification(n.id)}
          className="ml-4 opacity-50 hover:opacity-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Dismiss notification"
         >
          ×
         </button>
       </div>
     ))}
   </div>
  </NotificationContext.Provider>
 );
};

const defaultNotificationContext: NotificationContextType = {
 notifications: [],
 addNotification: () => {},
 dismissNotification: () => {},
};

export const useNotification = () => {
 const context = useContext(NotificationContext);
 if (!context) {
  if (typeof window === 'undefined') {
   return defaultNotificationContext;
  }
  console.warn('NotificationProvider not available, using default context');
  return defaultNotificationContext;
 }
 return context;
};


















