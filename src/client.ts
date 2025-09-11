import { routes } from './url';

/** TowerStats API client. */
export class TowerStatsClient {
    /** API key of this client. */
    #apiKey: string;
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
}
