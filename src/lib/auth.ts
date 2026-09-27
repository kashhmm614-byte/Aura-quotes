import type { AuraUser } from '../types';

const GOOGLE_CLIENT_ID = '1046400810342-demelk19ae49o62p58d1v2vggqtr7en5.apps.googleusercontent.com';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          renderButton: (el: HTMLElement, config: Record<string, unknown>) => void;
          prompt: () => void;
        };
      };
    };
  }
}

function decodeJwt(token: string): Record<string, string> {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const json = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(json);
}

function generateUid10(): string {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

export function getStoredUser(): AuraUser | null {
  const data = localStorage.getItem('aura_user');
  return data ? JSON.parse(data) : null;
}

export function clearStoredUser() {
  localStorage.removeItem('aura_user');
}

export function initGoogleAuth(
  buttonEl: HTMLElement,
  onSuccess: (user: AuraUser) => void
) {
  if (!window.google) {
    console.warn('Google Identity Services not loaded yet');
    return;
  }

  window.google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: (response: { credential: string }) => {
      const payload = decodeJwt(response.credential);
      const user: AuraUser = {
        uid: generateUid10(),
        google_id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      };
      localStorage.setItem('aura_user', JSON.stringify(user));
      onSuccess(user);
    },
  });

  window.google.accounts.id.renderButton(buttonEl, {
    theme: 'filled_black',
    size: 'large',
    shape: 'pill',
    width: 280,
  });
}
