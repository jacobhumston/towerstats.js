import { routes } from './url.js';
import { endpoints } from './endpoints.js';
import type { BadgeId, UserId } from './types.js';
import { CacheManager, type CacheConfig } from './cache.js';

/**
 * An array of checked badges.
 */
export type CheckedBadges = Array<
    { id: number; owned: false; earnedDate: null } | { id: number; owned: true; earnedDate: Date }
>;

/**
 * An array of user IDs.
 * **Note:** These user IDs are strings.
 */
export type UserIdsArray = Array<string>;

/** TowerStats API client. */
export class TowerStatsClient {
    /** API key of this client. */
    #apiKey: string;

    /** API routes of this client. */
    #routes: typeof routes;

    /** This client's cache manager. */
    cache: CacheManager;

    /**
     * Create a new TowerStats client.
     * @param apiKey Your TowerStats API key.
     * @param cacheConfig Cache config for this client.
     * @param apiRoutes The API routes to use. Defaults to the official TowerStats API routes.
     */
    constructor(apiKey: string, cacheConfig?: Partial<CacheConfig>, apiRoutes: typeof routes = routes) {
        this.#apiKey = apiKey;
        this.#routes = apiRoutes;

        this.cache = new CacheManager(cacheConfig);
    }

    /**
     * Get the TowerStats API key provided to the client.
     * @returns The API key.
     */
    getAPIKey(): string {
        return this.#apiKey;
    }

    /**
     * Swap the current API key with a different one.
     */
    swapAPIKey(apiKey: string): void {
        this.#apiKey = apiKey;
    }

    /**
     * Get the routes of this client.
     * @returns The routes.
     */
    getRoutes(): typeof routes {
        return this.#routes;
    }

    /**
     * Check a user's badges.
     * @param userId The Roblox user ID.
     * @param badgeIds An array of badge IDs to check if the user owns them.
     * @returns An array of checked badge objects specifying whether the user owns that badge or not. (If they do, it includes the date of which they earned the badge.)
     */
    async checkBadges(userId: UserId, badgeIds: Array<BadgeId>): Promise<CheckedBadges> {
        const allCachedBadges = this.cache.get<CheckedBadges>('badges', userId.toString()) ?? [];
        const cachedBadges = (allCachedBadges ?? []).filter((badge) => badgeIds.includes(badge.id));
        const badgesToCheck = badgeIds.filter((id) => cachedBadges.find((b) => b.id === id) === undefined);
        const results: CheckedBadges = [];
        results.push(...cachedBadges);
        if (badgesToCheck.length > 0) {
            const response = await endpoints.badges(
                this.#apiKey,
                userId,
                badgeIds.filter((id) => cachedBadges.find((b) => b.id === id) === undefined),
                this.#routes
            );
            for (const id of badgeIds) {
                const data = response.find((b) => b[0] === id);
                if (data && typeof data[1] === 'string') {
                    results.push({ id, owned: true, earnedDate: new Date(data[1]) });
                } else {
                    results.push({ id, owned: false, earnedDate: null });
                }
            }
            allCachedBadges.push(...results);
        }
        this.cache.set('badges', userId.toString(), allCachedBadges);
        return results;
    }

    /**
     * Get a user's followers list.
     * @param userId The Roblox user ID.
     * @returns An array of Roblox user IDs.
     */
    async getFollowers(userId: UserId): Promise<UserIdsArray> {
        if (this.cache.has('followers', userId.toString()))
            return this.cache.get<UserIdsArray>('followers', userId.toString()) ?? [];
        const response = await endpoints.followers(this.#apiKey, userId, this.#routes);
        this.cache.set('followers', userId.toString(), response);
        return response;
    }

    /**
     * Get a user's following list.
     * @param userId The Roblox user ID.
     * @returns An array of Roblox user IDs.
     */
    async getFollowing(userId: UserId): Promise<UserIdsArray> {
        if (this.cache.has('following', userId.toString()))
            return this.cache.get<UserIdsArray>('following', userId.toString()) ?? [];
        const response = await endpoints.following(this.#apiKey, userId, this.#routes);
        this.cache.set('following', userId.toString(), response);
        return response;
    }
}
