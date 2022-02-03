'use strict';

const pageResults = require('graph-results-pager');

const { hexToAscii, getHashFromId } = require('./utils');

const graphAPIEndpoints = {
	binaryOptions: {
		1: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-options', // mainnet
		3: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-ropsten', // ropsten
		4: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-rinkeby', // rinkeby
		42: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-kovan', // kovan
		69: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-kovan-optimism', // optimism kovan
		10: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-optimism', // optimism
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
						'customMarket',
						'customOracle',
						'id',
						'timestamp',
						'creator',
						'currencyKey',
						'strikePrice',
						'maturityDate',
						'expiryDate',
						'isOpen',
						'poolSize',
						'longAddress',
						'shortAddress',
						'result',
						'finalPrice',
					],
				},
			}).then(results =>
				results.map(
					({
						customMarket,
						customOracle,
						id,
						timestamp,
						creator,
						currencyKey,
						strikePrice,
						maturityDate,
						expiryDate,
						isOpen,
						poolSize,
						longAddress,
						shortAddress,
						result,
						finalPrice,
					}) => ({
						customMarket,
						customOracle,
						address: id,
						timestamp: Number(timestamp * 1000),
						creator,
						currencyKey: hexToAscii(currencyKey),
						strikePrice: strikePrice / 1e18,
						maturityDate: Number(maturityDate) * 1000,
						expiryDate: Number(expiryDate) * 1000,
						isOpen,
						poolSize: poolSize / 1e18,
						longAddress,
						shortAddress,
						result: result !== null ? (result === 0 ? 'long' : 'short') : null,
						finalPrice: finalPrice / 1e18,
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
					properties: [
						'id',
						'timestamp',
						'type',
						'account',
						'currencyKey',
						'side',
						'amount',
						'market',
						'fee',
						'blockNumber',
					],
				},
			}).then(results =>
				results.map(({ id, timestamp, type, account, currencyKey, side, amount, market, fee, blockNumber }) => ({
					hash: getHashFromId(id),
					timestamp: Number(timestamp * 1000),
					type,
					account,
					currencyKey: currencyKey ? hexToAscii(currencyKey) : null,
					side: side === 0 ? 'long' : 'short',
					amount: amount / 1e18,
					market,
					fee: fee ? fee / 1e18 : null,
					blockNumber: Number(blockNumber),
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
						'market',
						'orderSide',
						'optionSide',
						'blockNumber',
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
						market,
						orderSide,
						optionSide,
						blockNumber,
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
						market,
						orderSide,
						optionSide,
						blockNumber: Number(blockNumber),
					}),
				),
			);
		},
		tokenTransactions({ max = Infinity, type = undefined, account = undefined, network = 1 } = {}) {
			return pageResults({
				api: graphAPIEndpoints.binaryOptions[network],
				max,
				query: {
					entity: 'tokenTransactions',
					selection: {
						orderBy: 'timestamp',
						orderDirection: 'desc',
						where: {
							account: account ? `\\"${account}\\"` : undefined,
							type: type ? `\\"${type}\\"` : undefined,
						},
					},
					properties: ['id', 'timestamp', 'type', 'account', 'amount', 'blockNumber'],
				},
			}).then(results =>
				results.map(({ id, timestamp, type, account, amount, blockNumber }) => ({
					hash: getHashFromId(id),
					timestamp: Number(timestamp * 1000),
					type,
					account,
					amount: amount / 1e18,
					blockNumber: Number(blockNumber),
				})),
			);
		},
		ongoingAirdropNewRoots({ max = Infinity, network = 1 } = {}) {
			return pageResults({
				api: graphAPIEndpoints.binaryOptions[network],
				max,
				query: {
					entity: 'ongoingAirdropNewRoots',
					selection: {
						orderBy: 'timestamp',
						orderDirection: 'desc',
					},
					properties: ['id', 'timestamp', 'root', 'period'],
				},
			}).then(results =>
				results.map(({ id, timestamp, root, period }) => ({
					hash: getHashFromId(id),
					timestamp: Number(timestamp * 1000),
					root,
					period,
				})),
			);
		},
		thalesRoyaleGames({ max = Infinity, address = undefined, network = 1 } = {}) {
			return pageResults({
				api: graphAPIEndpoints.binaryOptions[network],
				max,
				query: {
					entity: 'thalesRoyaleGames',
					selection: {
						orderBy: 'timestamp',
						orderDirection: 'desc',
						where: {
							address: address ? `\\"${address}\\"` : undefined,
						},
					},
					properties: ['id', 'timestamp', 'address', 'season'],
				},
			}).then(results =>
				results.map(({ id, timestamp, address, season }) => ({
					id,
					timestamp: Number(timestamp * 1000),
					address,
					season: Number(season),
				})),
			);
		},
		thalesRoyaleSeasons({ max = Infinity, season = undefined, network = 1 } = {}) {
			return pageResults({
				api: graphAPIEndpoints.binaryOptions[network],
				max,
				query: {
					entity: 'thalesRoyaleSeasons',
					selection: {
						orderBy: 'timestamp',
						orderDirection: 'desc',
						where: {
							season: season ? `\\"${season}\\"` : undefined,
						},
					},
					properties: ['id', 'timestamp', 'season'],
				},
			}).then(results =>
				results.map(({ id, timestamp, season }) => ({
					id,
					timestamp: Number(timestamp * 1000),
					season: Number(season),
				})),
			);
		},
		thalesRoyaleRounds({ max = Infinity, id = undefined, season = undefined, round = undefined, network = 1 } = {}) {
			return pageResults({
				api: graphAPIEndpoints.binaryOptions[network],
				max,
				query: {
					entity: 'thalesRoyaleRounds',
					selection: {
						orderBy: 'timestamp',
						orderDirection: 'desc',
						where: {
							id: id ? `\\"${id}\\"` : undefined,
							round: round ? `\\"${round}\\"` : undefined,
							season: season ? `\\"${season}\\"` : undefined,
						},
					},
					properties: [
						'id',
						'timestamp',
						'season',
						'round',
						'result',
						'strikePrice',
						'finalPrice',
						'totalPlayersPerRoundPerSeason',
						'eliminatedPerRoundPerSeason',
					],
				},
			}).then(results =>
				results.map(
					({
						id,
						timestamp,
						season,
						round,
						result,
						strikePrice,
						finalPrice,
						totalPlayersPerRoundPerSeason,
						eliminatedPerRoundPerSeason,
					}) => ({
						id,
						timestamp: Number(timestamp * 1000),
						season: Number(season),
						round: Number(round),
						result: result ? Number(result) : null,
						strikePrice: strikePrice ? strikePrice / 1e18 : null,
						finalPrice: finalPrice ? finalPrice / 1e18 : null,
						totalPlayersPerRoundPerSeason: Number(totalPlayersPerRoundPerSeason),
						eliminatedPerRoundPerSeason: Number(eliminatedPerRoundPerSeason),
					}),
				),
			);
		},
		thalesRoyalePlayers({ max = Infinity, id = undefined, address = undefined, season = undefined, network = 1 } = {}) {
			return pageResults({
				api: graphAPIEndpoints.binaryOptions[network],
				max,
				query: {
					entity: 'thalesRoyalePlayers',
					selection: {
						orderBy: 'timestamp',
						orderDirection: 'desc',
						where: {
							id: id ? `\\"${id}\\"` : undefined,
							address: address ? `\\"${address}\\"` : undefined,
							season: season ? `\\"${season}\\"` : undefined,
						},
					},
					properties: ['id', 'address', 'timestamp', 'season', 'isAlive', 'deathRound', 'number'],
				},
			}).then(results =>
				results.map(({ id, address, timestamp, season, isAlive, deathRound, number }) => ({
					id,
					address,
					timestamp: Number(timestamp * 1000),
					season: Number(season),
					isAlive,
					deathRound: Number(deathRound),
					number: Number(number),
				})),
			);
		},
		thalesRoyalePositions({
			max = Infinity,
			id = undefined,
			season = undefined,
			player = undefined,
			round = undefined,
			position = undefined,
			network = 1,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.binaryOptions[network],
				max,
				query: {
					entity: 'thalesRoyalePositions',
					selection: {
						orderBy: 'timestamp',
						orderDirection: 'desc',
						where: {
							id: id ? `\\"${id}\\"` : undefined,
							season: season ? `\\"${season}\\"` : undefined,
							player: player ? `\\"${player}\\"` : undefined,
							round: round ? `\\"${round}\\"` : undefined,
							position: position ? `\\"${position}\\"` : undefined,
						},
					},
					properties: ['id', 'timestamp', 'season', 'player', 'round', 'position'],
				},
			}).then(results =>
				results.map(({ id, timestamp, player, round, position }) => ({
					id,
					timestamp: Number(timestamp * 1000),
					season: Number(season),
					player,
					round: Number(round),
					position: Number(position),
				})),
			);
		},
		stakers({ max = Infinity, network = 1 } = {}) {
			return pageResults({
				api: graphAPIEndpoints.binaryOptions[network],
				max,
				query: {
					entity: 'stakers',
					selection: {
						orderBy: 'totalStakedAmount',
						orderDirection: 'desc',
					},
					properties: ['id', 'timestamp', 'stakedAmount', 'escrowedAmount', 'totalStakedAmount', 'unstakingAmount'],
				},
			}).then(results =>
				results.map(({ id, timestamp, stakedAmount, escrowedAmount, totalStakedAmount, unstakingAmount }) => ({
					id,
					timestamp: Number(timestamp * 1000),
					stakedAmount: stakedAmount / 1e18,
					escrowedAmount: escrowedAmount / 1e18,
					totalStakedAmount: totalStakedAmount / 1e18,
					unstakingAmount: unstakingAmount / 1e18,
				})),
			);
		},
	},
};
