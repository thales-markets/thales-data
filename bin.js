#!/usr/bin/env node

const program = require('commander');
const stringify = require('csv-stringify');

const { binaryOptions, sportMarkets } = require('.');

const logResults = ({ json, csv } = {}) => results => {
	if (json) {
		console.log(JSON.stringify(results, null, 2));
	} else if (csv) {
		stringify(results, { header: true }).pipe(process.stdout);
	} else {
		console.log(results);
	}
	return results;
};

const showResultCount = ({ max }) => results => {
	if (process.env.DEBUG) {
		console.log(`${results.length} entries returned (max supplied: ${max})`);
	}
};

program
	.command('binaryOptions.markets')
	.option('-m, --max <value>', 'Maximum number of results', Infinity)
	.option('-c, --creator <value>', 'The address of the market creator')
	.option('-o, --isOpen', 'If the market is open or not')
	.option('-t, --minTimestamp <value>', 'The oldest timestamp to include, if any')
	.option('-T, --maxTimestamp <value>', 'The youngest timestamp to include, if any')
	.option('-n, --network <value>', 'The network', 1)

	.action(async ({ max, creator, isOpen, minTimestamp, maxTimestamp, network }) => {
		binaryOptions
			.markets({ max, creator, isOpen, minTimestamp, maxTimestamp, network })
			.then(logResults())
			.then(showResultCount({ max }));
	});

program
	.command('binaryOptions.optionTransactions')
	.option('-m, --max <value>', 'Maximum number of results', Infinity)
	.option('-t, --type <value>', 'The transaction type')
	.option('-M, --market <value>', 'The market address')
	.option('-a, --account <value>', 'The account address')
	.option('-n, --network <value>', 'The network', 1)

	.action(async ({ max, type, market, account, network }) => {
		binaryOptions
			.optionTransactions({ max, type, market, account, network })
			.then(logResults())
			.then(showResultCount({ max }));
	});

program
	.command('binaryOptions.trades')
	.option('-m, --max <value>', 'Maximum number of results', Infinity)
	.option('-w, --makerToken <value>', 'The address of the maker token')
	.option('-v, --takerToken <value>', 'The address of the taker token')
	.option('-t, --minTimestamp <value>', 'The oldest timestamp to include, if any')
	.option('-T, --maxTimestamp <value>', 'The youngest timestamp to include, if any')
	.option('-n, --network <value>', 'The network', 1)

	.action(async ({ max, makerToken, takerToken, minTimestamp, maxTimestamp, network }) => {
		binaryOptions
			.trades({ max, makerToken, takerToken, minTimestamp, maxTimestamp, network })
			.then(logResults())
			.then(showResultCount({ max }));
	});

program
	.command('binaryOptions.positionBalances')
	.option('-m, --max <value>', 'Maximum number of results', Infinity)
	.option('-w, --account <value>', 'The address of the wallet')
	.option('-v, --amount <value>', 'Amount of position in wallet')
	.option('-t, --position <value>', 'Position in question')
	.option('-n, --network <value>', 'The network', 137)

	.action(async ({ max, account, network }) => {
		binaryOptions
			.positionBalances({ max, account, network })
			.then(logResults())
			.then(showResultCount({ max }));
	});

program
	.command('binaryOptions.rangedPositionBalances')
	.option('-m, --max <value>', 'Maximum number of results', Infinity)
	.option('-w, --account <value>', 'The address of the wallet')
	.option('-v, --amount <value>', 'Amount of position in wallet')
	.option('-t, --position <value>', 'Position in question')
	.option('-n, --network <value>', 'The network', 137)

	.action(async ({ max, account, network }) => {
		binaryOptions
			.rangedPositionBalances({ max, account, network })
			.then(logResults())
			.then(showResultCount({ max }));
	});

program
	.command('binaryOptions.tokenTransactions')
	.option('-m, --max <value>', 'Maximum number of results', Infinity)
	.option('-t, --type <value>', 'The transaction type')
	.option('-a, --account <value>', 'The account address')
	.option('-n, --network <value>', 'The network', 1)

	.action(async ({ max, type, account, network }) => {
		binaryOptions
			.tokenTransactions({ max, type, account, network })
			.then(logResults())
			.then(showResultCount({ max }));
	});

