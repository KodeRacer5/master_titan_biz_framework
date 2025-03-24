import { useState, useEffect } from 'react';
import { NotificationManager } from '../utils/notify/NotificationManager';

export function useAuth() {
  const [user, setUser] = useState<null>(null);
  const [loading, setLoading] = useState(false);
  const notificationManager = NotificationManager.getInstance();

  // Basic auth state management
  useEffect(() => {
    setLoading(false);
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
      setUser(null);
      notificationManager.success('Signed out successfully');
    } catch (error) {
      notificationManager.error(
        error instanceof Error ? error.message : 'Failed to sign out'
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    signOut
  };
}