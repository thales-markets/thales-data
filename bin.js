#!/usr/bin/env node

const program = require('commander');
const stringify = require('csv-stringify');

const { binaryOptions, exoticMarkets } = require('.');

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
	.option('-m, --max <value>', 'Maximum number of results', 100)
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
	.command('binaryOptions.ongoingAirdropNewRoots')
	.option('-m, --max <value>', 'Maximum number of results', Infinity)
	.option('-n, --network <value>', 'The network', 1)

	.action(async ({ max, network }) => {
		binaryOptions
			.ongoingAirdropNewRoots({ max, network })
			.then(logResults())
			.then(showResultCount({ max }));
	});

program
	.command('binaryOptions.thalesRoyaleGames')
	.option('-m, --max <value>', 'Maximum number of results', Infinity)
	.option('-a, --address <value>', 'The game address')
	.option('-n, --network <value>', 'The network', 1)

	.action(async ({ max, address, network }) => {
		binaryOptions
			.thalesRoyaleGames({ max, address, network })
			.then(logResults())
			.then(showResultCount({ max }));
	});

program
	.command('binaryOptions.thalesRoyaleSeasons')
	.option('-m, --max <value>', 'Maximum number of results', Infinity)
	.option('-s, --season <value>', 'Season number')
	.option('-n, --network <value>', 'The network', 1)

	.action(async ({ max, season, network }) => {
		binaryOptions
			.thalesRoyaleSeasons({ max, season, network })
			.then(logResults())
			.then(showResultCount({ max }));
	});

program
	.command('binaryOptions.thalesRoyaleRounds')
	.option('-m, --max <value>', 'Maximum number of results', Infinity)
	.option('-i, --id <value>', 'The position id')
	.option('-g, --season <value>', 'Season number')
	.option('-r, --round <value>', 'The round')
	.option('-n, --network <value>', 'The network', 1)

	.action(async ({ max, id, season, round, network }) => {
		binaryOptions
			.thalesRoyaleRounds({ max, id, season, round, network })
			.then(logResults())
			.then(showResultCount({ max }));
	});

program
	.command('binaryOptions.thalesRoyalePlayers')
	.option('-m, --max <value>', 'Maximum number of results', Infinity)
	.option('-i, --id <value>', 'The player id')
	.option('-a, --address <value>', 'The player address')
	.option('-g, --season <value>', 'Season number')
	.option('-n, --network <value>', 'The network', 1)

	.action(async ({ max, id, address, season, network }) => {
		binaryOptions
			.thalesRoyalePlayers({ max, id, address, season, network })
			.then(logResults())
			.then(showResultCount({ max }));
	});

program
	.command('binaryOptions.thalesRoyalePositions')
	.option('-m, --max <value>', 'Maximum number of results', Infinity)
	.option('-i, --id <value>', 'The position id')
	.option('-g, --season <value>', 'Season number')
	.option('-p, --player <value>', 'The player address')
	.option('-r, --round <value>', 'The round')
	.option('-s, --position <value>', 'The position')
	.option('-n, --network <value>', 'The network', 1)

	.action(async ({ max, id, season, player, round, position, network }) => {
		binaryOptions
			.thalesRoyalePositions({ max, id, season, player, round, position, network })
			.then(logResults())
			.then(showResultCount({ max }));
	});

program
	.command('binaryOptions.thalesRoyalePasses')
	.option('-m, --max <value>', 'Maximum number of results', Infinity)
	.option('-a, --address <value>', 'The owner address')
	.option('-n, --network <value>', 'The network', 1)

	.action(async ({ max, address, network }) => {
		binaryOptions
			.thalesRoyalePasses({ max, address, network })
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
	.command('exoticMarkets.markets')
	.option('-m, --max <value>', 'Maximum number of results', Infinity)
	.option('-c, --creator <value>', 'The address of the market creator')
	.option('-o, --isOpen', 'If the market is open or not')
	.option('-t, --minTimestamp <value>', 'The oldest timestamp to include, if any')
	.option('-T, --maxTimestamp <value>', 'The youngest timestamp to include, if any')
	.option('-n, --network <value>', 'The network', 69)

	.action(async ({ max, creator, isOpen, minTimestamp, maxTimestamp, network }) => {
		exoticMarkets
			.markets({ max, creator, isOpen, minTimestamp, maxTimestamp, network })
			.then(logResults())
			.then(showResultCount({ max }));
	});

program
	.command('exoticMarkets.disputes')
	.option('-m, --max <value>', 'Maximum number of results', Infinity)
	.option('-d, --disputer <value>', 'The address of the dispute creator')
	.option('-M, --market <value>', 'The address of the market')
	.option('-t, --minTimestamp <value>', 'The oldest timestamp to include, if any')
	.option('-T, --maxTimestamp <value>', 'The youngest timestamp to include, if any')
	.option('-n, --network <value>', 'The network', 69)

	.action(async ({ max, disputer, market, minTimestamp, maxTimestamp, network }) => {
		exoticMarkets
			.disputes({ max, disputer, market, minTimestamp, maxTimestamp, network })
			.then(logResults())
			.then(showResultCount({ max }));
	});

program
	.command('exoticMarkets.disputeVotes')
	.option('-m, --max <value>', 'Maximum number of results', Infinity)
	.option('-M, --market <value>', 'The address of the market')
	.option('-d, --dispute <value>', 'The dispute number')
	.option('-v, --voter <value>', 'The address of the voter')
	.option('-t, --minTimestamp <value>', 'The oldest timestamp to include, if any')
	.option('-T, --maxTimestamp <value>', 'The youngest timestamp to include, if any')
	.option('-n, --network <value>', 'The network', 69)

	.action(async ({ max, market, dispute, voter, minTimestamp, maxTimestamp, network }) => {
		exoticMarkets
			.disputeVotes({ max, market, dispute, voter, minTimestamp, maxTimestamp, network })
			.then(logResults())
			.then(showResultCount({ max }));
	});

program.parse(process.argv);
