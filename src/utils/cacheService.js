/**
 * In-memory cache service with TTL (Time To Live) expiry
 * Used to cache summary data to avoid recomputation
 */

class CacheService {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Set a value in cache with optional TTL (milliseconds)
   * If TTL is not provided, cache never expires (unless manually cleared)
   */
  set(key, value, ttl = null) {
    const entry = {
      value,
      timestamp: Date.now()
    };

    // If TTL is provided, set an expiration timeout
    if (ttl) {
      entry.expiresAt = Date.now() + ttl;
      entry.timeout = setTimeout(() => {
        this.cache.delete(key);
      }, ttl);
    }

    // If key already exists, clear its timeout
    if (this.cache.has(key) && this.cache.get(key).timeout) {
      clearTimeout(this.cache.get(key).timeout);
    }

    this.cache.set(key, entry);
  }

  /**
   * Get a value from cache
   * Returns null if key doesn't exist or has expired
   */
  get(key) {
    if (!this.cache.has(key)) {
      return null;
    }

    const entry = this.cache.get(key);

    // Check if expired
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  /**
   * Check if a key exists and is not expired
   */
  has(key) {
    return this.get(key) !== null;
  }

  /**
   * Delete a key from cache
   */
  delete(key) {
    if (this.cache.has(key) && this.cache.get(key).timeout) {
      clearTimeout(this.cache.get(key).timeout);
    }
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear() {
    this.cache.forEach((entry) => {
      if (entry.timeout) {
        clearTimeout(entry.timeout);
      }
    });
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        expiresAt: entry.expiresAt || null,
        expiresIn: entry.expiresAt ? entry.expiresAt - Date.now() : null
      }))
    };
  }
}

// Export singleton instance
export default new CacheService();
