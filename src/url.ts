/** API routes constructor. */
export class RoutesConstructor {
    /** Base URL. */
    baseURL: URL;

    /**
     * Create a new route constructor.
     * @param baseURL Specify the base URL of this route constructor.
     */
    constructor(baseURL: string = 'https://api.towerstats.com') {
        this.baseURL = new URL(baseURL);
    }

    /**
     * Append a path to the base URL.
     * @param path The path to append.
     * @returns The complete URL.
     */
    baseAppend(path: string): URL {
        return new URL(this.baseURL.href + path);
    }

    /**
     * `POST` Submit badge data for a Roblox user.
     * @returns `/api/badges` route.
     */
    get badges(): URL {
        return this.baseAppend('/api/badges');
    }

    /**
     * `POST` Fetch all followers for a Roblox user.
     * @returns `/api/followers` route.
     */
    get followers(): URL {
        return this.baseAppend('/api/followers');
    }

    /**
     * `POST` Fetch all users that a Roblox user is following.
     * @returns `/api/following` route.
     */
    get following(): URL {
        return this.baseAppend('/api/following');
    }

    /**
     * `POST` Check which badges a user has earned in a specific Roblox universe.
     * @returns `/api/game_badges` route.
     */
    get gameBadges(): URL {
        return this.baseAppend('/api/game_badges');
    }
}

/** TowerStats API routes. */
export const routes = new RoutesConstructor();
