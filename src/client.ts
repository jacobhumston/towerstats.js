/** TowerStats API client. */
export class TowerStatsClient {
    /** API key of this client. */
    #apiKey: string;

    /**
     * Create a new TowerStats client.
     * @param apiKey Your TowerStats API key.
     */
    constructor(apiKey: string) {
        this.#apiKey = apiKey;
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
}
