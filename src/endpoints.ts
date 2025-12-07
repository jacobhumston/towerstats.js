import type { BadgeId, UniverseId, UserId } from './types.js';
import { routes } from './url.js';

/**
 * Convenience function for making POST requests to the API.
 * @param apiKey Your API key.
 * @param url The endpoint URL.
 * @param data Data to post.
 * @returns The fetch response.
 */
export async function postRequest(apiKey: string, url: URL, data: any) {
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            apiKey: apiKey,
        },
    });
}

/**
 * Badges response array.
 * Each array in the main array contains `[0]<badgeId>` and `[1]<completionDate>`.
 * Note that unowned badges are not included in the array.
 */
export type BadgesResponse = Array<[BadgeId, string]>;

/**
 * Submit badge data for a Roblox user.
 * @param apiKey Your API key.
 * @param id Roblox user ID.
 * @param badges An array of Roblox badge IDs.
 * @param apiRoutes Optional API route constructor.
 * @returns The badges response.
 */
async function badges(
    apiKey: string,
    id: UserId,
    badges: Array<BadgeId>,
    apiRoutes: typeof routes = routes
): Promise<BadgesResponse> {
    const res = await postRequest(apiKey, apiRoutes.badges, { id, badges });
    if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
    return (await res.json()) as BadgesResponse;
}

/**
 * Game Badges response array.
 * Each array in the main array contains `[0]<badgeId>` and `[1]<completionDate>`.
 * Note that unowned badges are not included in the array.
 */
export type GameBadgesResponse = Array<[BadgeId, string]>;

/**
 * Fetch all badges that a user owns for a specific universe.
 * @param apiKey Your API key.
 * @param id Roblox user ID.
 * @param universeId Roblox universe ID.
 * @param apiRoutes Optional API route constructor.
 * @returns The game badges response.
 */
async function gameBadges(
    apiKey: string,
    id: UserId,
    universeId: UniverseId,
    apiRoutes: typeof routes = routes
): Promise<GameBadgesResponse> {
    const res = await postRequest(apiKey, apiRoutes.gameBadges, { id, universe_id: universeId });
    if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
    return (await res.json()) as GameBadgesResponse;
}

/**
 * Followers response array.
 * **Note:** The array of userIds is a string.
 */
export type FollowersResponse = Array<string>;

/**
 * Fetch all followers for a Roblox user.
 * @param apiKey Your API key.
 * @param id Roblox user ID.
 * @param apiRoutes Optional API route constructor.
 * @returns The followers response.
 */
async function followers(apiKey: string, id: UserId, apiRoutes: typeof routes = routes): Promise<FollowersResponse> {
    const res = await postRequest(apiKey, apiRoutes.followers, { id });
    if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
    return (await res.json()) as FollowersResponse;
}

/**
 * Following response array.
 * **Note:** The array of userIds is a string.
 */
export type FollowingResponse = Array<string>;

/**
 * Fetch all users that a Roblox user is following.
 * @param apiKey Your API key.
 * @param id Roblox user ID.
 * @param apiRoutes Optional API route constructor.
 * @returns The followers response.
 */
async function following(apiKey: string, id: UserId, apiRoutes: typeof routes = routes): Promise<FollowingResponse> {
    const res = await postRequest(apiKey, apiRoutes.following, { id });
    if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
    return (await res.json()) as FollowingResponse;
}

/**
 * API endpoint functions.
 */
export const endpoints = { badges, followers, following, gameBadges };
