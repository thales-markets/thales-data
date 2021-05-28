# thales-data

This is a collection of utilities to query binary options data from Ethereum. This data has been indexed by The Graph via the subgraph the Thales team maintains: https://thegraph.com/explorer/subgraph/thales-markets/thales-options

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
```