program
	.command('binaryOptions.accountBuyVolumes')
	.option('-m, --max <value>', 'Maximum number of results', Infinity)
	.option('-t, --type <value>', 'The transaction type')
	.option('-a, --account <value>', 'The account address')
	.option('-n, --network <value>', 'The network', 1)

	.action(async ({ max, type, account, network }) => {
		binaryOptions
			.accountBuyVolumes({ max, type, account, network })
			.then(logResults())
			.then(showResultCount({ max }));
	});

program
	.command('binaryOptions.rewards')
	.option('-m, --max <value>', 'Maximum number of results', Infinity)
	.option('-t, --minTimestamp <value>', 'The oldest timestamp to include, if any')
	.option('-T, --maxTimestamp <value>', 'The youngest timestamp to include, if any')
	.option('-n, --network <value>', 'The network', 10)

	.action(async ({ max, minTimestamp, maxTimestamp, network }) => {
		binaryOptions
			.rewards({ max, minTimestamp, maxTimestamp, network })
			.then(logResults())
			.then(showResultCount({ max }));
	});

program
	.command('binaryOptions.stakers')
	.option('-m, --max <value>', 'Maximum number of results', Infinity)
	.option('-n, --network <value>', 'The network', 1)

	.action(async ({ max, network }) => {
		binaryOptions
			.stakers({ max, network })
			.then(logResults())
			.then(showResultCount({ max }));
	});

program
	.command('binaryOptions.canClaimOnBehalfItems')
	.option('-m, --max <value>', 'Maximum number of results', Infinity)
	.option('-s, --sender <value>', 'The sender address')
	.option('-n, --network <value>', 'The network', 1)

	.action(async ({ max, sender, network }) => {
		binaryOptions
			.canClaimOnBehalfItems({ max, sender, network })
			.then(logResults())
			.then(showResultCount({ max }));
	});

program
	.command('binaryOptions.vaultTransactions')
	.option('-m, --max <value>', 'Maximum number of results', Infinity)
	.option('-M, --market <value>', 'The market address')
	.option('-v, --vault <value>', 'The vault address')
	.option('-t, --minTimestamp <value>', 'The oldest timestamp to include, if any')
	.option('-T, --maxTimestamp <value>', 'The youngest timestamp to include, if any')
	.option('-n, --network <value>', 'The network', 1)

	.action(async ({ max, market, vault, minTimestamp, maxTimestamp, network }) => {
		binaryOptions
			.vaultTransactions({ max, market, vault, minTimestamp, maxTimestamp, network })
			.then(logResults())
			.then(showResultCount({ max }));
	});

program
	.command('binaryOptions.vaultPnls')
	.option('-m, --max <value>', 'Maximum number of results', Infinity)
	.option('-v, --vault <value>', 'The vault address')
	.option('-t, --minTimestamp <value>', 'The oldest timestamp to include, if any')
	.option('-T, --maxTimestamp <value>', 'The youngest timestamp to include, if any')
	.option('-n, --network <value>', 'The network', 1)

	.action(async ({ max, vault, minTimestamp, maxTimestamp, network }) => {
		binaryOptions
			.vaultPnls({ max, vault, minTimestamp, maxTimestamp, network })
			.then(logResults())
			.then(showResultCount({ max }));
	});

program
	.command('binaryOptions.vaultUserTransactions')
	.option('-m, --max <value>', 'Maximum number of results', Infinity)
	.option('-v, --vault <value>', 'The vault address')
	.option('-t, --type <value>', 'The transaction type')
	.option('-a, --account <value>', 'The account address')
	.option('-n, --network <value>', 'The network', 1)

	.action(async ({ max, vault, type, account, network }) => {
		binaryOptions
			.vaultUserTransactions({ max, vault, type, account, network })
			.then(logResults())
			.then(showResultCount({ max }));
	});

