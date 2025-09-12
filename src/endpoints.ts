import type { BadgeId, UserId } from './types.js';
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
        body: JSON.stringify(Object.assign({ apiKey }, data)),
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

/**
 * Badges response array.
 * Each array in the main array contains `[0]<badgeId>` and `[1]<completionDate>`.
 * Note that unowned badges are not included in the array.
 */
export type BadgesResponse = Array<[number, string]>;

/**
 * Submit badge data for a Roblox user.
 * @param apiKey Your API key.
 * @param id Roblox user ID.
 * @param badges An array of Roblox badge IDs.
 * @param apiRoutes Optional API route constructor.
 * @returns
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
 * API endpoint functions.
 */
export const endpoints = { badges };
