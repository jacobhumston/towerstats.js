# towerstats.js

JavaScript wrapper for the TowerStats.com API. (https://api.towerstats.com/docs)

Docs: https://towerstats.js.lovelyjacob.com

## Install

```bash
# npm
npm install towerstats.js

# bun
bun install towerstats.js
```

## Usage

```ts
import { TowerStatsClient } from 'towerstats.js';
import token from './token'; // You'll want to store your API token somewhere safe

/*
    Setting "autoStartSweeper" to false prevents the process from running forever.
    However, if you don't start the sweeper manually afterwards you may eventually run
    into memory leaks. (Unless you disable the cache altogether.)
*/
const client = new TowerStatsClient(token, { autoStartSweeper: false });
const followers = await client.getFollowers(2614622891);

console.log(followers); // Logs followers
```

The `TowerStatsClient` is perfect for when you want to cache requests, etc. However, when you want to create raw API calls, use the methods provided by the `endpoints` object.

```ts
import { endpoints } from 'towerstats.js';
import token from './token';

const followers = await endpoints.followers(token, 2614622891);

console.log(followers); // Logs followers
```

A bundle is also available, which can also be accessed on https://cdn.jsdelivr.net/npm/towerstats.js/dist/bundle.js.

See the docs for a full list of what is available. https://towerstats.js.lovelyjacob.com

_Maintained by Jacob Humston_ (MIT License)