program
	.command('binaryOptions.liquidityPoolPnls')
	.option('-m, --max <value>', 'Maximum number of results', Infinity)
	.option('-v, --liquidityPool <value>', 'The liquidity pool address')
	.option('-t, --minTimestamp <value>', 'The oldest timestamp to include, if any')
	.option('-T, --maxTimestamp <value>', 'The youngest timestamp to include, if any')
	.option('-n, --network <value>', 'The network', 1)

	.action(async ({ max, liquidityPool, minTimestamp, maxTimestamp, network }) => {
		sportMarkets
			.liquidityPoolPnls({ max, liquidityPool, minTimestamp, maxTimestamp, network })
			.then(logResults())
			.then(showResultCount({ max }));
	});

program
	.command('binaryOptions.liquidityPoolUserTransactions')
	.option('-m, --max <value>', 'Maximum number of results', Infinity)
	.option('-v, --liquidityPool <value>', 'The liquidity pool address')
	.option('-t, --type <value>', 'The transaction type')
	.option('-a, --account <value>', 'The account address')
	.option('-n, --network <value>', 'The network', 1)

	.action(async ({ max, liquidityPool, type, account, network }) => {
		sportMarkets
			.liquidityPoolUserTransactions({ max, liquidityPool, type, account, network })
			.then(logResults())
			.then(showResultCount({ max }));
	});

program
	.command('sportMarkets.markets')
	.option('-m, --max <value>', 'Maximum number of results', Infinity)
	.option('-o, --isOpen', 'If the market is open or not')
	.option('-c, --isCanceled', 'If the market is canceled or not')
	.option('-r, --isResolved', 'If the market is resolved or not')
	.option('-p, --isPaused', 'If the market is paused or not')
	.option('-t, --minTimestamp <value>', 'The oldest timestamp to include, if any')
	.option('-T, --maxTimestamp <value>', 'The youngest timestamp to include, if any')
	.option('-d, --minMaturityDate <value>', 'The oldest maturity date to include, if any')
	.option('-D, --maxMaturityDate <value>', 'The youngest maturity date to include, if any')
	.option('-n, --network <value>', 'The network', 42)

	.action(async ({ max, isOpen, isCanceled, isResolved, minTimestamp, maxTimestamp, network }) => {
		sportMarkets
			.markets({ max, isOpen, isCanceled, isResolved, minTimestamp, maxTimestamp, network })
			.then(logResults())
			.then(showResultCount({ max }));
	});

program
	.command('sportMarkets.positionBalances')
	.option('-m, --max <value>', 'Maximum number of results', Infinity)
	.option('-a, --account <value>', 'The address of the wallet')
	.option('-n, --network <value>', 'The network', 42)

	.action(async ({ max, account, network }) => {
		sportMarkets
			.positionBalances({ max, account, network })
			.then(logResults())
			.then(showResultCount({ max }));
	});

program
	.command('sportMarkets.marketTransactions')
	.option('-m, --max <value>', 'Maximum number of results', Infinity)
	.option('-M, --market <value>', 'The market address')
	.option('-t, --type <value>', 'The transaction type')
	.option('-a, --account <value>', 'The account address')
	.option('-t, --minTimestamp <value>', 'The oldest timestamp to include, if any')
	.option('-T, --maxTimestamp <value>', 'The youngest timestamp to include, if any')
	.option('-n, --network <value>', 'The network', 1)
	.option('-p, --parentMarket <value>', 'The parent market address')

	.action(async ({ max, market, type, account, network, parentMarket }) => {
		sportMarkets
			.marketTransactions({ max, market, type, account, network, parentMarket })
			.then(logResults())
			.then(showResultCount({ max }));
	});

program
	.command('sportMarkets.claimTxes')
	.option('-m, --max <value>', 'Maximum number of results', Infinity)
	.option('-a, --account <value>', 'The address of the wallet')
	.option('-t, --minTimestamp <value>', 'The oldest timestamp to include, if any')
	.option('-T, --maxTimestamp <value>', 'The youngest timestamp to include, if any')
	.option('-n, --network <value>', 'The network', 42)
	.option('-p, --parentMarket <value>', 'The parent market address')
	.action(async ({ max, account, minTimestamp, maxTimestamp, network, parentMarket }) => {
		sportMarkets
			.claimTx({ max, account, minTimestamp, maxTimestamp, network, parentMarket })
			.then(logResults())
			.then(showResultCount({ max }));
	});

