'use strict';

const pageResults = require('graph-results-pager');

const { hexToAscii, getHashFromId } = require('./utils');

const convertAmount = (amount, networkId, tokenAddress) => {
	if (networkId == 137) {
		if (tokenAddress && tokenAddress == '0x2791bca1f2de4661ed88a30c99a7a9449aa84174') return amount / 1e6;
		if (!tokenAddress) return amount / 1e6;
	}
	if (networkId == 42161) {
		if (tokenAddress && tokenAddress == '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8') return amount / 1e6;
		if (!tokenAddress) return amount / 1e6;
	}
	if (networkId == 8453) {
		if (tokenAddress && tokenAddress == '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA') return amount / 1e6;
		if (!tokenAddress) return amount / 1e6;
	}
	return amount / 1e18;
};

const graphAPIEndpoints = {
	token: {
		420: 'https://api.thegraph.com/subgraphs/name/thales-markets/token-goerli', // optimism goerli
		10: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-token', // optimism
		42161: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-token-arbitrum', // arbitrum
		1: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-token-mainnet', // mainnet
	},

	thalesMarkets: {
		420: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-markets-goerli-ovm', // optimism goerli
		10: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-markets', // optimism
		42161: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-arbitrum', // arbitrum
		137: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-polygon', // polygon
		56: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-bsc', // bsc
		8453: 'https://api.studio.thegraph.com/query/11948/thales-markets-base/version/latest', // base

		lp: {
			420: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-markets-goerli-ovm', // optimism goerli
			10: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-lp-optimism', // optimism
			42161: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-arbitrum', // arbitrum
			8453: 'https://api.studio.thegraph.com/query/11948/thales-markets-base/version/latest', // base
		},

		positions: {
			420: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-markets-goerli-ovm', // optimism goerli
			10: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-markets', // optimism
			42161: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-arbitrum', // arbitrum
			137: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-polygon', // polygon
			56: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-bsc', // bsc
			8453: 'https://api.studio.thegraph.com/query/11948/thales-markets-base/version/latest', // base
		},

		rewards: {
			10: 'https://api.thegraph.com/subgraphs/name/thales-markets/trade-rewards',
		},
	},

	sportMarkets: {
		420: 'https://api.thegraph.com/subgraphs/name/thales-markets/sport-markets-optimism-goerli', // optimism goerli
		10: 'https://api.thegraph.com/subgraphs/name/thales-markets/sport-markets-optimism', // optimism
		42161: 'https://api.thegraph.com/subgraphs/name/thales-markets/overtime-arbitrum', // arbitrum
	},

	taleOfThales: {
		420: 'https://api.thegraph.com/subgraphs/name/thales-markets/tot-op-goerli', // optimism goerli
		10: 'https://api.thegraph.com/subgraphs/name/thales-markets/tale-of-thales', // optimism
		42161: 'https://api.thegraph.com/subgraphs/name/thales-markets/tale-of-thales-arbitrum', // arbitrum
	},
};

