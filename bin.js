#!/usr/bin/env node

const program = require('commander');
const stringify = require('csv-stringify');

const { binaryOptions } = require('.');

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
	.command('binaryOptions.thalesRoyaleRounds')
	.option('-m, --max <value>', 'Maximum number of results', Infinity)
	.option('-i, --id <value>', 'The position id')
	.option('-g, --game <value>', 'The game address')
	.option('-r, --round <value>', 'The round')
	.option('-n, --network <value>', 'The network', 1)

	.action(async ({ max, id, game, round, network }) => {
		binaryOptions
			.thalesRoyaleRounds({ max, id, game, round, network })
			.then(logResults())
			.then(showResultCount({ max }));
	});

program
	.command('binaryOptions.thalesRoyalePlayers')
	.option('-m, --max <value>', 'Maximum number of results', Infinity)
	.option('-i, --id <value>', 'The player id')
	.option('-a, --address <value>', 'The player address')
	.option('-g, --game <value>', 'The game address')
	.option('-n, --network <value>', 'The network', 1)

	.action(async ({ max, id, address, game, network }) => {
		binaryOptions
			.thalesRoyalePlayers({ max, id, address, game, network })
			.then(logResults())
			.then(showResultCount({ max }));
	});

program
	.command('binaryOptions.thalesRoyalePositions')
	.option('-m, --max <value>', 'Maximum number of results', Infinity)
	.option('-i, --id <value>', 'The position id')
	.option('-g, --game <value>', 'The game address')
	.option('-p, --player <value>', 'The player address')
	.option('-r, --round <value>', 'The round')
	.option('-s, --position <value>', 'The position')
	.option('-n, --network <value>', 'The network', 1)

	.action(async ({ max, id, game, player, round, position, network }) => {
		binaryOptions
			.thalesRoyalePositions({ max, id, game, player, round, position, network })
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

program.parse(process.argv);
