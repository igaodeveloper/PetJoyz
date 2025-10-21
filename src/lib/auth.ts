export const AUTH_KEY = 'petjoyz_admin_token';

export function setAuthToken(token: string) {
  localStorage.setItem(AUTH_KEY, token);
}

export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_KEY);
}

export function clearAuthToken() {
  localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated() {
  return !!getAuthToken();
}
