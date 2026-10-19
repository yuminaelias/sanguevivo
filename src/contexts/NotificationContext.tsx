import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { NotificationState } from '@/features/sangue/types/sangue';
const context = createContext<NotificationState>({ hasPermission: false, permissionDenied: false, loading: false, isWeb: true, requestPermission: async () => false, sendTag: () => {}, deleteTag: () => {} });
export function NotificationProvider({ children }: { children: ReactNode }) { return <context.Provider value={{ hasPermission: false, permissionDenied: false, loading: false, isWeb: true, requestPermission: async () => false, sendTag: () => {}, deleteTag: () => {} }}>{children}</context.Provider>; }
export function useNotifications() { return useContext(context); }
