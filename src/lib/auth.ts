import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import { jwtClient } from 'better-auth/client/plugins';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
export const AUTH_URL = 'https://auth-6bef3980-a03c-4d87-8c44-a2af03aa6b81-dev.api-dev.newlyapp.com';
export const API_URL = 'https://api-6bef3980-a03c-4d87-8c44-a2af03aa6b81-dev.api-dev.newlyapp.com';
const SCHEME = 'expobase';
const PREFIX = 'newly';
const memory = new Map<string, string>();
let keychainAvailable = true;
export const tokenStorage = {
  getItem(key: string): string | null {
    if (Platform.OS === 'web') { try { return localStorage.getItem(key); } catch { return memory.get(key) ?? null; } }
    if (keychainAvailable) { try { return SecureStore.getItem(key); } catch { keychainAvailable = false; } }
    return memory.get(key) ?? null;
  },
  setItem(key: string, value: string): void {
    memory.set(key, value);
    if (Platform.OS === 'web') { try { localStorage.setItem(key, value); } catch {} return; }
    if (keychainAvailable) { try { SecureStore.setItem(key, value); } catch { keychainAvailable = false; } }
  },
  async getItemAsync(key: string) { return tokenStorage.getItem(key); },
  async setItemAsync(key: string, value: string) { tokenStorage.setItem(key, value); },
  async deleteItem(key: string) {
    memory.delete(key);
    if (Platform.OS === 'web') { try { localStorage.removeItem(key); } catch {} return; }
    if (keychainAvailable) { try { await SecureStore.deleteItemAsync(key); } catch { keychainAvailable = false; } }
  },
};
export const authClient = createAuthClient({ baseURL: AUTH_URL, plugins: [expoClient({ scheme: SCHEME, storagePrefix: PREFIX, storage: tokenStorage }), jwtClient()], fetchOptions: { onSuccess(context) { const jwt = context.response.headers.get('set-auth-jwt'); if (jwt) tokenStorage.setItem(`${PREFIX}_jwt`, jwt); const bearer = context.response.headers.get('set-auth-token'); if (bearer) tokenStorage.setItem(`${PREFIX}_bearer`, bearer); } } });
export function getBearerToken() { return tokenStorage.getItem(`${PREFIX}_jwt`) ?? tokenStorage.getItem(`${PREFIX}_bearer`); }
export async function refreshJWT() { const { data } = await authClient.token(); if (!data?.token) return null; tokenStorage.setItem(`${PREFIX}_jwt`, data.token); return data.token; }
export async function clearTokens() { await tokenStorage.deleteItem(`${PREFIX}_jwt`); await tokenStorage.deleteItem(`${PREFIX}_bearer`); }
