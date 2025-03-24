import { cacheManager } from '../cache';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  duration?: number;
  timestamp: number;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationOptions {
  title?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export class NotificationManager {
  private static instance: NotificationManager;
  private notifications: Map<string, Notification> = new Map();
  private listeners: Set<(notifications: Notification[]) => void> = new Set();
  private readonly MAX_NOTIFICATIONS = 5;
  private readonly DEFAULT_DURATION = 5000;

  private constructor() {
    this.loadNotifications();
    this.setupCleanupInterval();
  }

  static getInstance(): NotificationManager {
    if (!this.instance) {
      this.instance = new NotificationManager();
    }
    return this.instance;
  }

  private async loadNotifications() {
    const cached = await cacheManager.get<Notification[]>('notifications');
    if (cached) {
      cached.forEach(notification => {
        this.notifications.set(notification.id, notification);
      });
      this.notifyListeners();
    }
  }

  private setupCleanupInterval() {
    setInterval(() => {
      const now = Date.now();
      let changed = false;

      this.notifications.forEach((notification, id) => {
        if (notification.duration && now - notification.timestamp > notification.duration) {
          this.notifications.delete(id);
          changed = true;
        }
      });

      if (changed) {
        this.notifyListeners();
        this.persistNotifications();
      }
    }, 1000);
  }

  public show(
    type: NotificationType,
    message: string,
    options: NotificationOptions = {}
  ): string {
    const id = crypto.randomUUID();
    const notification: Notification = {
      id,
      type,
      message,
      title: options.title,
      duration: options.duration ?? this.DEFAULT_DURATION,
      timestamp: Date.now(),
      read: false,
      action: options.action
    };

    this.notifications.set(id, notification);
    this.pruneOldNotifications();
    this.notifyListeners();
    this.persistNotifications();

    return id;
  }

  public success(message: string, options?: NotificationOptions): string {
    return this.show('success', message, options);
  }

  public info(message: string, options?: NotificationOptions): string {
    return this.show('info', message, options);
  }

  public warning(message: string, options?: NotificationOptions): string {
    return this.show('warning', message, options);
  }

  public error(message: string, options?: NotificationOptions): string {
    return this.show('error', message, { ...options, duration: 0 });
  }

  public dismiss(id: string): void {
    if (this.notifications.delete(id)) {
      this.notifyListeners();
      this.persistNotifications();
    }
  }

  public markAsRead(id: string): void {
    const notification = this.notifications.get(id);
    if (notification && !notification.read) {
      notification.read = true;
      this.notifyListeners();
      this.persistNotifications();
    }
  }

  public clear(): void {
    this.notifications.clear();
    this.notifyListeners();
    this.persistNotifications();
  }

  public subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.add(listener);
    listener(this.getNotifications());

    return () => {
      this.listeners.delete(listener);
    };
  }

  public getNotifications(): Notification[] {
    return Array.from(this.notifications.values())
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  private notifyListeners(): void {
    const notifications = this.getNotifications();
    this.listeners.forEach(listener => listener(notifications));
  }

  private pruneOldNotifications(): void {
    const notifications = this.getNotifications();
    if (notifications.length > this.MAX_NOTIFICATIONS) {
      const toRemove = notifications
        .filter(n => n.read || (n.duration && n.duration > 0))
        .slice(this.MAX_NOTIFICATIONS);

      toRemove.forEach(n => this.notifications.delete(n.id));
    }
  }

  private async persistNotifications(): Promise<void> {
    await cacheManager.set('notifications', this.getNotifications());
  }
}