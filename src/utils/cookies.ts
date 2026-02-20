/**
 * Cookie utility functions for managing JWT tokens in cookies
 */

export const COOKIE_NAME = 'token';

/**
 * Get a cookie value by name
 */
export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
};

/**
 * Set a cookie with the given name, value, and options
 */
export const setCookie = (
  name: string, 
  value: string, 
  options: {
    days?: number;
    path?: string;
    sameSite?: 'strict' | 'lax' | 'none';
  } = {}
): void => {
  if (typeof document === 'undefined') return;
  
  const { days = 7, path = '/', sameSite = 'lax' } = options;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  
  const encodedValue = encodeURIComponent(value);
  document.cookie = `${name}=${encodedValue};expires=${expires.toUTCString()};path=${path};sameSite=${sameSite}`;
};

/**
 * Delete a cookie by name
 */
export const deleteCookie = (name: string, path: string = '/'): void => {
  if (typeof document === 'undefined') return;
  
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path}`;
};

/**
 * Get the JWT token from cookies
 */
export const getTokenFromCookies = (): string | null => {
  return getCookie(COOKIE_NAME);
};

/**
 * Check if token exists in cookies
 */
export const hasTokenInCookies = (): boolean => {
  return getTokenFromCookies() !== null;
};
