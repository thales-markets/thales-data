# thales-data

[![npm version](https://badge.fury.io/js/thales-data.svg)](https://badge.fury.io/js/thales-data)
[![Discord](https://img.shields.io/discord/906484044915687464.svg?color=768AD4&label=discord&logo=https%3A%2F%2Fdiscordapp.com%2Fassets%2F8c9701b98ad4372b58f13fd9f65f966e.svg)](https://discord.com/invite/rB3AWKwACM)
[![Twitter Follow](https://img.shields.io/twitter/follow/thalesmarket.svg?label=thalesmarket&style=social)](https://twitter.com/thalesmarket)

This is a collection of utilities to query Thales data from Ethereum. This data has been indexed by The Graph via the subgraph the Thales team maintains ([the subgraph code repo](https://github.com/thales-markets/thales-subgraph)).

## Supported queries

The below all return a Promise that resolves with the requested results.

### Thales

#### Markets

1. `binaryOptions.markets` Get all positional markets created.
2. `binaryOptions.optionTransactions` Get all transactions made to the positional markets.
3. `binaryOptions.trades` Get all trades made to the positional markets.
4. `binaryOptions.positionBalances({ account })` Get balances of positions for the `account`.
5. `binaryOptions.rangedPositionBalances({ account })` Get balances of ranged positions for the `account`.

#### Token

1. `binaryOptions.tokenTransactions({ account })` Get all the transactions made with THALES token from the `account`.
2. `binaryOptions.stakers` Get all THALES stakers.

#### Vaults

1. `binaryOptions.vaultTransactions({ vault })` Get all the transactions made by the `vault`.
2. `binaryOptions.vaultPnls({ vault })` Get all round PNLs for the `vault`.
3. `binaryOptions.vaultUserTransactions({ vault })` Get all user transactions for the `vault`.

#### Liquidity Pool

1. `binaryOptions.vaultPnls({ liquidityPool })` Get all round PNLs for the `liquidityPool`.
2. `binaryOptions.liquidityPoolUserTransactions({ liquidityPool })` Get all user transactions for the `liquidityPool`.

### Overtime

#### Markets

1. `sportMarkets.markets` Get all sports markets created.
2. `sportMarkets.positionBalances({ account })` Get balances of positions for the `account`.
3. `sportMarkets.marketTransactions` Get all transactions made to the sports markets.
4. `sportMarkets.overtimeVouchers({ account })` Get all Overtime vouchers for the `account`.

#### Vaults

1. `sportMarkets.vaultTransactions({ vault })` Get all the transactions made by the `vault`.
2. `sportMarkets.vaultPnls({ vault })` Get all round PNLs for the `vault`.
3. `sportMarkets.vaultUserTransactions({ vault })` Get all user transactions for the `vault`.

#### Liquidity Pool

1. `sportMarkets.vaultPnls({ liquidityPool })` Get all round PNLs for the `liquidityPool`.
2. `sportMarkets.liquidityPoolUserTransactions({ liquidityPool })` Get all user transactions for the `liquidityPool`.

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
