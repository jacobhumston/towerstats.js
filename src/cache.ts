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

export class CacheManager {
    #config: CacheConfig;
    #sweeperId: ReturnType<typeof setInterval> | null = null;

    constructor(config?: Partial<CacheConfig>) {
        const cacheConfig: CacheConfig = {
            enabled: true,
            sweeperInterval: 1000,
            lifespan: 3 * 60 * 1000,
        };

        this.#config = Object.assign(config ?? {}, cacheConfig);
    }

    startSweeper() {
        this.#sweeperId = setInterval(() => {}, this.#config.sweeperInterval);
    }

    stopSweeper() {
        if (this.#sweeperId) clearInterval(this.#sweeperId);
    }
}
