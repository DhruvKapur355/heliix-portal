import { useState, useCallback } from 'react';

export interface AuthUser {
  email: string;
  name: string;
  initials: string;
}

const STORAGE_KEY = 'heliix_auth';
const ACCOUNTS_KEY = 'heliix_accounts';

interface StoredAccount {
  email: string;
  password: string;
  name: string;
}

function getAccounts(): StoredAccount[] {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveAccount(account: StoredAccount) {
  const accounts = getAccounts();
  accounts.push(account);
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback(
    (email: string, password: string): string | null => {
      const accounts = getAccounts();
      const match = accounts.find(
        (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
      );
      if (!match) return 'Incorrect email or password.';
      const authUser: AuthUser = { email: match.email, name: match.name, initials: getInitials(match.name) };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
      setUser(authUser);
      return null;
    },
    []
  );

  const signup = useCallback(
    (email: string, password: string, name: string): string | null => {
      const accounts = getAccounts();
      if (accounts.some((a) => a.email.toLowerCase() === email.toLowerCase())) {
        return 'An account with this email already exists.';
      }
      const account: StoredAccount = { email, password, name };
      saveAccount(account);
      const authUser: AuthUser = { email, name, initials: getInitials(name) };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
      setUser(authUser);
      return null;
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return { user, login, signup, logout };
}
