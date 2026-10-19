export interface Donor { userID: string; name: string; bloodGroup: string; district: string; available: boolean; consentAt: string }
export interface Appeal { id: string; unitID: string | null; unitName: string; district: string; bloodGroup: string; urgency: string; quantity: number; status: string; createdAt: string; expiresAt: string; address?: string }
export interface Visit { id: string; appealID: string; visitDay: string; status: string; confirmedAt: string | null }
export interface Membership { userID: string; unitID: string | null; role: string }
export interface Application { userID: string; unitName: string; district: string; address: string; professionalEmail: string; status: string }
export interface Dashboard { profile: Donor | null; membership: Membership | null; application: Application | null; appeals: Appeal[]; visits: { response: Visit; appeal: Appeal }[] }
export interface Workspace { needs: Appeal[]; applications: Application[]; units: { id: string; name: string }[]; reports: { id: string; appealID: string; reason: string }[]; participants: { response: Visit; donorName: string; bloodGroup: string; appeal: Appeal }[]; role: string }
export interface AuthUser { id: string; name?: string; email: string }
export interface NotificationState { hasPermission: boolean; permissionDenied: boolean; loading: boolean; isWeb: boolean; requestPermission: () => Promise<boolean>; sendTag: (key: string, value: string) => void; deleteTag: (key: string) => void }
export type PreferenceKey = 'urgent' | 'campaigns' | 'visits';
export interface Preferences { urgent: boolean; campaigns: boolean; visits: boolean; district: string; group: string; setPreference: (key: PreferenceKey, value: boolean) => void; setFilters: (district: string, group: string) => void }
