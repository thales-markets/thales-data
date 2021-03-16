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

	.action(async ({ max, creator, isOpen, minTimestamp, maxTimestamp }) => {
		binaryOptions
			.markets({ max, creator, isOpen, minTimestamp, maxTimestamp })
			.then(logResults())
			.then(showResultCount({ max }));
	});

program
	.command('binaryOptions.optionTransactions')
	.option('-m, --max <value>', 'Maximum number of results', Infinity)
	.option('-M, --market <value>', 'The market address')
	.option('-a, --account <value>', 'The account address')

	.action(async ({ max, type, market, account }) => {
		binaryOptions
			.optionTransactions({ max, type, market, account })
			.then(logResults())
			.then(showResultCount({ max }));
	});

program
	.command('binaryOptions.marketsBidOn')
	.option('-m, --max <value>', 'Maximum number of results', Infinity)
	.option('-a, --account <value>', 'The account address')

	.action(async ({ max, account }) => {
		binaryOptions
			.marketsBidOn({ max, account })
			.then(logResults())
			.then(showResultCount({ max }));
	});

program
	.command('binaryOptions.historicalOptionPrice')
	.option('-m, --max <value>', 'Maximum number of results', Infinity)
	.option('-M, --market <value>', 'The market address')
	.option('-t, --minTimestamp <value>', 'The oldest timestamp to include, if any')
	.option('-T, --maxTimestamp <value>', 'The youngest timestamp to include, if any')

	.action(async ({ max, market, minTimestamp, maxTimestamp }) => {
		binaryOptions
			.historicalOptionPrice({ max, market, minTimestamp, maxTimestamp })
			.then(logResults())
			.then(showResultCount({ max }));
	});

program.parse(process.argv);
