import { useState, useEffect } from 'react';

interface CacheConfig {
  version: string;
  ttl: number; // Time to live in milliseconds
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const DEFAULT_CONFIG: CacheConfig = {
  version: '1.0',
  ttl: 1000 * 60 * 60 // 1 hour
};

// Memory fallback when localStorage is unavailable
const memoryStore = new Map<string, string>();

const storageFallback = {
  getItem: (key: string): string | null => memoryStore.get(key) || null,
  setItem: (key: string, value: string): void => memoryStore.set(key, value),
  removeItem: (key: string): void => memoryStore.delete(key),
  clear: (): void => memoryStore.clear()
};

class CacheManager {
  private static instance: CacheManager;
  private config: CacheConfig;
  private memoryCache: Map<string, CacheItem<any>>;
  private storage: typeof localStorage;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.memoryCache = new Map();
    this.storage = this.getStorageImplementation();
  }

  private getStorageImplementation() {
    if (typeof window !== 'undefined') {
      try {
        // Test localStorage availability
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return localStorage;
      } catch (e) {
        console.warn('localStorage not available, using memory storage');
        return storageFallback;
      }
    }
    return storageFallback;
  }

  static getInstance(config?: Partial<CacheConfig>): CacheManager {
    if (!this.instance) {
      this.instance = new CacheManager(config);
    }
    return this.instance;
  }

  async set<T>(key: string, data: T): Promise<void> {
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now()
    };

    // Store in memory
    this.memoryCache.set(key, cacheItem);

    // Store in persistent storage
    try {
      this.storage.setItem(
        this.getStorageKey(key),
        JSON.stringify(cacheItem)
      );
    } catch (error) {
      console.warn('Failed to store in persistent storage:', error);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    // Try memory cache first
    const memoryItem = this.memoryCache.get(key);
    if (memoryItem && !this.isExpired(memoryItem)) {
      return memoryItem.data;
    }

    // Try persistent storage
    try {
      const stored = this.storage.getItem(this.getStorageKey(key));
      if (stored) {
        const item: CacheItem<T> = JSON.parse(stored);
        if (!this.isExpired(item)) {
          // Update memory cache
          this.memoryCache.set(key, item);
          return item.data;
        }
      }
    } catch (error) {
      console.warn('Failed to retrieve from persistent storage:', error);
    }

    return null;
  }

  async clear(key?: string): Promise<void> {
    if (key) {
      // Clear specific key
      this.memoryCache.delete(key);
      this.storage.removeItem(this.getStorageKey(key));
    } else {
      // Clear all cache
      this.memoryCache.clear();
      
      try {
        // Clear only our cache items from storage
        const keys = this.getCachedKeys();
        keys.forEach(key => {
          this.storage.removeItem(this.getStorageKey(key));
        });
      } catch (error) {
        console.warn('Failed to clear persistent storage:', error);
      }
    }
  }

  async clearAll(): Promise<void> {
    // Clear both memory and storage completely
    this.memoryCache.clear();
    try {
      this.storage.clear();
    } catch (error) {
      console.warn('Failed to clear storage:', error);
    }
  }

  private isExpired(item: CacheItem<any>): boolean {
    return Date.now() - item.timestamp > this.config.ttl;
  }

  private getStorageKey(key: string): string {
    return `titan_cache_${this.config.version}_${key}`;
  }

  public getCachedKeys(): string[] {
    const keys: string[] = [];
    const prefix = `titan_cache_${this.config.version}_`;
    
    try {
      // Get keys from persistent storage
      if (this.storage === localStorage) {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith(prefix)) {
            keys.push(key.replace(prefix, ''));
          }
        }
      } else {
        // Get keys from memory store
        for (const key of memoryStore.keys()) {
          if (key.startsWith(prefix)) {
            keys.push(key.replace(prefix, ''));
          }
        }
      }
    } catch (error) {
      console.warn('Failed to get cached keys:', error);
    }
    
    return keys;
  }
}

// Create singleton instance
export const cacheManager = new CacheManager();

// React hook for cache management
export function useCache<T>(key: string, initialData?: T) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const cached = await cacheManager.get<T>(key);
        if (cached) {
          setData(cached);
        } else if (initialData) {
          await cacheManager.set(key, initialData);
          setData(initialData);
        }
      } catch (error) {
        console.error('Cache error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [key, initialData]);

  const updateCache = async (newData: T) => {
    try {
      await cacheManager.set(key, newData);
      setData(newData);
    } catch (error) {
      console.error('Failed to update cache:', error);
    }
  };

  const clearCache = async () => {
    try {
      await cacheManager.clear(key);
      setData(null);
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  };

  return { data, loading, updateCache, clearCache };
}