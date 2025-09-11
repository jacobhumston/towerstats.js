import type { BadgeId, UserId } from './types';
import { routes } from './url';

export async function postRequest(apiKey: string, url: URL, data: any) {
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(Object.assign({ apiKey }, data)),
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export async function checkBadges(
    apiKey: string,
    id: UserId,
    badges: Array<BadgeId>,
    apiRoutes: typeof routes = routes
) {
    const res = await postRequest(apiKey, apiRoutes.badges, { id, badges });
    return res.json();
}
