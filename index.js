'use strict';

const pageResults = require('graph-results-pager');

const { hexToAscii, getHashFromId } = require('./utils');

const graphAPIEndpoints = {
	binaryOptions: {
		1: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-options', // mainnet
		3: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-ropsten', // ropsten
		4: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-rinkeby', // rinkeby
		42: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-kovan', // kovan
	},
};

module.exports = {
	pageResults,
	graphAPIEndpoints,
	binaryOptions: {
		markets({
			max = 100,
			creator = undefined,
			isOpen = undefined,
			minTimestamp = undefined,
			maxTimestamp = undefined,
			network = 1,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.binaryOptions[network],
				max,
				query: {
					entity: 'markets',
					selection: {
						orderBy: 'maturityDate',
						orderDirection: 'desc',
						where: {
							creator: creator ? `\\"${creator}\\"` : undefined,
							isOpen: isOpen !== undefined ? isOpen : undefined,
							timestamp_gte: minTimestamp || undefined,
							timestamp_lte: maxTimestamp || undefined,
						},
					},
					properties: [
						'id',
						'timestamp',
						'creator',
						'currencyKey',
						'strikePrice',
						'maturityDate',
						'expiryDate',
						'isOpen',
						'poolSize',
						'result',
						'longAddress',
						'shortAddress',
						'customMarket',
						'customOracle',
					],
				},
			}).then(results =>
				results.map(
					({
						id,
						timestamp,
						creator,
						currencyKey,
						strikePrice,
						maturityDate,
						expiryDate,
						isOpen,
						poolSize,
						result,
						longAddress,
						shortAddress,
						customMarket,
						customOracle,
					}) => ({
						address: id,
						timestamp: Number(timestamp * 1000),
						creator,
						currencyKey: hexToAscii(currencyKey),
						strikePrice: strikePrice / 1e18,
						maturityDate: Number(maturityDate) * 1000,
						expiryDate: Number(expiryDate) * 1000,
						isOpen,
						poolSize: poolSize / 1e18,
						result: result !== null ? (result === 0 ? 'long' : 'short') : null,
						longAddress,
						shortAddress,
						customMarket,
						customOracle,
					}),
				),
			);
		},
		optionTransactions({ max = Infinity, market = undefined, account = undefined, network = 1 } = {}) {
			return pageResults({
				api: graphAPIEndpoints.binaryOptions[network],
				max,
				query: {
					entity: 'optionTransactions',
					selection: {
						orderBy: 'timestamp',
						orderDirection: 'desc',
						where: {
							market: market ? `\\"${market}\\"` : undefined,
							account: account ? `\\"${account}\\"` : undefined,
						},
					},
					properties: ['id', 'timestamp', 'type', 'account', 'currencyKey', 'side', 'amount', 'market', 'fee'],
				},
			}).then(results =>
				results.map(({ id, timestamp, type, account, currencyKey, side, amount, market, fee }) => ({
					hash: getHashFromId(id),
					timestamp: Number(timestamp * 1000),
					type,
					account,
					currencyKey: currencyKey ? hexToAscii(currencyKey) : null,
					side: side === 0 ? 'long' : 'short',
					amount: amount / 1e18,
					market,
					fee: fee ? fee / 1e18 : null,
				})),
			);
		},
		trades({
			max = Infinity,
			makerToken = undefined,
			takerToken = undefined,
			minTimestamp = undefined,
			maxTimestamp = undefined,
			network = 1,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.binaryOptions[network],
				max,
				query: {
					entity: 'trades',
					selection: {
						orderBy: 'timestamp',
						orderDirection: 'desc',
						where: {
							makerToken: makerToken ? `\\"${makerToken}\\"` : undefined,
							takerToken: takerToken ? `\\"${takerToken}\\"` : undefined,
							timestamp_gte: minTimestamp || undefined,
							timestamp_lte: maxTimestamp || undefined,
						},
					},
					properties: [
						'id',
						'transactionHash',
						'timestamp',
						'orderHash',
						'maker',
						'taker',
						'makerToken',
						'takerToken',
						'makerAmount',
						'takerAmount',
					],
				},
			}).then(results =>
				results.map(
					({
						id,
						transactionHash,
						timestamp,
						orderHash,
						maker,
						taker,
						makerToken,
						takerToken,
						makerAmount,
						takerAmount,
					}) => ({
						id,
						transactionHash,
						timestamp: Number(timestamp * 1000),
						orderHash,
						maker,
						taker,
						makerToken,
						takerToken,
						makerAmount: makerAmount / 1e18,
						takerAmount: takerAmount / 1e18,
					}),
				),
			);
		},
	},
};