module.exports = {
	pageResults,
	graphAPIEndpoints,
	binaryOptions: {
		markets({
			max = Infinity,
			creator = undefined,
			isOpen = undefined,
			minTimestamp = undefined,
			maxTimestamp = undefined,
			minMaturity = undefined,
			maxMaturity = undefined,
			network = 10,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.thalesMarkets[network],
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
							maturityDate_gte: minMaturity || undefined,
							maturityDate_lte: maxMaturity || undefined,
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
		rangedMarkets({
			max = Infinity,
			minTimestamp = undefined,
			maxTimestamp = undefined,
			leftPrice = undefined,
			rightPrice = undefined,
			leftMarket = undefined,
			rightMarket = undefined,
			minMaturity = undefined,
			maxMaturity = undefined,
			currencyKey = undefined,
			network = 10,
			marketIds = [],
		} = {}) {
			const marketIdsWithQuotes = marketIds.map(marketId => `\\"${marketId}\\"`);

			return pageResults({
				api: graphAPIEndpoints.thalesMarkets[network],
				max,
				query: {
					entity: 'rangedMarkets',
					selection: {
						orderBy: 'maturityDate',
						orderDirection: 'desc',
						where: {
							currencyKey: currencyKey ? `\\"${currencyKey}\\"` : undefined,
							timestamp_gte: minTimestamp || undefined,
							timestamp_lte: maxTimestamp || undefined,
							maturityDate_gte: minMaturity || undefined,
							maturityDate_lte: maxMaturity || undefined,
							leftPrice: leftPrice ? `\\"${leftPrice}\\"` : undefined,
							rightPrice: rightPrice ? `\\"${rightPrice}\\"` : undefined,
							leftMarket: leftMarket ? `\\"${leftMarket}\\"` : undefined,
							rightMarket: rightMarket ? `\\"${rightMarket}\\"` : undefined,
							id_in: marketIdsWithQuotes.length ? `[${marketIdsWithQuotes}]` : undefined,
						},
					},
					properties: [
						'id',
						'timestamp',
						'currencyKey',
						'maturityDate',
						'expiryDate',
						'leftPrice',
						'rightPrice',
						'inAddress',
						'outAddress',
						'leftMarket {id, creator, longAddress, shortAddress}',
						'rightMarket {id, creator, longAddress, shortAddress}',
						'isOpen',
						'result',
						'finalPrice',
					],
				},
			}).then(results =>
				results.map(
					({
						id,
						timestamp,
						currencyKey,
						maturityDate,
						expiryDate,
						leftPrice,
						rightPrice,
						inAddress,
						outAddress,
						leftMarket,
						rightMarket,
						isOpen,
						result,
						finalPrice,
					}) => ({
						address: id,
						timestamp: Number(timestamp * 1000),
						currencyKey: hexToAscii(currencyKey),
						maturityDate: Number(maturityDate) * 1000,
						expiryDate: Number(expiryDate) * 1000,
						leftPrice: leftPrice / 1e18,
						rightPrice: rightPrice / 1e18,
						inAddress,
						outAddress,
						leftMarket,
						rightMarket,
						isOpen,
						result: result !== null ? (result === 0 ? 'in' : 'out') : null,
						finalPrice: finalPrice / 1e18,
					}),
				),
			);
		},
		optionTransactions({
			max = Infinity,
			type = undefined,
			market = undefined,
			account = undefined,
			onlyForRangedMarkets = undefined,
			network = 10,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.thalesMarkets[network],
				max,
				query: {
					entity: 'optionTransactions',
					selection: {
						orderBy: 'timestamp',
						orderDirection: 'desc',
						where: {
							type: type ? `\\"${type}\\"` : undefined,
							market: market ? `\\"${market}\\"` : undefined,
							account: account ? `\\"${account}\\"` : undefined,
							isRangedMarket: onlyForRangedMarkets ? true : undefined,
						},
					},
					properties: [
						'id',
						'timestamp',
						'type',
						'account',
						'currencyKey',
						'side',
						'isRangedMarket',
						'amount',
						'market',
						'fee',
						'blockNumber',
					],
				},
			}).then(results =>
				results.map(
					({ id, timestamp, type, account, currencyKey, isRangedMarket, side, amount, market, fee, blockNumber }) => ({
						hash: getHashFromId(id),
						timestamp: Number(timestamp * 1000),
						type,
						account,
						currencyKey: currencyKey ? hexToAscii(currencyKey) : null,
						side: isRangedMarket ? (side === 0 ? 'in' : 'out') : side === 0 ? 'long' : 'short',
						isRangedMarket,
						amount: amount / 1e18,
						market,
						fee: fee ? fee / 1e18 : null,
						blockNumber: Number(blockNumber),
					}),
				),
			);
		},
		trades({
			max = Infinity,
			makerToken = undefined,
			takerToken = undefined,
			minTimestamp = undefined,
			maxTimestamp = undefined,
			maker = undefined,
			taker = undefined,
			market = undefined,
			network = 10,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.thalesMarkets[network],
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
							maker: maker ? `\\"${maker}\\"` : undefined,
							taker: taker ? `\\"${taker}\\"` : undefined,
							market: market ? `\\"${market}\\"` : undefined,
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
						makerAmount: convertAmount(makerAmount, network, makerToken),
						takerAmount: convertAmount(takerAmount, network, takerToken),
						market,
						orderSide,
						optionSide,
						blockNumber: Number(blockNumber),
					}),
				),
			);
		},
		rewards({
			max = Infinity,
			minTimestamp = undefined,
			maxTimestamp = undefined,
			periodStart = undefined,
			periodEnd = undefined,
			network = 10,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.thalesMarkets.rewards[network],
				max,
				query: {
					entity: 'trades',
					selection: {
						orderBy: 'timestamp',
						orderDirection: 'desc',
						where: {
							timestamp_gte: minTimestamp || undefined,
							timestamp_lte: maxTimestamp || undefined,
							timestamp_gt: periodStart || undefined,
							timestamp_lt: periodEnd || undefined,
						},
					},
					properties: ['id', 'timestamp', 'account', 'amount', 'type'],
				},
			}).then(results =>
				results.map(({ id, timestamp, account, amount, type }) => ({
					id,
					timestamp: Number(timestamp * 1000),
					account,
					amount: amount / 1e18,
					type,
				})),
			);
		},
		positionBalances({ max = Infinity, account = undefined, network = 10 } = {}) {
			return pageResults({
				api: graphAPIEndpoints.thalesMarkets.positions[network],
				max,
				query: {
					entity: 'positionBalances',
					selection: {
						where: {
							account: account ? `\\"${account}\\"` : undefined,
						},
					},
					properties: [
						'id',
						'account',
						'amount',
						'paid',
						'position {id, side, market { id, result, currencyKey, strikePrice, maturityDate, expiryDate, isOpen, finalPrice }}',
					],
				},
			}).then(results =>
				results.map(({ id, account, amount, paid, position }) => ({
					id,
					account,
					amount,
					paid,
					position,
				})),
			);
		},
		rangedPositionBalances({ max = Infinity, account = undefined, network = 10 } = {}) {
			return pageResults({
				api: graphAPIEndpoints.thalesMarkets.positions[network],
				max,
				query: {
					entity: 'rangedPositionBalances',
					selection: {
						where: {
							account: account ? `\\"${account}\\"` : undefined,
						},
					},
					properties: [
						'id',
						'account',
						'amount',
						'paid',
						'position {id, side, market { id, timestamp, currencyKey, maturityDate, expiryDate, leftPrice, rightPrice, inAddress, outAddress, isOpen, result, finalPrice}}',
					],
				},
			}).then(results =>
				results.map(({ id, account, amount, paid, position }) => ({
					id,
					account,
					amount,
					paid,
					position,
				})),
			);
		},
		accountBuyVolumes({
			max = Infinity,
			type = undefined,
			account = undefined,
			network = 10,
			minTimestamp = undefined,
			maxTimestamp = undefined,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.thalesMarkets[network],
				max,
				query: {
					entity: 'accountBuyVolumes',
					selection: {
						orderBy: 'timestamp',
						orderDirection: 'desc',
						where: {
							account: account ? `\\"${account}\\"` : undefined,
							type: type ? `\\"${type}\\"` : undefined,
							timestamp_gte: minTimestamp ? minTimestamp : undefined,
							timestamp_lte: maxTimestamp ? maxTimestamp : undefined,
						},
					},
					properties: ['id', 'timestamp', 'type', 'account', 'amount'],
				},
			}).then(results =>
				results.map(({ id, timestamp, type, account, amount }) => ({
					id,
					timestamp: Number(timestamp * 1000),
					type,
					account,
					amount: amount / 1e18,
				})),
			);
		},
		referrers({ max = Infinity, address = undefined, network = 10 } = {}) {
			return pageResults({
				api: graphAPIEndpoints.thalesMarkets[network],
				max,
				query: {
					entity: 'referrers',
					selection: {
						where: {
							id: address ? `\\"${address}\\"` : undefined,
						},
					},
					properties: ['id', 'trades', 'totalVolume', 'totalEarned', 'timestamp'],
				},
			}).then(results =>
				results.map(({ id, trades, totalVolume, totalEarned, timestamp }) => ({
					id,
					trades: Number(trades),
					totalVolume: convertAmount(totalVolume, network),
					totalEarned: convertAmount(totalEarned, network),
					timestamp: Number(timestamp * 1000),
				})),
			);
		},
		referralTransfers({ max = Infinity, trader = undefined, referrer = undefined, network = 10 } = {}) {
			return pageResults({
				api: graphAPIEndpoints.thalesMarkets[network],
				max,
				query: {
					entity: 'referralTransfers',
					selection: {
						where: {
							trader: trader ? `\\"${trader}\\"` : undefined,
							refferer: referrer ? `\\"${referrer}\\"` : undefined,
						},
					},
					properties: ['id', 'refferer', 'trader', 'amount', 'volume', 'timestamp'],
				},
			}).then(results =>
				results.map(({ id, refferer, trader, amount, volume, timestamp }) => ({
					id,
					refferer,
					trader,
					amount: convertAmount(amount, network),
					volume: convertAmount(volume, network),
					timestamp: Number(timestamp * 1000),
				})),
			);
		},
		referredTraders({ max = Infinity, referrer = undefined, network = 10 } = {}) {
			return pageResults({
				api: graphAPIEndpoints.thalesMarkets[network],
				max,
				query: {
					entity: 'referredTraders',
					selection: {
						where: {
							refferer: referrer ? `\\"${referrer}\\"` : undefined,
						},
					},
					properties: ['id', 'trades', 'totalVolume', 'totalEarned', 'refferer { id }', 'timestamp'],
				},
			}).then(results =>
				results.map(({ id, trades, totalVolume, totalEarned, refferer, timestamp }) => ({
					id,
					trades: Number(trades),
					totalVolume: convertAmount(totalVolume, network),
					totalEarned: convertAmount(totalEarned, network),
					refferer,
					timestamp: Number(timestamp * 1000),
				})),
			);
		},

		tokenTransactions({
			max = Infinity,
			type = undefined,
			account = undefined,
			type_in = undefined,
			network = 10,
			onlyWithProtocolReward = false,
			minTimestamp = undefined,
			maxTimestamp = undefined,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.token[network],
				max,
				query: {
					entity: 'tokenTransactions',
					selection: {
						orderBy: 'timestamp',
						orderDirection: 'desc',
						where: {
							account: account ? `\\"${account}\\"` : undefined,
							type: type ? `\\"${type}\\"` : undefined,
							type_in: type_in ? type_in : undefined,
							timestamp_gte: minTimestamp ? minTimestamp : undefined,
							timestamp_lte: maxTimestamp ? maxTimestamp : undefined,
							...(onlyWithProtocolReward && { protocolRewards_not: 0 }),
						},
					},
					properties: ['id', 'timestamp', 'protocolRewards', 'type', 'account', 'amount', 'blockNumber', 'destAccount'],
				},
			}).then(results =>
				results.map(({ id, timestamp, type, account, amount, blockNumber, protocolRewards, destAccount }) => ({
					hash: getHashFromId(id),
					timestamp: Number(timestamp * 1000),
					type,
					account,
					destAccount,
					amount: amount / 1e18,
					protocolRewards: protocolRewards / 1e18,
					blockNumber: Number(blockNumber),
				})),
			);
		},
		stakers({ max = Infinity, network = 10 } = {}) {
			return pageResults({
				api: graphAPIEndpoints.token[network],
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
		canClaimOnBehalfItems({
			max = Infinity,
			sender = undefined,
			network = 10,
			minTimestamp = undefined,
			maxTimestamp = undefined,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.token[network],
				max,
				query: {
					entity: 'canClaimOnBehalfItems',
					selection: {
						orderBy: 'timestamp',
						orderDirection: 'desc',
						where: {
							sender: sender ? `\\"${sender}\\"` : undefined,
							timestamp_gte: minTimestamp ? minTimestamp : undefined,
							timestamp_lte: maxTimestamp ? maxTimestamp : undefined,
						},
					},
					properties: ['id', 'transactionHash', 'timestamp', 'sender', 'account', 'canClaimOnBehalf'],
				},
			}).then(results =>
				results.map(({ id, transactionHash, timestamp, sender, account, canClaimOnBehalf }) => ({
					id,
					hash: transactionHash,
					timestamp: Number(timestamp * 1000),
					sender,
					account,
					canClaimOnBehalf,
				})),
			);
		},
		vaultTransactions({
			max = Infinity,
			market = undefined,
			vault = undefined,
			minTimestamp = undefined,
			maxTimestamp = undefined,
			startPeriod = undefined,
			endPeriod = undefined,
			network = 10,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.thalesMarkets[network],
				max,
				query: {
					entity: 'vaultTransactions',
					selection: {
						orderBy: 'timestamp',
						orderDirection: 'desc',
						where: {
							market: market ? `\\"${market}\\"` : undefined,
							vault: vault ? `\\"${vault}\\"` : undefined,
							timestamp_gte: minTimestamp || undefined,
							timestamp_lte: maxTimestamp || undefined,
							wholeMarket_: { maturityDate_gte: startPeriod || undefined, maturityDate_lt: endPeriod || undefined },
						},
					},
					properties: [
						'id',
						'vault',
						'hash',
						'timestamp',
						'market',
						'amount',
						'paid',
						'position',
						'wholeMarket { id, customMarket, customOracle, id, timestamp, creator, currencyKey, strikePrice, maturityDate, expiryDate, isOpen, poolSize, longAddress, shortAddress, result finalPrice }',
						'round',
					],
				},
			}).then(results =>
				results.map(({ id, hash, timestamp, market, vault, amount, paid, position, wholeMarket, round }) => ({
					id,
					timestamp: Number(timestamp * 1000),
					hash,
					market,
					vault,
					amount: Number(amount) / 1e18,
					paid: convertAmount(Number(paid), network),
					position: Number(position),
					wholeMarket,
					round: Number(round),
				})),
			);
		},
		vaultPnls({
			max = Infinity,
			vault = undefined,
			minTimestamp = undefined,
			maxTimestamp = undefined,
			network = 10,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.thalesMarkets[network],
				max,
				query: {
					entity: 'vaultPnls',
					selection: {
						orderBy: 'timestamp',
						orderDirection: 'desc',
						where: {
							vault: vault ? `\\"${vault}\\"` : undefined,
							timestamp_gte: minTimestamp || undefined,
							timestamp_lte: maxTimestamp || undefined,
						},
					},
					properties: ['id', 'vault', 'timestamp', 'round', 'pnl'],
				},
			}).then(results =>
				results.map(({ id, vault, timestamp, round, pnl }) => ({
					id,
					vault,
					timestamp,
					round: Number(round),
					pnl: Number(pnl) / 1e18,
				})),
			);
		},
		vaultUserTransactions({
			max = Infinity,
			vault = undefined,
			type = undefined,
			account = undefined,
			minTimestamp = undefined,
			maxTimestamp = undefined,
			network = 10,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.thalesMarkets[network],
				max,
				query: {
					entity: 'vaultUserTransactions',
					selection: {
						orderBy: 'timestamp',
						orderDirection: 'desc',
						where: {
							vault: vault ? `\\"${vault}\\"` : undefined,
							account: account ? `\\"${account}\\"` : undefined,
							type: type ? `\\"${type}\\"` : undefined,
							timestamp_gte: minTimestamp ? minTimestamp : undefined,
							timestamp_lte: maxTimestamp ? maxTimestamp : undefined,
						},
					},
					properties: ['id', 'vault', 'hash', 'timestamp', 'type', 'account', 'amount', 'round'],
				},
			}).then(results =>
				results.map(({ id, vault, hash, timestamp, type, account, amount, round }) => ({
					id,
					vault,
					hash,
					timestamp: Number(timestamp * 1000),
					type,
					account,
					amount: convertAmount(Number(amount), network),
					round: Number(round),
				})),
			);
		},
		liquidityPoolPnls({
			max = Infinity,
			liquidityPool = undefined,
			minTimestamp = undefined,
			maxTimestamp = undefined,
			network = 10,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.thalesMarkets.lp[network],
				max,
				query: {
					entity: 'liquidityPoolPnls',
					selection: {
						orderBy: 'timestamp',
						orderDirection: 'desc',
						where: {
							liquidityPool: liquidityPool ? `\\"${liquidityPool}\\"` : undefined,
							timestamp_gte: minTimestamp || undefined,
							timestamp_lte: maxTimestamp || undefined,
						},
					},
					properties: ['id', 'liquidityPool', 'timestamp', 'round', 'pnl'],
				},
			}).then(results =>
				results.map(({ id, liquidityPool, timestamp, round, pnl }) => ({
					id,
					liquidityPool,
					timestamp,
					round: Number(round),
					pnl: Number(pnl) / 1e18,
				})),
			);
		},
		liquidityPoolUserTransactions({
			max = Infinity,
			liquidityPool = undefined,
			type = undefined,
			account = undefined,
			minTimestamp = undefined,
			maxTimestamp = undefined,
			network = 10,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.thalesMarkets.lp[network],
				max,
				query: {
					entity: 'liquidityPoolUserTransactions',
					selection: {
						orderBy: 'timestamp',
						orderDirection: 'desc',
						where: {
							liquidityPool: liquidityPool ? `\\"${liquidityPool}\\"` : undefined,
							account: account ? `\\"${account}\\"` : undefined,
							type: type ? `\\"${type}\\"` : undefined,
							timestamp_gte: minTimestamp ? minTimestamp : undefined,
							timestamp_lte: maxTimestamp ? maxTimestamp : undefined,
						},
					},
					properties: ['id', 'liquidityPool', 'hash', 'timestamp', 'type', 'account', 'amount', 'round'],
				},
			}).then(results =>
				results.map(({ id, liquidityPool, hash, timestamp, type, account, amount, round }) => ({
					id,
					liquidityPool,
					hash,
					timestamp: Number(timestamp * 1000),
					type,
					account,
					amount: convertAmount(amount, network),
					round: Number(round),
				})),
			);
		},
		mintTransactions({ max = Infinity, minter = undefined, network = 10 } = {}) {
			return pageResults({
				api: graphAPIEndpoints.taleOfThales[network],
				max,
				query: {
					entity: 'mintTransactions',
					selection: {
						orderBy: 'timestamp',
						orderDirection: 'desc',
						where: {
							minter: minter ? `\\"${minter}\\"` : undefined,
						},
					},
					properties: ['id', 'minter', 'item {id, type}'],
				},
			}).then(results =>
				results.map(({ id, minter, item }) => ({
					id,
					minter,
					item,
				})),
			);
		},
	},
	sportMarkets: {
		markets({
			max = Infinity,
			isOpen = undefined,
			isCanceled = undefined,
			isResolved = undefined,
			isPaused = undefined,
			minTimestamp = undefined,
			maxTimestamp = undefined,
			minMaturityDate = undefined,
			maxMaturityDate = undefined,
			market = undefined,
			parentMarket = undefined,
			network = 10,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.sportMarkets[network],
				max,
				query: {
					entity: 'sportMarkets',
					selection: {
						orderBy: 'maturityDate',
						orderDirection: 'asc',
						where: {
							address: market ? `\\"${market}\\"` : undefined,
							parentMarket: parentMarket ? `\\"${parentMarket}\\"` : undefined,
							isOpen: isOpen !== undefined ? isOpen : undefined,
							isCanceled: isCanceled !== undefined ? isCanceled : undefined,
							isResolved: isResolved !== undefined ? isResolved : undefined,
							isPaused: isPaused !== undefined ? isPaused : undefined,
							timestamp_gte: minTimestamp || undefined,
							timestamp_lte: maxTimestamp || undefined,
							maturityDate_gte: minMaturityDate || undefined,
							maturityDate_lte: maxMaturityDate || undefined,
						},
					},
					properties: [
						'id',
						'timestamp',
						'address',
						'gameId',
						'maturityDate',
						'tags',
						'isOpen',
						'isResolved',
						'isCanceled',
						'finalResult',
						'poolSize',
						'numberOfParticipants',
						'homeTeam',
						'awayTeam',
						'homeOdds',
						'awayOdds',
						'drawOdds',
						'homeScore',
						'awayScore',
						'isApex',
						'resultDetails',
						'isPaused',
						'leagueRaceName',
						'qualifyingStartTime',
						'arePostQualifyingOddsFetched',
						'betType',
						'parentMarket',
						'spread',
						'total',
						'doubleChanceMarketType',
						'playerId',
						'playerName',
						'playerPropsLine',
						'playerPropsType',
						'playerPropsOutcome',
						'playerPropsScore ',
					],
				},
			}).then(results =>
				results.map(
					({
						id,
						timestamp,
						address,
						gameId,
						maturityDate,
						tags,
						isOpen,
						isResolved,
						isCanceled,
						finalResult,
						poolSize,
						numberOfParticipants,
						homeTeam,
						awayTeam,
						homeOdds,
						awayOdds,
						drawOdds,
						homeScore,
						awayScore,
						isApex,
						resultDetails,
						isPaused,
						leagueRaceName,
						qualifyingStartTime,
						arePostQualifyingOddsFetched,
						betType,
						parentMarket,
						spread,
						total,
						doubleChanceMarketType,
						playerId,
						playerName,
						playerPropsLine,
						playerPropsType,
						playerPropsOutcome,
						playerPropsScore,
					}) => ({
						id,
						timestamp: Number(timestamp * 1000),
						address,
						gameId,
						maturityDate: Number(maturityDate * 1000),
						tags,
						isOpen,
						isResolved,
						isCanceled,
						finalResult: Number(finalResult),
						poolSize: poolSize / 1e18,
						homeTeam,
						awayTeam,
						numberOfParticipants: Number(numberOfParticipants),
						homeOdds: homeOdds / 1e18,
						awayOdds: awayOdds / 1e18,
						drawOdds: drawOdds / 1e18,
						homeScore: Number(homeScore),
						awayScore: Number(awayScore),
						isApex,
						resultDetails,
						isPaused,
						leagueRaceName,
						qualifyingStartTime:
							qualifyingStartTime !== undefined && qualifyingStartTime !== null
								? Number(qualifyingStartTime * 1000)
								: null,
						arePostQualifyingOddsFetched,
						betType: betType !== undefined && betType !== null ? Number(betType) : 0,
						parentMarket,
						spread: Number(spread),
						total: Number(total),
						doubleChanceMarketType,
						playerId,
						playerName,
						playerPropsLine: playerPropsLine !== undefined && playerPropsLine !== null ? Number(playerPropsLine) : 0,
						playerPropsType: playerPropsType !== undefined && playerPropsType !== null ? Number(playerPropsType) : 0,
						playerPropsOutcome,
						playerPropsScore:
							playerPropsScore !== undefined && playerPropsScore !== null ? Number(playerPropsScore) : 0,
					}),
				),
			);
		},
		marketTransactions({
			max = Infinity,
			market = undefined,
			type = undefined,
			account = undefined,
			minTimestamp = undefined,
			maxTimestamp = undefined,
			startPeriod = undefined,
			endPeriod = undefined,
			parentMarket = undefined,
			leagueTag = undefined,
			network = 10,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.sportMarkets[network],
				max,
				query: {
					entity: 'marketTransactions',
					selection: {
						orderBy: 'timestamp',
						orderDirection: 'desc',
						where: {
							market: market ? `\\"${market}\\"` : undefined,
							type: type ? `\\"${type}\\"` : undefined,
							account: account ? `\\"${account}\\"` : undefined,
							timestamp_gte: minTimestamp || undefined,
							timestamp_lte: maxTimestamp || undefined,
							wholeMarket_: {
								maturityDate_gte: startPeriod || undefined,
								maturityDate_lt: endPeriod || undefined,
								parentMarket: parentMarket ? `\\"${parentMarket}\\"` : undefined,
								tags: leagueTag ? `[\\"${leagueTag}\\"]` : undefined,
							},
						},
					},
					properties: [
						'id',
						'hash',
						'timestamp',
						'type',
						'account',
						'market',
						'amount',
						'paid',
						'position',
						'wholeMarket { id, timestamp, address, gameId, maturityDate, tags, isOpen, isResolved, isCanceled, finalResult, poolSize, numberOfParticipants, homeTeam, awayTeam, homeOdds, awayOdds, drawOdds, homeScore, awayScore, isPaused, betType, parentMarket, spread, total, doubleChanceMarketType, playerId, playerName, playerPropsLine, playerPropsType, playerPropsOutcome, playerPropsScore }',
					],
				},
			}).then(results =>
				results.map(({ id, hash, timestamp, type, account, market, amount, paid, position, wholeMarket }) => ({
					id,
					timestamp: Number(timestamp * 1000),
					hash,
					type,
					account,
					market,
					amount: Number(amount) / 1e18,
					paid: convertAmount(Number(paid), network),
					position: Number(position),
					wholeMarket: {
						...wholeMarket,
						maturityDate: Number(wholeMarket.maturityDate * 1000),
						finalResult: Number(wholeMarket.finalResult),
						homeOdds: wholeMarket.homeOdds / 1e18,
						awayOdds: wholeMarket.awayOdds / 1e18,
						drawOdds: wholeMarket.drawOdds / 1e18,
						homeScore: Number(wholeMarket.homeScore),
						awayScore: Number(wholeMarket.awayScore),
						betType:
							wholeMarket.betType !== undefined && wholeMarket.betType !== null ? Number(wholeMarket.betType) : 0,
						spread: Number(wholeMarket.spread),
						total: Number(wholeMarket.total),
						playerId: wholeMarket.playerId,
						playerName: wholeMarket.playerName,
						playerPropsLine:
							wholeMarket.playerPropsLine !== undefined && wholeMarket.playerPropsLine !== null
								? Number(wholeMarket.playerPropsLine)
								: 0,
						playerPropsType:
							wholeMarket.playerPropsType !== undefined && wholeMarket.playerPropsType !== null
								? Number(wholeMarket.playerPropsType)
								: 0,
						playerPropsOutcome: wholeMarket.playerPropsOutcome,
						playerPropsScore:
							wholeMarket.playerPropsScore !== undefined && wholeMarket.playerPropsScore !== null
								? Number(wholeMarket.playerPropsScore)
								: 0,
					},
				})),
			);
		},
		positionBalances({
			max = Infinity,
			account = undefined,
			isClaimable = undefined,
			isClaimed = undefined,
			network = 10,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.sportMarkets[network],
				max,
				query: {
					entity: 'positionBalances',
					selection: {
						where: {
							account: account ? `\\"${account}\\"` : undefined,
							claimed: isClaimed !== undefined ? isClaimed : undefined,
							position_: {
								claimable: isClaimable !== undefined ? isClaimable : undefined,
							},
						},
					},
					properties: [
						'id',
						'firstTxHash',
						'account',
						'amount',
						'position {id, side, claimable, market { id, timestamp, address, gameId, maturityDate, tags, isOpen, isResolved, isCanceled, finalResult, poolSize, numberOfParticipants, homeTeam, awayTeam, homeOdds, awayOdds, drawOdds, homeScore, awayScore, isPaused, betType, parentMarket, spread, total, doubleChanceMarketType, playerId, playerName, playerPropsLine, playerPropsType, playerPropsOutcome, playerPropsScore }}',
						'sUSDPaid',
						'claimed',
					],
				},
			}).then(results =>
				results.map(({ id, firstTxHash, account, amount, position, sUSDPaid, claimed }) => ({
					id,
					firstTxHash,
					account,
					amount,
					position: {
						...position,
						market: {
							...position.market,
							timestamp: Number(position.market.timestamp * 1000),
							maturityDate: Number(position.market.maturityDate * 1000),
							finalResult: Number(position.market.finalResult),
							homeOdds: position.market.homeOdds / 1e18,
							awayOdds: position.market.awayOdds / 1e18,
							drawOdds: position.market.drawOdds / 1e18,
							homeScore: Number(position.market.homeScore),
							awayScore: Number(position.market.awayScore),
							betType:
								position.market.betType !== undefined && position.market.betType !== null
									? Number(position.market.betType)
									: 0,
							spread: Number(position.market.spread),
							total: Number(position.market.total),
							playerId: position.market.playerId,
							playerName: position.market.playerName,
							playerPropsLine:
								position.market.playerPropsLine !== undefined && position.market.playerPropsLine !== null
									? Number(position.market.playerPropsLine)
									: 0,
							playerPropsType:
								position.market.playerPropsType !== undefined && position.market.playerPropsType !== null
									? Number(position.market.playerPropsType)
									: 0,
							playerPropsOutcome: position.market.playerPropsOutcome,
							playerPropsScore:
								position.market.playerPropsScore !== undefined && position.market.playerPropsScore !== null
									? Number(position.market.playerPropsScore)
									: 0,
						},
					},
					sUSDPaid: convertAmount(Number(sUSDPaid), network),
					claimed,
				})),
			);
		},
		claimTxes({
			max = Infinity,
			account = undefined,
			market = undefined,
			minTimestamp = undefined,
			maxTimestamp = undefined,
			startPeriod = undefined,
			endPeriod = undefined,
			parentMarket = undefined,
			network = 10,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.sportMarkets[network],
				max,
				query: {
					entity: 'claimTxes',
					selection: {
						where: {
							market_: {
								address: market ? `\\"${market}\\"` : undefined,
								maturityDate_gte: startPeriod || undefined,
								maturityDate_lte: endPeriod || undefined,
								parentMarket: parentMarket ? `\\"${parentMarket}\\"` : undefined,
							},
							account: account ? `\\"${account}\\"` : undefined,
							timestamp_gte: minTimestamp || undefined,
							timestamp_lte: maxTimestamp || undefined,
						},
					},
					properties: [
						'id',
						'account',
						'amount',
						'timestamp',
						'caller',
						'market { id, timestamp, address, maturityDate, tags, isOpen, isResolved, isCanceled, finalResult, poolSize, numberOfParticipants, homeTeam, awayTeam, homeOdds, awayOdds, drawOdds, homeScore, awayScore, parentMarket, betType, spread, total, doubleChanceMarketType, playerId, playerName, playerPropsLine, playerPropsType, playerPropsOutcome, playerPropsScore }',
					],
				},
			}).then(results =>
				results.map(({ id, account, amount, timestamp, caller, market }) => ({
					id,
					account,
					amount: Number(amount) / 1e18,
					timestamp: Number(timestamp * 1000),
					caller,
					market,
				})),
			);
		},
		overtimeVouchers({ max = Infinity, address = undefined, network = 10 } = {}) {
			return pageResults({
				api: graphAPIEndpoints.sportMarkets[network],
				max,
				query: {
					entity: 'overtimeVouchers',
					selection: {
						orderBy: 'id',
						orderDirection: 'asc',
						where: {
							address: address ? `\\"${address}\\"` : undefined,
						},
					},
					properties: ['id', 'address'],
				},
			}).then(results =>
				results.map(({ id, address }) => ({
					id,
					address,
				})),
			);
		},
		parlayMarkets({
			max = Infinity,
			network = 10,
			account = undefined,
			address = undefined,
			minTimestamp = undefined,
			maxTimestamp = undefined,
			startPeriod = undefined,
			endPeriod = undefined,
			won = undefined,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.sportMarkets[network],
				max,
				query: {
					entity: 'parlayMarkets',
					selection: {
						orderBy: 'timestamp',
						orderDirection: 'desc',
						where: {
							id: address ? `\\"${address}\\"` : undefined,
							account: account ? `\\"${account}\\"` : undefined,
							timestamp_gte: minTimestamp || undefined,
							timestamp_lte: maxTimestamp || undefined,
							won: won,
							lastGameStarts_gte: startPeriod || undefined,
							lastGameStarts_lt: endPeriod || undefined,
						},
					},
					properties: [
						'id',
						'txHash',
						'sportMarkets { id, timestamp, address, gameId, maturityDate, tags, isOpen, isResolved, isCanceled, finalResult, poolSize, numberOfParticipants, homeTeam, awayTeam, homeOdds, awayOdds, drawOdds, homeScore, awayScore, isPaused, betType, parentMarket, spread, total, doubleChanceMarketType, playerId, playerName, playerPropsLine, playerPropsType, playerPropsOutcome, playerPropsScore }',
						'sportMarketsFromContract',
						'positions {id, side, claimable, market { id, timestamp, address, maturityDate, tags, isOpen, isResolved, isCanceled, finalResult, poolSize, numberOfParticipants, homeTeam, awayTeam, homeOdds, awayOdds, drawOdds, homeScore, awayScore, parentMarket, betType, spread, total, doubleChanceMarketType, playerId, playerName, playerPropsLine, playerPropsType, playerPropsOutcome, playerPropsScore }}',
						'positionsFromContract',
						'marketQuotes',
						'account',
						'totalAmount',
						'sUSDPaid',
						'sUSDAfterFees',
						'totalQuote',
						'skewImpact',
						'timestamp',
						'lastGameStarts',
						'blockNumber',
						'claimed',
						'won',
					],
				},
			}).then(results =>
				results.map(
					({
						id,
						txHash,
						sportMarkets,
						sportMarketsFromContract,
						positions,
						positionsFromContract,
						marketQuotes,
						account,
						totalAmount,
						sUSDPaid,
						sUSDAfterFees,
						totalQuote,
						skewImpact,
						timestamp,
						lastGameStarts,
						blockNumber,
						claimed,
						won,
					}) => ({
						id,
						txHash,
						sportMarkets: sportMarkets.map(market => {
							return {
								id: market.id,
								timestamp: Number(market.timestamp * 1000),
								address: market.address,
								gameId: market.gameId,
								maturityDate: Number(market.maturityDate * 1000),
								tags: market.tags,
								isOpen: market.isOpen,
								isResolved: market.isResolved,
								isCanceled: market.isCanceled,
								finalResult: Number(market.finalResult),
								poolSize: market.poolSize / 1e18,
								homeTeam: market.homeTeam,
								awayTeam: market.awayTeam,
								numberOfParticipants: Number(market.numberOfParticipants),
								homeOdds: market.homeOdds / 1e18,
								awayOdds: market.awayOdds / 1e18,
								drawOdds: market.drawOdds / 1e18,
								homeScore: Number(market.homeScore),
								awayScore: Number(market.awayScore),
								isApex: market.isApex,
								resultDetails: market.resultDetails,
								isPaused: market.isPaused,
								leagueRaceName: market.leagueRaceName,
								qualifyingStartTime:
									market.qualifyingStartTime !== undefined && market.qualifyingStartTime !== null
										? Number(market.qualifyingStartTime * 1000)
										: null,
								arePostQualifyingOddsFetched: market.arePostQualifyingOddsFetched,
								betType: market.betType !== undefined && market.betType !== null ? Number(market.betType) : 0,
								parentMarket: market.parentMarket,
								spread: Number(market.spread),
								total: Number(market.total),
								doubleChanceMarketType: market.doubleChanceMarketType,
								playerId: market.playerId,
								playerName: market.playerName,
								playerPropsLine:
									market.playerPropsLine !== undefined && market.playerPropsLine !== null
										? Number(market.playerPropsLine)
										: 0,
								playerPropsType:
									market.playerPropsType !== undefined && market.playerPropsType !== null
										? Number(market.playerPropsType)
										: 0,
								playerPropsOutcome: market.playerPropsOutcome,
								playerPropsScore:
									market.playerPropsScore !== undefined && market.playerPropsScore !== null
										? Number(market.playerPropsScore)
										: 0,
							};
						}),
						sportMarketsFromContract,
						positions,
						positionsFromContract,
						marketQuotes: marketQuotes ? marketQuotes.map(item => Number(item) / 1e18) : null,
						account,
						totalAmount: Number(totalAmount) / 1e18,
						sUSDPaid: convertAmount(Number(sUSDPaid), network),
						sUSDAfterFees: convertAmount(Number(sUSDAfterFees), network),
						totalQuote: Number(totalQuote) / 1e18,
						skewImpact: Number(skewImpact) / 1e18,
						timestamp: Number(timestamp * 1000),
						lastGameStarts: Number(lastGameStarts * 1000),
						blockNumber,
						claimed,
						won,
					}),
				),
			);
		},
		usersStats({ max = Infinity, network = 10, address = undefined } = {}) {
			return pageResults({
				api: graphAPIEndpoints.sportMarkets[network],
				max,
				query: {
					entity: 'users',
					selection: {
						orderBy: 'id',
						orderDirection: 'asc',
						where: {
							id: address ? `\\"${address}\\"` : undefined,
						},
					},
					properties: ['id', 'pnl', 'volume', 'trades'],
				},
			}).then(results =>
				results.map(({ id, pnl, volume, trades }) => ({
					id,
					pnl: Number(pnl) / 1e18,
					volume: convertAmount(Number(volume), network),
					trades,
				})),
			);
		},
		vaultTransactions({
			max = Infinity,
			market = undefined,
			vault = undefined,
			minTimestamp = undefined,
			maxTimestamp = undefined,
			startPeriod = undefined,
			endPeriod = undefined,
			network = 10,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.sportMarkets[network],
				max,
				query: {
					entity: 'vaultTransactions',
					selection: {
						orderBy: 'timestamp',
						orderDirection: 'desc',
						where: {
							market: market ? `\\"${market}\\"` : undefined,
							vault: vault ? `\\"${vault}\\"` : undefined,
							timestamp_gte: minTimestamp || undefined,
							timestamp_lte: maxTimestamp || undefined,
							wholeMarket_: { maturityDate_gte: startPeriod || undefined, maturityDate_lt: endPeriod || undefined },
						},
					},
					properties: [
						'id',
						'vault',
						'hash',
						'timestamp',
						'market',
						'amount',
						'paid',
						'position',
						'wholeMarket { id, timestamp, address, maturityDate, tags, isOpen, isResolved, isCanceled, finalResult, poolSize, numberOfParticipants, homeTeam, awayTeam, homeOdds, awayOdds, drawOdds, homeScore, awayScore, parentMarket, betType, spread, total, doubleChanceMarketType, playerId, playerName, playerPropsLine, playerPropsType, playerPropsOutcome, playerPropsScore }',
						'round',
					],
				},
			}).then(results =>
				results.map(({ id, hash, timestamp, market, vault, amount, paid, position, wholeMarket, round }) => ({
					id,
					timestamp: Number(timestamp * 1000),
					hash,
					market,
					vault,
					amount: Number(amount) / 1e18,
					paid: convertAmount(Number(paid), network),
					position: Number(position),
					wholeMarket,
					round: Number(round),
				})),
			);
		},
		parlayVaultTransactions({
			max = Infinity,
			market = undefined,
			vault = undefined,
			minTimestamp = undefined,
			maxTimestamp = undefined,
			startPeriod = undefined,
			endPeriod = undefined,
			network = 10,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.sportMarkets[network],
				max,
				query: {
					entity: 'parlayVaultTransactions',
					selection: {
						orderBy: 'timestamp',
						orderDirection: 'desc',
						where: {
							market: market ? `\\"${market}\\"` : undefined,
							vault: vault ? `\\"${vault}\\"` : undefined,
							timestamp_gte: minTimestamp || undefined,
							timestamp_lte: maxTimestamp || undefined,
							wholeMarket_: { maturityDate_gte: startPeriod || undefined, maturityDate_lt: endPeriod || undefined },
						},
					},
					properties: [
						'id',
						'vault',
						'hash',
						'timestamp',
						'market',
						'paid',
						'wholeMarket { id, sportMarketsFromContract, positionsFromContract, marketQuotes, account, totalAmount, sUSDPaid, sUSDAfterFees, totalQuote, skewImpact, timestamp, lastGameStarts, blockNumber, claimed, won, sportMarkets {id, timestamp, address, maturityDate, tags, isOpen, isResolved, isCanceled, finalResult, poolSize, numberOfParticipants, homeTeam, awayTeam, homeOdds, awayOdds, drawOdds, homeScore, awayScore, parentMarket, betType, spread, total, doubleChanceMarketType, playerId, playerName, playerPropsLine, playerPropsType, playerPropsOutcome, playerPropsScore }, positions {id, side, claimable, market { id, timestamp, address, maturityDate, tags, isOpen, isResolved, isCanceled, finalResult, poolSize, numberOfParticipants, homeTeam, awayTeam, homeOdds, awayOdds, drawOdds, homeScore, awayScore, parentMarket, betType, spread, total, doubleChanceMarketType, playerId, playerName, playerPropsLine, playerPropsType, playerPropsOutcome, playerPropsScore }}}',
						'round',
					],
				},
			}).then(results =>
				results.map(({ id, hash, timestamp, market, vault, paid, wholeMarket, round }) => ({
					id,
					timestamp: Number(timestamp * 1000),
					hash,
					market,
					vault,
					paid: convertAmount(Number(paid), network),
					wholeMarket: (wholeMarket => {
						return {
							id: wholeMarket.id,
							txHash: wholeMarket.txHash,
							sportMarkets: wholeMarket.sportMarkets.map(market => {
								return {
									id: market.id,
									timestamp: Number(market.timestamp * 1000),
									address: market.address,
									maturityDate: Number(market.maturityDate * 1000),
									tags: market.tags,
									isOpen: market.isOpen,
									isResolved: market.isResolved,
									isCanceled: market.isCanceled,
									finalResult: Number(market.finalResult),
									poolSize: market.poolSize / 1e18,
									homeTeam: market.homeTeam,
									awayTeam: market.awayTeam,
									numberOfParticipants: Number(market.numberOfParticipants),
									homeOdds: market.homeOdds / 1e18,
									awayOdds: market.awayOdds / 1e18,
									drawOdds: market.drawOdds / 1e18,
									homeScore: Number(market.homeScore),
									awayScore: Number(market.awayScore),
									isApex: market.isApex,
									resultDetails: market.resultDetails,
									isPaused: market.isPaused,
									leagueRaceName: market.leagueRaceName,
									qualifyingStartTime:
										market.qualifyingStartTime !== undefined && market.qualifyingStartTime !== null
											? Number(market.qualifyingStartTime * 1000)
											: null,
									arePostQualifyingOddsFetched: market.arePostQualifyingOddsFetched,
									betType: market.betType !== undefined && market.betType !== null ? Number(market.betType) : 0,
									parentMarket: market.parentMarket,
									spread: Number(market.spread),
									total: Number(market.total),
									doubleChanceMarketType: market.doubleChanceMarketType,
									playerId: market.playerId,
									playerName: market.playerName,
									playerPropsLine:
										market.playerPropsLine !== undefined && market.playerPropsLine !== null
											? Number(market.playerPropsLine)
											: 0,
									playerPropsType:
										market.playerPropsType !== undefined && market.playerPropsType !== null
											? Number(market.playerPropsType)
											: 0,
									playerPropsOutcome: market.playerPropsOutcome,
									playerPropsScore:
										market.playerPropsScore !== undefined && market.playerPropsScore !== null
											? Number(market.playerPropsScore)
											: 0,
								};
							}),
							sportMarketsFromContract: wholeMarket.sportMarketsFromContract,
							positions: wholeMarket.positions,
							positionsFromContract: wholeMarket.positionsFromContract,
							marketQuotes: wholeMarket.marketQuotes ? wholeMarket.marketQuotes.map(item => Number(item) / 1e18) : null,
							account: wholeMarket.account,
							totalAmount: Number(wholeMarket.totalAmount) / 1e18,
							sUSDPaid: convertAmount(Number(wholeMarket.sUSDPaid), network),
							sUSDAfterFees: convertAmount(Number(wholeMarket.sUSDAfterFees), network),
							totalQuote: Number(wholeMarket.totalQuote) / 1e18,
							skewImpact: Number(wholeMarket.skewImpact) / 1e18,
							timestamp: Number(wholeMarket.timestamp * 1000),
							lastGameStarts: Number(wholeMarket.lastGameStarts * 1000),
							blockNumber: wholeMarket.blockNumber,
							claimed: wholeMarket.claimed,
							won: wholeMarket.won,
						};
					})(wholeMarket),
					round: Number(round),
				})),
			);
		},
		vaultPnls({
			max = Infinity,
			vault = undefined,
			minTimestamp = undefined,
			maxTimestamp = undefined,
			network = 10,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.sportMarkets[network],
				max,
				query: {
					entity: 'vaultPnls',
					selection: {
						orderBy: 'timestamp',
						orderDirection: 'desc',
						where: {
							vault: vault ? `\\"${vault}\\"` : undefined,
							timestamp_gte: minTimestamp || undefined,
							timestamp_lte: maxTimestamp || undefined,
						},
					},
					properties: ['id', 'vault', 'timestamp', 'round', 'pnl'],
				},
			}).then(results =>
				results.map(({ id, vault, timestamp, round, pnl }) => ({
					id,
					vault,
					timestamp,
					round: Number(round),
					pnl: Number(pnl) / 1e18,
				})),
			);
		},
		vaultUserTransactions({
			max = Infinity,
			vault = undefined,
			type = undefined,
			account = undefined,
			minTimestamp = undefined,
			maxTimestamp = undefined,
			network = 10,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.sportMarkets[network],
				max,
				query: {
					entity: 'vaultUserTransactions',
					selection: {
						orderBy: 'timestamp',
						orderDirection: 'desc',
						where: {
							vault: vault ? `\\"${vault}\\"` : undefined,
							account: account ? `\\"${account}\\"` : undefined,
							type: type ? `\\"${type}\\"` : undefined,
							timestamp_gte: minTimestamp ? minTimestamp : undefined,
							timestamp_lte: maxTimestamp ? maxTimestamp : undefined,
						},
					},
					properties: ['id', 'vault', 'hash', 'timestamp', 'type', 'account', 'amount', 'round'],
				},
			}).then(results =>
				results.map(({ id, vault, hash, timestamp, type, account, amount, round }) => ({
					id,
					vault,
					hash,
					timestamp: Number(timestamp * 1000),
					type,
					account,
					amount: convertAmount(Number(amount), network),
					round: Number(round),
				})),
			);
		},
		zebros({ max = Infinity, account = undefined, network = 10 } = {}) {
			return pageResults({
				api: graphAPIEndpoints.sportMarkets[network],
				max,
				query: {
					entity: 'zebros',
					selection: {
						orderBy: 'tokenId',
						orderDirection: 'asc',
						where: {
							owner: account ? `\\"${account}\\"` : undefined,
						},
					},
					properties: ['id', 'owner', 'tokenId', 'countryName', 'url', 'country'],
				},
			}).then(results =>
				results.map(({ id, owner, tokenId, countryName, url, country }) => ({
					id,
					owner,
					tokenId,
					countryName,
					url,
					country,
				})),
			);
		},
		referralTransactions({
			max = Infinity,
			referrer = undefined,
			trader = undefined,
			network = 10,
			orderBy = undefined,
			orderDirection = undefined,
			minTimestamp = undefined,
			maxTimestamp = undefined,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.sportMarkets[network],
				max,
				query: {
					entity: 'referralTransactions',
					selection: {
						orderBy: orderBy ? `\\"${orderBy}\\"` : 'id',
						orderDirection: orderDirection ? `\\"${orderDirection}\\"` : 'asc',
						where: {
							referrer_: {
								id: referrer ? `\\"${referrer}\\"` : undefined,
							},
							trader_: {
								id: trader ? `\\"${trader}\\"` : undefined,
							},
							timestamp_gte: minTimestamp || undefined,
							timestamp_lte: maxTimestamp || undefined,
						},
					},
					properties: [
						'id',
						'referrer {id, trades, timestamp}',
						'trader {id, trades}',
						'amount',
						'volume',
						'ammType',
						'timestamp',
					],
				},
			}).then(results =>
				results.map(({ id, referrer, trader, amount, volume, ammType, timestamp }) => ({
					id,
					referrer,
					trader,
					amount: convertAmount(Number(amount), network),
					volume: convertAmount(Number(volume), network),
					ammType,
					timestamp: Number(timestamp * 1000),
				})),
			);
		},
		referrers({
			max = Infinity,
			network = 10,
			referrer = undefined,
			orderBy = undefined,
			orderDirection = undefined,
			minTimestamp = undefined,
			maxTimestamp = undefined,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.sportMarkets[network],
				max,
				query: {
					entity: 'referrers',
					selection: {
						orderBy: orderBy ? `\\"${orderBy}\\"` : 'id',
						orderDirection: orderDirection ? `\\"${orderDirection}\\"` : 'asc',
						where: {
							id: referrer ? `\\"${referrer}\\"` : undefined,
							timestamp_gte: minTimestamp || undefined,
							timestamp_lte: maxTimestamp || undefined,
						},
					},
					properties: ['id', 'trades', 'totalVolume', 'totalEarned', 'timestamp'],
				},
			}).then(results =>
				results.map(({ id, trades, totalVolume, totalEarned, timestamp }) => ({
					id,
					trades: Number(trades),
					totalVolume: convertAmount(Number(totalVolume), network),
					totalEarned: convertAmount(Number(totalEarned), network),
					timestamp: Number(timestamp * 1000),
				})),
			);
		},
		referredTraders({
			max = Infinity,
			network = 10,
			orderBy = undefined,
			referrer = undefined,
			orderDirection = undefined,
			minTimestamp = undefined,
			maxTimestamp = undefined,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.sportMarkets[network],
				max,
				query: {
					entity: 'referredTraders',
					selection: {
						orderBy: orderBy ? `\\"${orderBy}\\"` : 'id',
						orderDirection: orderDirection ? `\\"${orderDirection}\\"` : 'asc',
						where: {
							referrer_: {
								id: referrer ? `\\"${referrer}\\"` : undefined,
							},
							timestamp_gte: minTimestamp || undefined,
							timestamp_lte: maxTimestamp || undefined,
						},
					},
					properties: ['id', 'trades', 'totalVolume', 'totalAmount', 'referrer {id}', 'timestamp'],
				},
			}).then(results =>
				results.map(({ id, trades, totalVolume, totalAmount, referrer, timestamp }) => ({
					id,
					trades: Number(trades),
					totalVolume: convertAmount(Number(totalVolume), network),
					totalAmount: convertAmount(Number(totalAmount), network),
					referrer,
					timestamp: Number(timestamp * 1000),
				})),
			);
		},
		liquidityPoolPnls({
			max = Infinity,
			liquidityPool = undefined,
			minTimestamp = undefined,
			maxTimestamp = undefined,
			liquidityPoolType = undefined,
			network = 10,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.sportMarkets[network],
				max,
				query: {
					entity: 'liquidityPoolPnls',
					selection: {
						orderBy: 'timestamp',
						orderDirection: 'desc',
						where: {
							liquidityPool: liquidityPool ? `\\"${liquidityPool}\\"` : undefined,
							liquidityPoolType: liquidityPoolType ? `\\"${liquidityPoolType}\\"` : undefined,
							timestamp_gte: minTimestamp || undefined,
							timestamp_lte: maxTimestamp || undefined,
						},
					},
					properties: ['id', 'liquidityPool', 'timestamp', 'round', 'pnl', 'liquidityPoolType'],
				},
			}).then(results =>
				results.map(({ id, liquidityPool, timestamp, round, pnl, liquidityPoolType }) => ({
					id,
					liquidityPool,
					timestamp,
					round: Number(round),
					pnl: Number(pnl) / 1e18,
					liquidityPoolType,
				})),
			);
		},
		liquidityPoolUserTransactions({
			max = Infinity,
			liquidityPool = undefined,
			type = undefined,
			account = undefined,
			minTimestamp = undefined,
			maxTimestamp = undefined,
			liquidityPoolType = undefined,
			network = 10,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.sportMarkets[network],
				max,
				query: {
					entity: 'liquidityPoolUserTransactions',
					selection: {
						orderBy: 'timestamp',
						orderDirection: 'desc',
						where: {
							liquidityPool: liquidityPool ? `\\"${liquidityPool}\\"` : undefined,
							liquidityPoolType: liquidityPoolType ? `\\"${liquidityPoolType}\\"` : undefined,
							account: account ? `\\"${account}\\"` : undefined,
							type: type ? `\\"${type}\\"` : undefined,
							timestamp_gte: minTimestamp ? minTimestamp : undefined,
							timestamp_lte: maxTimestamp ? maxTimestamp : undefined,
						},
					},
					properties: [
						'id',
						'liquidityPool',
						'hash',
						'timestamp',
						'type',
						'account',
						'amount',
						'round',
						'liquidityPoolType',
					],
				},
			}).then(results =>
				results.map(({ id, liquidityPool, hash, timestamp, type, account, amount, round, liquidityPoolType }) => ({
					id,
					liquidityPool,
					hash,
					timestamp: Number(timestamp * 1000),
					type,
					account,
					amount: convertAmount(amount, network),
					round: Number(round),
					liquidityPoolType,
				})),
			);
		},
	},
};
