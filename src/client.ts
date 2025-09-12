import { routes } from './url.js';
import { endpoints } from './endpoints.js';
import type { BadgeId, UserId } from './types.js';

/**
 * An array of checked badges.
 */
export type CheckedBadges = Array<
    { id: number; owned: false; earnedDate: null } | { id: number; owned: true; earnedDate: Date }
>;

/** TowerStats API client. */
export class TowerStatsClient {
    /** API key of this client. */
    #apiKey: string;

    /** API routes of this client. */
    #routes: typeof routes;

    /**
     * Create a new TowerStats client.
     * @param apiKey Your TowerStats API key.
     * @param apiRoutes The API routes to use. Defaults to the official TowerStats API routes.
     */
    constructor(apiKey: string, apiRoutes: typeof routes = routes) {
        this.#apiKey = apiKey;
        this.#routes = apiRoutes;
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
        const response = await endpoints.badges(this.#apiKey, userId, badgeIds, this.#routes);
        const results: CheckedBadges = [];
        for (const id of badgeIds) {
            const data = response.find((b) => b[0] === id);
            if (data && typeof data[1] === 'string') {
                results.push({ id, owned: true, earnedDate: new Date(data[1]) });
            } else {
                results.push({ id, owned: false, earnedDate: null });
            }
        }
        return results;
    }
}