program
	.command('sportMarkets.overtimeVouchers')
	.option('-m, --max <value>', 'Maximum number of results', Infinity)
	.option('-a, --address <value>', 'The owner address')
	.option('-n, --network <value>', 'The network', 1)

	.action(async ({ max, address, network }) => {
		sportMarkets
			.overtimeVouchers({ max, address, network })
			.then(logResults())
			.then(showResultCount({ max }));
	});

program
	.command('sportMarkets.vaultTransactions')
	.option('-m, --max <value>', 'Maximum number of results', Infinity)
	.option('-M, --market <value>', 'The market address')
	.option('-v, --vault <value>', 'The vault address')
	.option('-t, --minTimestamp <value>', 'The oldest timestamp to include, if any')
	.option('-T, --maxTimestamp <value>', 'The youngest timestamp to include, if any')
	.option('-n, --network <value>', 'The network', 1)

	.action(async ({ max, market, vault, minTimestamp, maxTimestamp, network }) => {
		sportMarkets
			.vaultTransactions({ max, market, vault, minTimestamp, maxTimestamp, network })
			.then(logResults())
			.then(showResultCount({ max }));
	});

program
	.command('sportMarkets.vaultPnls')
	.option('-m, --max <value>', 'Maximum number of results', Infinity)
	.option('-v, --vault <value>', 'The vault address')
	.option('-t, --minTimestamp <value>', 'The oldest timestamp to include, if any')
	.option('-T, --maxTimestamp <value>', 'The youngest timestamp to include, if any')
	.option('-n, --network <value>', 'The network', 1)

	.action(async ({ max, vault, minTimestamp, maxTimestamp, network }) => {
		sportMarkets
			.vaultPnls({ max, vault, minTimestamp, maxTimestamp, network })
			.then(logResults())
			.then(showResultCount({ max }));
	});

program
	.command('sportMarkets.vaultUserTransactions')
	.option('-m, --max <value>', 'Maximum number of results', Infinity)
	.option('-v, --vault <value>', 'The vault address')
	.option('-t, --type <value>', 'The transaction type')
	.option('-a, --account <value>', 'The account address')
	.option('-n, --network <value>', 'The network', 1)

	.action(async ({ max, vault, type, account, network }) => {
		sportMarkets
			.vaultUserTransactions({ max, vault, type, account, network })
			.then(logResults())
			.then(showResultCount({ max }));
	});

program
	.command('sportMarkets.liquidityPoolPnls')
	.option('-m, --max <value>', 'Maximum number of results', Infinity)
	.option('-v, --liquidityPool <value>', 'The liquidity pool address')
	.option('-t, --minTimestamp <value>', 'The oldest timestamp to include, if any')
	.option('-T, --maxTimestamp <value>', 'The youngest timestamp to include, if any')
	.option('-n, --network <value>', 'The network', 1)

	.action(async ({ max, liquidityPool, minTimestamp, maxTimestamp, network }) => {
		sportMarkets
			.liquidityPoolPnls({ max, liquidityPool, minTimestamp, maxTimestamp, network })
			.then(logResults())
			.then(showResultCount({ max }));
	});

program
	.command('sportMarkets.liquidityPoolUserTransactions')
	.option('-m, --max <value>', 'Maximum number of results', Infinity)
	.option('-v, --liquidityPool <value>', 'The liquidity pool address')
	.option('-t, --type <value>', 'The transaction type')
	.option('-a, --account <value>', 'The account address')
	.option('-n, --network <value>', 'The network', 1)

	.action(async ({ max, liquidityPool, type, account, network }) => {
		sportMarkets
			.liquidityPoolUserTransactions({ max, liquidityPool, type, account, network })
			.then(logResults())
			.then(showResultCount({ max }));
	});

program.parse(process.argv);
