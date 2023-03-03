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
	return amount / 1e18;
};

const graphAPIEndpoints = {
	thalesRoyale: {
		10: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-royale', // optimism
		69: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-royale-kovan', // optimism kovan
	},
	token: {
		10: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-token', // optimism
		69: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-token-kovan', // optimism kovan
		420: 'https://api.thegraph.com/subgraphs/name/thales-markets/token-goerli', // optimism goerli
		42161: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-token-arbitrum', // arbitrum
	},
	thalesMarkets: {
		1: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-options', // mainnet
		3: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-ropsten', // ropsten
		4: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-rinkeby', // rinkeby
		42: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-kovan', // kovan
		69: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-kovan-optimism', // optimism kovan
		420: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-markets-goerli-ovm', // optimism goerli
		10: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-markets', // optimism
		80001: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-mumbai', // polygon mumbai
		137: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-polygon', // polygon
		56: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-bsc', // bsc
		42161: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-arbitrum', // arbitrum

		positions: {
			420: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-markets-goerli-ovm', // optimism goerli
			69: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-kovan-optimism', // optimism kovan
			10: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-markets', // optimism
			80001: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-mumbai', // polygon mumbai
			137: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-polygon', // polygon
			56: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-bsc', // bsc
			42161: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-arbitrum', // arbitrum
		},
		rewards: {
			10: 'https://api.thegraph.com/subgraphs/name/thales-markets/trade-rewards',
		},
	},

	exoticMarkets: {
		69: 'https://api.thegraph.com/subgraphs/name/thales-markets/exotic-markets-optimism-kovan', // optimism kovan
		10: 'https://api.thegraph.com/subgraphs/name/thales-markets/exotic-markets-optimism', // optimism
		420: 'https://api.thegraph.com/subgraphs/name/thales-markets/exotic-goerli-optimism', // optimism goerli
	},
	sportMarkets: {
		5: 'https://api.thegraph.com/subgraphs/name/thales-markets/sport-markets-goerli', // goerli
		42: 'https://api.thegraph.com/subgraphs/name/thales-markets/sport-markets-kovan', // kovan
		10: 'https://api.thegraph.com/subgraphs/name/thales-markets/sport-markets-optimism', // optimism
		420: 'https://api.thegraph.com/subgraphs/name/thales-markets/sport-markets-optimism-goerli', //  optimism goerli
		42161: 'https://api.thegraph.com/subgraphs/name/thales-markets/overtime-arbitrum', // arbitrum
	},
	taleOfThales: {
		10: 'https://api.thegraph.com/subgraphs/name/thales-markets/tale-of-thales', // optimism
		420: 'https://api.thegraph.com/subgraphs/name/thales-markets/tot-op-goerli', // optimism goerli
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
			network = 1,
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
			network = 10,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.thalesMarkets[network],
				max,
				query: {
					entity: 'rangedMarkets',
					selection: {
						orderBy: 'maturityDate',
						orderDirection: 'desc',
						where: {
							timestamp_gte: minTimestamp || undefined,
							timestamp_lte: maxTimestamp || undefined,
							maturityDate_gte: minMaturity || undefined,
							maturityDate_lte: maxMaturity || undefined,
							leftPrice: leftPrice ? `\\"${leftPrice}\\"` : undefined,
							rightPrice: rightPrice ? `\\"${rightPrice}\\"` : undefined,
							leftMarket: leftMarket ? `\\"${leftMarket}\\"` : undefined,
							rightMarket: rightMarket ? `\\"${rightMarket}\\"` : undefined,
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
			network = 1,
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
			network = 1,
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
		positionBalances({ max = Infinity, account = undefined, network = 137 } = {}) {
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
						'position {id, side, market { id, result, currencyKey, strikePrice, maturityDate, expiryDate, isOpen, finalPrice }}',
					],
				},
			}).then(results =>
				results.map(({ id, account, amount, position }) => ({
					id,
					account,
					amount,
					position,
				})),
			);
		},
		rangedPositionBalances({ max = Infinity, account = undefined, network = 137 } = {}) {
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
						'position {id, side, market { id, timestamp, currencyKey, maturityDate, expiryDate, leftPrice, rightPrice, inAddress, outAddress, isOpen, result, finalPrice}}',
					],
				},
			}).then(results =>
				results.map(({ id, account, amount, position }) => ({
					id,
					account,
					amount,
					position,
				})),
			);
		},
		accountBuyVolumes({
			max = Infinity,
			type = undefined,
			account = undefined,
			network = 1,
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
		referrers({ max = Infinity, address = undefined, network = 137 } = {}) {
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
		referralTransfers({ max = Infinity, trader = undefined, referrer = undefined, network = 137 } = {}) {
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
		referredTraders({ max = Infinity, referrer = undefined, network = 137 } = {}) {
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
			network = 1,
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

		ongoingAirdropNewRoots({ max = Infinity, network = 1 } = {}) {
			return pageResults({
				api: graphAPIEndpoints.token[network],
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
		stakers({ max = Infinity, network = 1 } = {}) {
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
			network = 1,
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
		thalesRoyaleGames({ max = Infinity, address = undefined, network = 1 } = {}) {
			return pageResults({
				api: graphAPIEndpoints.thalesRoyale[network],
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
				api: graphAPIEndpoints.thalesRoyale[network],
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
				api: graphAPIEndpoints.thalesRoyale[network],
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
				api: graphAPIEndpoints.thalesRoyale[network],
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
					properties: ['id', 'address', 'timestamp', 'season', 'isAlive', 'deathRound', 'number', 'defaultPosition'],
				},
			}).then(results =>
				results.map(({ id, address, timestamp, season, isAlive, deathRound, number, defaultPosition }) => ({
					id,
					address,
					timestamp: Number(timestamp * 1000),
					season: Number(season),
					isAlive,
					deathRound: Number(deathRound),
					number: Number(number),
					defaultPosition: Number(defaultPosition),
				})),
			);
		},
		thalesRoyalePassportPlayers({
			max = Infinity,
			id = undefined,
			owner = undefined,
			season = undefined,
			network = 1,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.thalesRoyale[network],
				max,
				query: {
					entity: 'thalesRoyalePassportPlayers',
					selection: {
						orderBy: 'timestamp',
						orderDirection: 'desc',
						where: {
							id: id ? `\\"${id}\\"` : undefined,
							owner: owner ? `\\"${owner}\\"` : undefined,
							season: season ? `\\"${season}\\"` : undefined,
						},
					},
					properties: ['id', 'owner', 'timestamp', 'season', 'isAlive', 'deathRound', 'number', 'defaultPositions'],
				},
			}).then(results =>
				results.map(({ id, owner, timestamp, season, isAlive, deathRound, number, defaultPositions }) => ({
					id,
					owner,
					timestamp: Number(timestamp * 1000),
					season: Number(season),
					isAlive,
					deathRound: Number(deathRound),
					number: Number(number),
					defaultPositions,
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
				api: graphAPIEndpoints.thalesRoyale[network],
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
		thalesRoyalePassportPositions({
			max = Infinity,
			id = undefined,
			season = undefined,
			tokenPlayer = undefined,
			round = undefined,
			position = undefined,
			network = 1,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.thalesRoyale[network],
				max,
				query: {
					entity: 'thalesRoyalePassportPositions',
					selection: {
						orderBy: 'timestamp',
						orderDirection: 'desc',
						where: {
							id: id ? `\\"${id}\\"` : undefined,
							season: season ? `\\"${season}\\"` : undefined,
							tokenPlayer: tokenPlayer ? `\\"${tokenPlayer}\\"` : undefined,
							round: round ? `\\"${round}\\"` : undefined,
							position: position ? `\\"${position}\\"` : undefined,
						},
					},
					properties: ['id', 'timestamp', 'season', 'tokenPlayer', 'round', 'position'],
				},
			}).then(results =>
				results.map(({ id, timestamp, tokenPlayer, round, position }) => ({
					id,
					timestamp: Number(timestamp * 1000),
					season: Number(season),
					tokenPlayer: Number(tokenPlayer),
					round: Number(round),
					position: Number(position),
				})),
			);
		},
		thalesRoyalePasses({ max = Infinity, address = undefined, network = 1 } = {}) {
			return pageResults({
				api: graphAPIEndpoints.thalesRoyale[network],
				max,
				query: {
					entity: 'thalesRoyalePasses',
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
		vaultTransactions({
			max = Infinity,
			market = undefined,
			vault = undefined,
			minTimestamp = undefined,
			maxTimestamp = undefined,
			startPeriod = undefined,
			endPeriod = undefined,
			network = 1,
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
					paid: Number(paid) / 1e18,
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
			network = 1,
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
			network = 1,
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
					amount: amount / 1e18,
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
	exoticMarkets: {
		markets({
			max = Infinity,
			creator = undefined,
			isOpen = undefined,
			minTimestamp = undefined,
			maxTimestamp = undefined,
			network = 69,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.exoticMarkets[network],
				max,
				query: {
					entity: 'markets',
					selection: {
						orderBy: 'endOfPositioning',
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
						'creationTime',
						'resolver',
						'resolvedTime',
						'address',
						'question',
						'dataSource',
						'endOfPositioning',
						'ticketPrice',
						'isWithdrawalAllowed',
						'positions',
						'tags',
						'isTicketType',
						'isOpen',
						'numberOfDisputes',
						'numberOfOpenDisputes',
						'marketClosedForDisputes',
						'isResolved',
						'isCancelled',
						'winningPosition',
						'backstopTimeout',
						'isPaused',
						'isDisputed',
						'disputeClosedTime',
						'poolSize',
						'numberOfParticipants',
						'noWinners',
						'cancelledByCreator',
					],
				},
			}).then(results =>
				results.map(
					({
						id,
						timestamp,
						creator,
						creationTime,
						resolver,
						resolvedTime,
						address,
						question,
						dataSource,
						endOfPositioning,
						ticketPrice,
						isWithdrawalAllowed,
						positions,
						tags,
						isTicketType,
						isOpen,
						numberOfDisputes,
						numberOfOpenDisputes,
						marketClosedForDisputes,
						isResolved,
						isCancelled,
						winningPosition,
						backstopTimeout,
						isPaused,
						isDisputed,
						disputeClosedTime,
						poolSize,
						numberOfParticipants,
						noWinners,
						cancelledByCreator,
					}) => ({
						id,
						timestamp: Number(timestamp * 1000),
						creator,
						creationTime: Number(creationTime * 1000),
						resolver,
						resolvedTime: Number(resolvedTime * 1000),
						address,
						question,
						dataSource,
						endOfPositioning: Number(endOfPositioning * 1000),
						ticketPrice: ticketPrice / 1e18,
						isWithdrawalAllowed,
						positions,
						tags,
						isTicketType,
						isOpen,
						numberOfDisputes: Number(numberOfDisputes),
						numberOfOpenDisputes: Number(numberOfOpenDisputes),
						marketClosedForDisputes,
						isResolved,
						isCancelled,
						winningPosition: Number(winningPosition),
						backstopTimeout: Number(backstopTimeout * 1000),
						isPaused,
						isDisputed,
						disputeClosedTime: Number(disputeClosedTime * 1000),
						poolSize: poolSize / 1e18,
						numberOfParticipants: Number(numberOfParticipants),
						noWinners,
						cancelledByCreator,
					}),
				),
			);
		},
		disputes({
			max = Infinity,
			disputer = undefined,
			market = undefined,
			minTimestamp = undefined,
			maxTimestamp = undefined,
			network = 69,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.exoticMarkets[network],
				max,
				query: {
					entity: 'disputes',
					selection: {
						orderBy: 'creationDate',
						orderDirection: 'asc',
						where: {
							disputer: disputer ? `\\"${disputer}\\"` : undefined,
							market: market ? `\\"${market}\\"` : undefined,
							timestamp_gte: minTimestamp || undefined,
							timestamp_lte: maxTimestamp || undefined,
						},
					},
					properties: [
						'id',
						'timestamp',
						'creationDate',
						'disputeNumber',
						'market',
						'disputer',
						'reasonForDispute',
						'isInPositioningPhase',
						'disputeCode',
					],
				},
			}).then(results =>
				results.map(
					({
						id,
						timestamp,
						creationDate,
						disputeNumber,
						market,
						disputer,
						reasonForDispute,
						isInPositioningPhase,
						disputeCode,
					}) => ({
						id,
						timestamp: Number(timestamp * 1000),
						creationDate: Number(creationDate * 1000),
						disputeNumber: Number(disputeNumber),
						market,
						disputer,
						reasonForDispute,
						isInPositioningPhase,
						disputeCode: Number(disputeCode),
					}),
				),
			);
		},
		disputeVotes({
			max = Infinity,
			market = undefined,
			dispute = undefined,
			voter = undefined,
			minTimestamp = undefined,
			maxTimestamp = undefined,
			network = 69,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.exoticMarkets[network],
				max,
				query: {
					entity: 'disputeVotes',
					selection: {
						orderBy: 'timestamp',
						orderDirection: 'desc',
						where: {
							market: market ? `\\"${market}\\"` : undefined,
							dispute: dispute ? `\\"${dispute}\\"` : undefined,
							voter: voter ? `\\"${voter}\\"` : undefined,
							timestamp_gte: minTimestamp || undefined,
							timestamp_lte: maxTimestamp || undefined,
						},
					},
					properties: ['id', 'timestamp', 'market', 'dispute', 'voter', 'vote', 'position'],
				},
			}).then(results =>
				results.map(({ id, timestamp, market, dispute, voter, vote, position }) => ({
					id,
					timestamp: Number(timestamp * 1000),
					market,
					dispute: Number(dispute),
					voter,
					vote: Number(vote),
					position: Number(position),
				})),
			);
		},
		positions({
			max = Infinity,
			market = undefined,
			account = undefined,
			minTimestamp = undefined,
			maxTimestamp = undefined,
			network = 69,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.exoticMarkets[network],
				max,
				query: {
					entity: 'positions',
					selection: {
						orderBy: 'timestamp',
						orderDirection: 'desc',
						where: {
							market: market ? `\\"${market}\\"` : undefined,
							account: account ? `\\"${account}\\"` : undefined,
							timestamp_gte: minTimestamp || undefined,
							timestamp_lte: maxTimestamp || undefined,
						},
					},
					properties: ['id', 'timestamp', 'market', 'account', 'position', 'positions', 'isWithdrawn', 'isClaimed'],
				},
			}).then(results =>
				results.map(({ id, timestamp, market, account, position, positions, isWithdrawn, isClaimed }) => ({
					id,
					timestamp: Number(timestamp * 1000),
					market,
					account,
					position: Number(position),
					positions,
					isWithdrawn,
					isClaimed,
				})),
			);
		},
		marketTransactions({
			max = Infinity,
			market = undefined,
			type = undefined,
			account = undefined,
			network = 1,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.exoticMarkets[network],
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
						},
					},
					properties: [
						'hash',
						'timestamp',
						'blockNumber',
						'type',
						'market',
						'account',
						'amount',
						'position',
						'positions',
					],
				},
			}).then(results =>
				results.map(({ hash, timestamp, blockNumber, type, market, account, amount, position, positions }) => ({
					hash,
					timestamp: Number(timestamp * 1000),
					blockNumber: Number(blockNumber),
					type,
					market,
					account,
					amount: amount / 1e18,
					position: Number(position),
					positions,
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
			minTimestamp = undefined,
			maxTimestamp = undefined,
			market = undefined,
			network = 42,
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
							isOpen: isOpen !== undefined ? isOpen : undefined,
							isCanceled: isCanceled !== undefined ? isCanceled : undefined,
							isResolved: isResolved !== undefined ? isResolved : undefined,
							timestamp_gte: minTimestamp || undefined,
							timestamp_lte: maxTimestamp || undefined,
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
			network = 1,
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
						'wholeMarket { id, timestamp, address, maturityDate, tags, isOpen, isResolved, isCanceled, finalResult, poolSize, numberOfParticipants, homeTeam, awayTeam, homeOdds, awayOdds, drawOdds, homeScore, awayScore, parentMarket, betType, spread, total, doubleChanceMarketType }',
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
					wholeMarket,
				})),
			);
		},
		positionBalances({ max = Infinity, account = undefined, network = 42, onlyClaimable = undefined } = {}) {
			return pageResults({
				api: graphAPIEndpoints.sportMarkets[network],
				max,
				query: {
					entity: 'positionBalances',
					selection: {
						where: {
							account: account ? `\\"${account}\\"` : undefined,
							position_: {
								claimable: onlyClaimable == true ? true : undefined,
							},
						},
					},
					properties: [
						'id',
						'firstTxHash',
						'account',
						'amount',
						'position {id, side, claimable, market { id, timestamp, address, maturityDate, tags, isOpen, isResolved, isCanceled, finalResult, poolSize, numberOfParticipants, homeTeam, awayTeam, homeOdds, awayOdds, drawOdds, homeScore, awayScore, parentMarket, betType, spread, total, doubleChanceMarketType }}',
						'sUSDPaid',
					],
				},
			}).then(results =>
				results.map(({ id, firstTxHash, account, amount, position, sUSDPaid }) => ({
					id,
					firstTxHash,
					account,
					amount,
					position: {
						...position,
						market: {
							...position.market,
							maturityDate: Number(position.market.maturityDate * 1000),
							homeOdds: position.market.homeOdds / 1e18,
							awayOdds: position.market.awayOdds / 1e18,
							drawOdds: position.market.drawOdds / 1e18,
							timestamp: Number(position.market.timestamp * 1000),
						},
					},
					sUSDPaid: convertAmount(Number(sUSDPaid), network),
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
			network = 42,
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
						'market { id, timestamp, address, maturityDate, tags, isOpen, isResolved, isCanceled, finalResult, poolSize, numberOfParticipants, homeTeam, awayTeam, homeOdds, awayOdds, drawOdds, homeScore, awayScore, parentMarket, betType, spread, total, doubleChanceMarketType }',
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
		overtimeVouchers({ max = Infinity, address = undefined, network = 1 } = {}) {
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
						'sportMarkets {id, timestamp, address, maturityDate, tags, isOpen, isResolved, isCanceled, finalResult, poolSize, numberOfParticipants, homeTeam, awayTeam, homeOdds, awayOdds, drawOdds, homeScore, awayScore, parentMarket, betType, spread, total, doubleChanceMarketType }',
						'sportMarketsFromContract',
						'positions {id, side, claimable, market { id, timestamp, address, maturityDate, tags, isOpen, isResolved, isCanceled, finalResult, poolSize, numberOfParticipants, homeTeam, awayTeam, homeOdds, awayOdds, drawOdds, homeScore, awayScore, parentMarket, betType, spread, total, doubleChanceMarketType }}',
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
			network = 1,
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
						'wholeMarket { id, timestamp, address, maturityDate, tags, isOpen, isResolved, isCanceled, finalResult, poolSize, numberOfParticipants, homeTeam, awayTeam, homeOdds, awayOdds, drawOdds, homeScore, awayScore, parentMarket, betType, spread, total, doubleChanceMarketType }',
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
					paid: Number(paid) / 1e18,
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
			network = 1,
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
						'wholeMarket { id, sportMarketsFromContract, positionsFromContract, marketQuotes, account, totalAmount, sUSDPaid, sUSDAfterFees, totalQuote, skewImpact, timestamp, lastGameStarts, blockNumber, claimed, won, sportMarkets {id, timestamp, address, maturityDate, tags, isOpen, isResolved, isCanceled, finalResult, poolSize, numberOfParticipants, homeTeam, awayTeam, homeOdds, awayOdds, drawOdds, homeScore, awayScore, parentMarket, betType, spread, total, doubleChanceMarketType }, positions {id, side, claimable, market { id, timestamp, address, maturityDate, tags, isOpen, isResolved, isCanceled, finalResult, poolSize, numberOfParticipants, homeTeam, awayTeam, homeOdds, awayOdds, drawOdds, homeScore, awayScore, parentMarket, betType, spread, total, doubleChanceMarketType }}}',
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
					paid: Number(paid) / 1e18,
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
			network = 1,
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
			network = 1,
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
					amount: amount / 1e18,
					round: Number(round),
				})),
			);
		},
		zebros({ max = Infinity, account = undefined, network = 1 } = {}) {
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
			network = 1,
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
			network = 1,
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
					amount: amount / 1e18,
					round: Number(round),
				})),
			);
		},
	},
};
