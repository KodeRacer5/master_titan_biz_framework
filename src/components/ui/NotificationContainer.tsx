import React, { useEffect, useState } from 'react';
import { Notification as NotificationComponent } from './Notification';
import { NotificationManager, type Notification } from '../../utils/notify/NotificationManager';

export function NotificationContainer() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notificationManager = NotificationManager.getInstance();

  useEffect(() => {
    return notificationManager.subscribe(setNotifications);
  }, []);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed inset-0 z-50 flex items-end px-4 py-6 pointer-events-none sm:p-6"
    >
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        {notifications.map((notification) => (
          <NotificationComponent
            key={notification.id}
            id={notification.id}
            type={notification.type}
            title={notification.title}
            message={notification.message}
            action={notification.action}
            duration={notification.duration}
            onDismiss={(id) => notificationManager.dismiss(id)}
          />
        ))}
      </div>
    </div>
  );
}