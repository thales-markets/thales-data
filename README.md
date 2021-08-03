# thales-data

[![npm version](https://badge.fury.io/js/thales-data.svg)](https://badge.fury.io/js/thales-data)
[![Discord](https://img.shields.io/discord/816415414404907089.svg?color=768AD4&label=discord&logo=https%3A%2F%2Fdiscordapp.com%2Fassets%2F8c9701b98ad4372b58f13fd9f65f966e.svg)](https://discord.com/invite/cFGv5zyVEj)
[![Twitter Follow](https://img.shields.io/twitter/follow/thalesmarket.svg?label=thalesmarket&style=social)](https://twitter.com/thalesmarket)

This is a collection of utilities to query Thales data from Ethereum. This data has been indexed by The Graph via the subgraph the Thales team maintains ([the subgraph code repo](https://github.com/thales-markets/thales-subgraph)).

## Supported queries

The below all return a Promise that resolves with the requested results.

1. `binaryOptions.markets` Get all the binary options markets created.
2. `binaryOptions.optionTransactions` Get all the transactions made to the binary options markets.
3. `binaryOptions.trades({ makerToken, takerToken })` Get all trades between `makerToken` and `takerToken`.

## Use this as a node or webpack dependency

```javascript
const thalesData = require('thales-data'); // common js
// or
import thalesData from 'thales-data'; // es modules

// query and log resolved results
thalesData.binaryOptions
	.markets({
		network: 1, // mainnet
		max: 1000, // return first 1000 records
	})
	.then(markets => console.log(markets));
```

### Use in a browser

```html
<script src="https://cdn.jsdelivr.net/npm/thales-data/browser.js"></script>
<script>
	window.thalesData.binaryOptions
		.markets({
			network: 1, // mainnet
			max: 1000, // return first 1000 records
		})
		.then(console.log);
</script>
```

## How to query via the npm library (CLI)

```bash
# get markets ordered from latest to earliest
npx thales-data binaryOptions.markets
```
