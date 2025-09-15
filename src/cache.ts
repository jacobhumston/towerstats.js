/**
 * Cache configuration.
 */
export type CacheConfig = {
    /** Whether the cache should be enabled or not. Default is `true`. */
    enabled: boolean;
    /** Sweeper interval in milliseconds. Default is `1000`. */
    sweeperInterval: number;
    /** Individual item lifespan in milliseconds. Default is `3 * 60 * 1000`. (3 Minutes)*/
    lifespan: number;
};

/** Memory based cache management. */
export class CacheManager {
    /** Cache manager config. */
    #config: CacheConfig;
    /** Cache manager sweeper ID. */
    #sweeperId: ReturnType<typeof setInterval> | null = null;
    /** Cache manager storage. */
    #store: Map<string, Map<string, { value: any; timestamp: number }>> = new Map();

    /**
     * Create a cache manager.
     * @param config The configuration for this cache manager.
     */
    constructor(config?: Partial<CacheConfig>) {
        const cacheConfigDefaults: CacheConfig = {
            enabled: true,
            sweeperInterval: 1000,
            lifespan: 3 * 60 * 1000,
        };

        this.#config = Object.assign(cacheConfigDefaults, config ?? {});
        this.startSweeper();
    }

    /**
     * Start this cache manager's sweeper.
     */
    startSweeper(): void {
        if (this.#config.enabled === false) return;
        this.stopSweeper();
        this.#sweeperId = setInterval(() => {
            this.#store.forEach((namespace) => {
                namespace.forEach((data, entry) => {
                    if (Date.now() - data.timestamp > this.#config.lifespan) namespace.delete(entry);
                });
            });
        }, this.#config.sweeperInterval);
    }

    /**
     * Stop this cache manager's sweeper.
     */
    stopSweeper(): void {
        if (this.#config.enabled === false) return;
        if (this.#sweeperId) clearInterval(this.#sweeperId);
    }

    /**
     * Get a namespace.
     * @param name The name of the namespace to get.
     * @returns The created or preexisting namespace.
     */
    #getNamespace(name: string): Map<string, { value: any; timestamp: number }> {
        let namespace;
        if (!this.#store.has(name)) {
            this.#store.set(name, new Map());
            namespace = this.#store.get(name);
        } else {
            namespace = this.#store.get(name);
        }
        return namespace as any;
    }

    /**
     * Get an item from the cache.
     * @param namespace The namespace of which this item resides in.
     * @param key The key of this item.
     * @returns The value, if present.
     */
    get<T>(namespace: string, key: string): T | null {
        if (this.#config.enabled === false) return null;
        const ns = this.#getNamespace(namespace);
        if (!ns.has(key)) return null;
        const data = ns.get(key);
        if (!data) return null;
        if (Date.now() - data.timestamp > this.#config.lifespan) {
            ns.delete(key);
            return null;
        }
        return data.value;
    }

    /**
     * Set an item's value in the cache.
     * @param namespace The namespace of which this item resides in.
     * @param key The key of this item.
     * @param value The new value for this item.
     */
    set(namespace: string, key: string, value: any): void {
        if (this.#config.enabled === false) return;
        const ns = this.#getNamespace(namespace);
        ns.set(key, { value, timestamp: Date.now() });
    }

    /**
     * Check if an item is currently present in a namespace or not.
     * @param namespace The namespace to check in.
     * @param key The key of the item to look for.
     * @returns Boolean indicating whether the namespace has the requested item or not.
     */
    has(namespace: string, key: string): boolean {
        if (this.#config.enabled === false) return false;
        const ns = this.#getNamespace(namespace);
        return ns.has(key);
    }
}
