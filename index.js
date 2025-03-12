'use strict';

const pageResults = require('graph-results-pager');

const { hexToAscii, getHashFromId, sportMarketTypeFormatting } = require('./utils');
const { API_KEYS, LAST_DEPLOYMENT_IDS } = require('./constants');

const { getGraphStudioLatestDeploymentUrl } = require('./utils');

const convertAmount = (amount, networkId, address) => {
	if (networkId == 137) {
		if (address && address == '0x2791bca1f2de4661ed88a30c99a7a9449aa84174') return amount / 1e6;
		if (!address) return amount / 1e6;
	}
	if (networkId == 42161) {
		if (
			address &&
			(address == '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8' ||
				address == '0xea4c2343fd3c239c23dd37dd3ee51aec84544735')
		)
			return amount / 1e6;
		if (!address) return amount / 1e6;
	}
	if (networkId == 8453) {
		if (
			address &&
			(address == '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca' ||
				address == '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913')
		)
			return amount / 1e6;
		if (!address) return amount / 1e6;
	}
	if (networkId == 10) {
		if (
			address &&
			(address == '0x0b2c639c533813f4aa9d7837caf62653d097ff85' ||
				address == '0x7f9e03e40d8b95419c7bdf30d256d08f2ec11dba' ||
				address == '0x9ce94cdf8ecd57cec0835767528dc88628891dd9' ||
				address == '0xed59dca9c272fbc0ca4637f32ab32cbdb62e856b' ||
				address == '0x47da40be6b617d0199adf1ec3550f3875b246124')
		)
			return amount / 1e6;
		return amount / 1e18;
	}
	return amount / 1e18;
};

const graphAPIEndpoints = {
	token: {
		10: getGraphStudioLatestDeploymentUrl(LAST_DEPLOYMENT_IDS.Token[10], API_KEYS.Token), // optimism
		42161: getGraphStudioLatestDeploymentUrl(LAST_DEPLOYMENT_IDS.Token[42161], API_KEYS.Token), // arbitrum
		1: getGraphStudioLatestDeploymentUrl(LAST_DEPLOYMENT_IDS.Token[1], API_KEYS.Token), // mainnet
		8453: getGraphStudioLatestDeploymentUrl(LAST_DEPLOYMENT_IDS.Token[8453], API_KEYS.Token), // base
	},

	thalesMarkets: {
		10: getGraphStudioLatestDeploymentUrl(LAST_DEPLOYMENT_IDS.DigitalOptions[10], API_KEYS.DigitalOptions), // optimism
		42161: getGraphStudioLatestDeploymentUrl(LAST_DEPLOYMENT_IDS.DigitalOptions[42161], API_KEYS.DigitalOptions), // arbitrum
		137: getGraphStudioLatestDeploymentUrl(LAST_DEPLOYMENT_IDS.DigitalOptions[137], API_KEYS.DigitalOptions), // polygon
		8453: getGraphStudioLatestDeploymentUrl(LAST_DEPLOYMENT_IDS.DigitalOptions[8453], API_KEYS.DigitalOptions), // base

		lp: {
			10: getGraphStudioLatestDeploymentUrl(LAST_DEPLOYMENT_IDS.DigitalOptionsLP[10], API_KEYS.DigitalOptions), // optimism
			42161: getGraphStudioLatestDeploymentUrl(LAST_DEPLOYMENT_IDS.DigitalOptions[42161], API_KEYS.DigitalOptions), // arbitrum
			8453: getGraphStudioLatestDeploymentUrl(LAST_DEPLOYMENT_IDS.DigitalOptions[8453], API_KEYS.DigitalOptions), // base
		},

		positions: {
			10: getGraphStudioLatestDeploymentUrl(LAST_DEPLOYMENT_IDS.DigitalOptions[10], API_KEYS.DigitalOptions), // optimism
			42161: getGraphStudioLatestDeploymentUrl(LAST_DEPLOYMENT_IDS.DigitalOptions[42161], API_KEYS.DigitalOptions), // arbitrum
			137: getGraphStudioLatestDeploymentUrl(LAST_DEPLOYMENT_IDS.DigitalOptions[137], API_KEYS.DigitalOptions), // polygon
			8453: getGraphStudioLatestDeploymentUrl(LAST_DEPLOYMENT_IDS.DigitalOptions[8453], API_KEYS.DigitalOptions), // base
		},
	},

	sportMarkets: {
		10: getGraphStudioLatestDeploymentUrl(LAST_DEPLOYMENT_IDS.SportsMarkets[10], API_KEYS.Overtime), // optimism
		42161: getGraphStudioLatestDeploymentUrl(LAST_DEPLOYMENT_IDS.SportsMarkets[42161], API_KEYS.Overtime), // arbitrum
		8453: getGraphStudioLatestDeploymentUrl(LAST_DEPLOYMENT_IDS.SportsMarkets[8453], API_KEYS.Overtime), // base
	},

	taleOfThales: {
		10: getGraphStudioLatestDeploymentUrl(LAST_DEPLOYMENT_IDS.TaleOfThales[10], API_KEYS.TaleOfThales), // optimism
		42161: getGraphStudioLatestDeploymentUrl(LAST_DEPLOYMENT_IDS.TaleOfThales[42161], API_KEYS.TaleOfThales), // arbitrum
	},

	sportMarketsV2: {
		10: getGraphStudioLatestDeploymentUrl(LAST_DEPLOYMENT_IDS.SportsMarketsV2[10], API_KEYS.OvertimeV2), // optimism
		42161: getGraphStudioLatestDeploymentUrl(LAST_DEPLOYMENT_IDS.SportsMarketsV2[42161], API_KEYS.OvertimeV2), // arbitrum
		8453: getGraphStudioLatestDeploymentUrl(LAST_DEPLOYMENT_IDS.SportsMarketsV2[8453], API_KEYS.OvertimeV2), // base
		11155420: getGraphStudioLatestDeploymentUrl(LAST_DEPLOYMENT_IDS.SportsMarketsV2[11155420], API_KEYS.OvertimeV2), // optimism sepolia
	},

	marchMadness: {
		10: getGraphStudioLatestDeploymentUrl(LAST_DEPLOYMENT_IDS.MarchMadness[10], API_KEYS.MarchMadness), //  optimism
		42161: getGraphStudioLatestDeploymentUrl(LAST_DEPLOYMENT_IDS.MarchMadness[42161], API_KEYS.MarchMadness), // arbitrum
		8453: getGraphStudioLatestDeploymentUrl(LAST_DEPLOYMENT_IDS.MarchMadness[8453], API_KEYS.MarchMadness), // base
		11155420: getGraphStudioLatestDeploymentUrl(LAST_DEPLOYMENT_IDS.MarchMadness[11155420], API_KEYS.MarchMadness), // optimism sepolia
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
			manager = undefined,
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
							managerAddress: manager ? `\\"${manager}\\"` : undefined,
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
						'managerAddress',
					],
				},
			})
				.then(results =>
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
							managerAddress,
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
							managerAddress,
						}),
					),
				)
				.catch(error => {
					console.log('Error in thales-data binaryOptions.markets', error);
					throw error;
				});
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
			manager = undefined,
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
							managerAddress: manager ? `\\"${manager}\\"` : undefined,
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
						'managerAddress',
					],
				},
			})
				.then(results =>
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
							managerAddress,
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
							managerAddress,
						}),
					),
				)
				.catch(error => {
					console.log('Error in thales-data binaryOptions.rangedMarkets', error);
					throw error;
				});
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
						'managerAddress',
					],
				},
			})
				.then(results =>
					results.map(
						({
							id,
							timestamp,
							type,
							account,
							currencyKey,
							isRangedMarket,
							side,
							amount,
							market,
							fee,
							blockNumber,
							managerAddress,
						}) => ({
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
							managerAddress,
						}),
					),
				)
				.catch(error => {
					console.log('Error in thales-data binaryOptions.optionTransactions', error);
					throw error;
				});
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
						'ammAddress',
					],
				},
			})
				.then(results =>
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
							ammAddress,
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
							ammAddress,
						}),
					),
				)
				.catch(error => {
					console.log('Error in thales-data binaryOptions.trades', error);
					throw error;
				});
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
						'position {id, side, market { id, result, currencyKey, strikePrice, maturityDate, expiryDate, isOpen, finalPrice, managerAddress }, managerAddress}',
						'managerAddress',
					],
				},
			})
				.then(results =>
					results.map(({ id, account, amount, paid, position, managerAddress }) => ({
						id,
						account,
						amount,
						paid,
						position,
						managerAddress,
					})),
				)
				.catch(error => {
					console.log('Error in thales-data binaryOptions.positionBalances', error);
					throw error;
				});
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
						'position {id, side, market { id, timestamp, currencyKey, maturityDate, expiryDate, leftPrice, rightPrice, inAddress, outAddress, isOpen, result, finalPrice, managerAddress}, managerAddress}',
						'managerAddress',
					],
				},
			})
				.then(results =>
					results.map(({ id, account, amount, paid, position, managerAddress }) => ({
						id,
						account,
						amount,
						paid,
						position,
						managerAddress,
					})),
				)
				.catch(error => {
					console.log('Error in thales-data binaryOptions.rangedPositionBalances', error);
					throw error;
				});
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
					properties: ['id', 'timestamp', 'type', 'account', 'amount', 'ammAddress'],
				},
			})
				.then(results =>
					results.map(({ id, timestamp, type, account, amount, ammAddress }) => ({
						id,
						timestamp: Number(timestamp * 1000),
						type,
						account,
						amount: amount / 1e18,
						ammAddress,
					})),
				)
				.catch(error => {
					console.log('Error in thales-data binaryOptions.accountBuyVolumes', error);
					throw error;
				});
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
			})
				.then(results =>
					results.map(({ id, trades, totalVolume, totalEarned, timestamp }) => ({
						id,
						trades: Number(trades),
						totalVolume: convertAmount(totalVolume, network),
						totalEarned: convertAmount(totalEarned, network),
						timestamp: Number(timestamp * 1000),
					})),
				)
				.catch(error => {
					console.log('Error in thales-data binaryOptions.referrers', error);
					throw error;
				});
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
			})
				.then(results =>
					results.map(({ id, refferer, trader, amount, volume, timestamp }) => ({
						id,
						refferer,
						trader,
						amount: convertAmount(amount, network),
						volume: convertAmount(volume, network),
						timestamp: Number(timestamp * 1000),
					})),
				)
				.catch(error => {
					console.log('Error in thales-data binaryOptions.referralTransfers', error);
					throw error;
				});
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
			})
				.then(results =>
					results.map(({ id, trades, totalVolume, totalEarned, refferer, timestamp }) => ({
						id,
						trades: Number(trades),
						totalVolume: convertAmount(totalVolume, network),
						totalEarned: convertAmount(totalEarned, network),
						refferer,
						timestamp: Number(timestamp * 1000),
					})),
				)
				.catch(error => {
					console.log('Error in thales-data binaryOptions.referredTraders', error);
					throw error;
				});
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
					properties: [
						'id',
						'timestamp',
						'protocolRewards',
						'type',
						'account',
						'amount',
						'blockNumber',
						'destAccount',
						'feeRewards',
					],
				},
			})
				.then(results =>
					results.map(
						({ id, timestamp, type, account, amount, blockNumber, protocolRewards, destAccount, feeRewards }) => ({
							hash: getHashFromId(id),
							timestamp: Number(timestamp * 1000),
							type,
							account,
							destAccount,
							amount: amount / 1e18,
							feeRewards: convertAmount(Number(feeRewards), network),
							protocolRewards: protocolRewards / 1e18,
							blockNumber: Number(blockNumber),
						}),
					),
				)
				.catch(error => {
					console.log('Error in thales-data binaryOptions.tokenTransactions', error);
					throw error;
				});
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
			})
				.then(results =>
					results.map(({ id, timestamp, stakedAmount, escrowedAmount, totalStakedAmount, unstakingAmount }) => ({
						id,
						timestamp: Number(timestamp * 1000),
						stakedAmount: stakedAmount / 1e18,
						escrowedAmount: escrowedAmount / 1e18,
						totalStakedAmount: totalStakedAmount / 1e18,
						unstakingAmount: unstakingAmount / 1e18,
					})),
				)
				.catch(error => {
					console.log('Error in thales-data binaryOptions.stakers', error);
					throw error;
				});
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
			})
				.then(results =>
					results.map(({ id, transactionHash, timestamp, sender, account, canClaimOnBehalf }) => ({
						id,
						hash: transactionHash,
						timestamp: Number(timestamp * 1000),
						sender,
						account,
						canClaimOnBehalf,
					})),
				)
				.catch(error => {
					console.log('Error in thales-data binaryOptions.canClaimOnBehalfItems', error);
					throw error;
				});
		},
		vaultTransactions({
			max = Infinity,
			market = undefined,
			vault = undefined,
			minTimestamp = undefined,
			maxTimestamp = undefined,
			startPeriod = undefined,
			endPeriod = undefined,
			round = undefined,
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
							round: round ? round : undefined,
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
			})
				.then(results =>
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
				)
				.catch(error => {
					console.log('Error in thales-data binaryOptions.vaultTransactions', error);
					throw error;
				});
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
			})
				.then(results =>
					results.map(({ id, vault, timestamp, round, pnl }) => ({
						id,
						vault,
						timestamp,
						round: Number(round),
						pnl: Number(pnl) / 1e18,
					})),
				)
				.catch(error => {
					console.log('Error in thales-data binaryOptions.vaultPnls', error);
					throw error;
				});
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
			})
				.then(results =>
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
				)
				.catch(error => {
					console.log('Error in thales-data binaryOptions.vaultUserTransactions', error);
					throw error;
				});
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
			})
				.then(results =>
					results.map(({ id, liquidityPool, timestamp, round, pnl }) => ({
						id,
						liquidityPool,
						timestamp,
						round: Number(round),
						pnl: Number(pnl) / 1e18,
					})),
				)
				.catch(error => {
					console.log('Error in thales-data binaryOptions.liquidityPoolPnls', error);
					throw error;
				});
		},
		liquidityPoolUserTransactions({
			max = Infinity,
			liquidityPool = undefined,
			type = undefined,
			account = undefined,
			minTimestamp = undefined,
			maxTimestamp = undefined,
			round = undefined,
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
							round: round ? round : undefined,
							type: type ? `\\"${type}\\"` : undefined,
							timestamp_gte: minTimestamp ? minTimestamp : undefined,
							timestamp_lte: maxTimestamp ? maxTimestamp : undefined,
						},
					},
					properties: ['id', 'liquidityPool', 'hash', 'timestamp', 'type', 'account', 'amount', 'round'],
				},
			})
				.then(results =>
					results.map(({ id, liquidityPool, hash, timestamp, type, account, amount, round }) => ({
						id,
						liquidityPool,
						hash,
						timestamp: Number(timestamp * 1000),
						type,
						account,
						amount: convertAmount(amount, network, liquidityPool),
						round: Number(round),
					})),
				)
				.catch(error => {
					console.log('Error in thales-data binaryOptions.liquidityPoolUserTransactions', error);
					throw error;
				});
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
			})
				.then(results =>
					results.map(({ id, minter, item }) => ({
						id,
						minter,
						item,
					})),
				)
				.catch(error => {
					console.log('Error in thales-data binaryOptions.mintTransactions', error);
					throw error;
				});
		},
		stakings({ max = Infinity, period = undefined, network = 10 } = {}) {
			return pageResults({
				api: graphAPIEndpoints.token[network],
				max,
				query: {
					entity: 'stakings',
					selection: {
						orderBy: 'period',
						orderDirection: 'desc',
						where: {
							period: period ? `\\"${period}\\"` : undefined,
						},
					},
					properties: ['id', 'period'],
				},
			})
				.then(results =>
					results.map(({ id, period }) => ({
						id,
						period: Number(period),
					})),
				)
				.catch(error => {
					console.log('Error in thales-data binaryOptions.stakings', error);
					throw error;
				});
		},
		stakingClaims({ max = Infinity, period = undefined, network = 10 } = {}) {
			return pageResults({
				api: graphAPIEndpoints.token[network],
				max,
				query: {
					entity: 'stakingClaims',
					selection: {
						orderBy: 'period',
						orderDirection: 'desc',
						where: {
							period: period ? `\\"${period}\\"` : undefined,
						},
					},
					properties: [
						'id',
						'period',
						'baseThalesClaimed',
						'extraThalesClaimed',
						'feesClaimed',
						'baseRewards',
						'extraRewards',
						'feesRewards ',
					],
				},
			})
				.then(results =>
					results.map(
						({
							id,
							period,
							baseThalesClaimed,
							extraThalesClaimed,
							feesClaimed,
							baseRewards,
							extraRewards,
							feesRewards,
						}) => ({
							id,
							period: Number(period),
							baseThalesClaimed: baseThalesClaimed / 1e18,
							extraThalesClaimed: extraThalesClaimed / 1e18,
							feesClaimed: convertAmount(Number(feesClaimed), network),
							baseRewards: baseRewards / 1e18,
							extraRewards: extraRewards / 1e18,
							feesRewards: convertAmount(Number(feesRewards), network),
						}),
					),
				)
				.catch(error => {
					console.log('Error in thales-data binaryOptions.stakingClaims', error);
					throw error;
				});
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
			})
				.then(results =>
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
							playerPropsLine:
								playerPropsLine !== undefined && playerPropsLine !== null ? Number(playerPropsLine) / 100 : 0,
							playerPropsType: playerPropsType !== undefined && playerPropsType !== null ? Number(playerPropsType) : 0,
							playerPropsOutcome,
							playerPropsScore:
								playerPropsScore !== undefined && playerPropsScore !== null ? Number(playerPropsScore) : 0,
						}),
					),
				)
				.catch(error => {
					console.log('Error in thales-data sportMarkets.markets', error);
					throw error;
				});
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
			})
				.then(results =>
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
							...sportMarketTypeFormatting(wholeMarket),
						},
					})),
				)
				.catch(error => {
					console.log('Error in thales-data sportMarkets.marketTransactions', error);
					throw error;
				});
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
			})
				.then(results =>
					results.map(({ id, firstTxHash, account, amount, position, sUSDPaid, claimed }) => ({
						id,
						firstTxHash,
						account,
						amount,
						position: {
							...position,
							market: {
								...position.market,
								...sportMarketTypeFormatting(position.market),
							},
						},
						sUSDPaid: convertAmount(Number(sUSDPaid), network),
						claimed,
					})),
				)
				.catch(error => {
					console.log('Error in thales-data sportMarkets.positionBalances', error);
					throw error;
				});
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
			})
				.then(results =>
					results.map(({ id, account, amount, timestamp, caller, market }) => ({
						id,
						account,
						amount: Number(amount) / 1e18,
						timestamp: Number(timestamp * 1000),
						caller,
						market: {
							...market,
							...sportMarketTypeFormatting(market),
						},
					})),
				)
				.catch(error => {
					console.log('Error in thales-data sportMarkets.claimTxes', error);
					throw error;
				});
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
			})
				.then(results =>
					results.map(({ id, address }) => ({
						id,
						address,
					})),
				)
				.catch(error => {
					console.log('Error in thales-data sportMarkets.overtimeVouchers', error);
					throw error;
				});
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
			sportMarketsAddresses = undefined,
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
							sportMarkets_: sportMarketsAddresses
								? { address_in: `[${sportMarketsAddresses.map(address => `\\"${address}\\"`).toString()}]` }
								: undefined,
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
			})
				.then(results =>
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
								return sportMarketTypeFormatting(market);
							}),
							sportMarketsFromContract,
							positions: positions.map(position => {
								const market = position.market;
								return {
									...position,
									market: sportMarketTypeFormatting(market),
								};
							}),
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
				)
				.catch(error => {
					console.log('Error in thales-data sportMarkets.parlayMarkets', error);
					throw error;
				});
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
			})
				.then(results =>
					results.map(({ id, pnl, volume, trades }) => ({
						id,
						pnl: Number(pnl) / 1e18,
						volume: convertAmount(Number(volume), network),
						trades,
					})),
				)
				.catch(error => {
					console.log('Error in thales-data sportMarkets.usersStats', error);
					throw error;
				});
		},
		vaultTransactions({
			max = Infinity,
			market = undefined,
			vault = undefined,
			minTimestamp = undefined,
			maxTimestamp = undefined,
			startPeriod = undefined,
			endPeriod = undefined,
			round = undefined,
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
							round: round || undefined,
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
			})
				.then(results =>
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
				)
				.catch(error => {
					console.log('Error in thales-data sportMarkets.vaultTransactions', error);
					throw error;
				});
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
			})
				.then(results =>
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
												? Number(market.playerPropsLine) / 100
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
								marketQuotes: wholeMarket.marketQuotes
									? wholeMarket.marketQuotes.map(item => Number(item) / 1e18)
									: null,
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
				)
				.catch(error => {
					console.log('Error in thales-data sportMarkets.parlayVaultTransactions', error);
					throw error;
				});
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
			})
				.then(results =>
					results.map(({ id, vault, timestamp, round, pnl }) => ({
						id,
						vault,
						timestamp,
						round: Number(round),
						pnl: Number(pnl) / 1e18,
					})),
				)
				.catch(error => {
					console.log('Error in thales-data sportMarkets.vaultPnls', error);
					throw error;
				});
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
			})
				.then(results =>
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
				)
				.catch(error => {
					console.log('Error in thales-data sportMarkets.vaultUserTransactions', error);
					throw error;
				});
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
			})
				.then(results =>
					results.map(({ id, owner, tokenId, countryName, url, country }) => ({
						id,
						owner,
						tokenId,
						countryName,
						url,
						country,
					})),
				)
				.catch(error => {
					console.log('Error in thales-data sportMarkets.zebros', error);
					throw error;
				});
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
			})
				.then(results =>
					results.map(({ id, referrer, trader, amount, volume, ammType, timestamp }) => ({
						id,
						referrer,
						trader,
						amount: convertAmount(Number(amount), network),
						volume: convertAmount(Number(volume), network),
						ammType,
						timestamp: Number(timestamp * 1000),
					})),
				)
				.catch(error => {
					console.log('Error in thales-data sportMarkets.referralTransactions', error);
					throw error;
				});
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
			})
				.then(results =>
					results.map(({ id, trades, totalVolume, totalEarned, timestamp }) => ({
						id,
						trades: Number(trades),
						totalVolume: convertAmount(Number(totalVolume), network),
						totalEarned: convertAmount(Number(totalEarned), network),
						timestamp: Number(timestamp * 1000),
					})),
				)
				.catch(error => {
					console.log('Error in thales-data sportMarkets.referrers', error);
					throw error;
				});
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
			})
				.then(results =>
					results.map(({ id, trades, totalVolume, totalAmount, referrer, timestamp }) => ({
						id,
						trades: Number(trades),
						totalVolume: convertAmount(Number(totalVolume), network),
						totalAmount: convertAmount(Number(totalAmount), network),
						referrer,
						timestamp: Number(timestamp * 1000),
					})),
				)
				.catch(error => {
					console.log('Error in thales-data sportMarkets.referredTraders', error);
					throw error;
				});
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
			})
				.then(results =>
					results.map(({ id, liquidityPool, timestamp, round, pnl, liquidityPoolType }) => ({
						id,
						liquidityPool,
						timestamp,
						round: Number(round),
						pnl: Number(pnl) / 1e18,
						liquidityPoolType,
					})),
				)
				.catch(error => {
					console.log('Error in thales-data sportMarkets.liquidityPoolPnls', error);
					throw error;
				});
		},
		liquidityPoolUserTransactions({
			max = Infinity,
			liquidityPool = undefined,
			type = undefined,
			account = undefined,
			minTimestamp = undefined,
			maxTimestamp = undefined,
			round = undefined,
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
							round: round ? round : undefined,
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
			})
				.then(results =>
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
				)
				.catch(error => {
					console.log('Error in thales-data sportMarkets.liquidityPoolUserTransactions', error);
					throw error;
				});
		},
		marchMadnessToken({
			max = Infinity,
			minter = undefined,
			network = 10,
			minCreatedTimestamp = undefined,
			maxCreatedTimestamp = undefined,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.marchMadness[network],
				max,
				query: {
					entity: 'tokens',
					selection: {
						orderBy: 'itemId',
						orderDirection: 'asc',
						where: {
							minter: minter ? `\\"${minter}\\"` : undefined,
							createdAt_gte: minCreatedTimestamp || undefined,
							createdAt_lte: maxCreatedTimestamp || undefined,
						},
					},
					properties: ['id', 'createdHash', 'lastUpdateHash', 'minter', 'itemId', 'brackets', 'createdAt', 'updatedAt'],
				},
			})
				.then(results =>
					results.map(({ id, createdHash, lastUpdateHash, minter, itemId, brackets, createdAt, updatedAt }) => ({
						id,
						createdHash,
						lastUpdateHash,
						minter,
						itemId,
						brackets,
						createdAt: Number(createdAt * 1000),
						updatedAt: Number(updatedAt * 1000),
					})),
				)
				.catch(error => {
					console.log('Error in thales-data sportMarkets.marchMadnessToken', error);
					throw error;
				});
		},
	},
	sportMarketsV2: {
		tickets({
			max = Infinity,
			network = 10,
			owner = undefined,
			address = undefined,
			minTimestamp = undefined,
			maxTimestamp = undefined,
			startPeriod = undefined,
			endPeriod = undefined,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.sportMarketsV2[network],
				max,
				query: {
					entity: 'tickets',
					selection: {
						orderBy: 'timestamp',
						orderDirection: 'desc',
						where: {
							id: address ? `\\"${address}\\"` : undefined,
							owner: owner ? `\\"${owner}\\"` : undefined,
							timestamp_gte: minTimestamp || undefined,
							timestamp_lte: maxTimestamp || undefined,
							lastGameStarts_gte: startPeriod || undefined,
							lastGameStarts_lt: endPeriod || undefined,
						},
					},
					properties: [
						'id',
						'txHash',
						'timestamp',
						'markets { id, gameId, sportId, typeId, maturity, status, line, playerId, position, odd }',
						'lastGameStarts',
						'owner',
						'buyInAmount',
						'payout',
						'isLive',
						'totalQuote',
						'fees',
						'collateral',
					],
				},
			})
				.then(results =>
					results.map(
						({
							id,
							txHash,
							timestamp,
							markets,
							lastGameStarts,
							owner,
							buyInAmount,
							payout,
							isLive,
							totalQuote,
							fees,
							collateral,
						}) => ({
							id,
							txHash,
							timestamp: Number(timestamp * 1000),
							markets: markets.map(market => {
								return {
									id: market.id,
									gameId: market.gameId,
									typeId: Number(market.typeId),
									maturity: Number(market.maturity * 1000),
									status: Number(market.status),
									line: Number(market.line) / 100,
									playerId: Number(market.playerId),
									position: Number(market.position),
									odd: market.odd / 1e18,
								};
							}),
							lastGameStarts: Number(lastGameStarts * 1000),
							owner,
							buyInAmount: convertAmount(Number(buyInAmount), network, collateral),
							payout: convertAmount(Number(payout), network, collateral),
							isLive,
							totalQuote: Number(totalQuote) / 1e18,
							fees: convertAmount(Number(fees), network, collateral),
							collateral,
						}),
					),
				)
				.catch(error => {
					console.log('Error in thales-data sportMarketsV2.tickets', error);
					throw error;
				});
		},
		liquidityPoolPnls({
			max = Infinity,
			liquidityPool = undefined,
			minTimestamp = undefined,
			maxTimestamp = undefined,
			network = 10,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.sportMarketsV2[network],
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
			})
				.then(results =>
					results.map(({ id, liquidityPool, timestamp, round, pnl }) => ({
						id,
						liquidityPool,
						timestamp,
						round: Number(round),
						pnl: Number(pnl) / 1e18,
					})),
				)
				.catch(error => {
					console.log('Error in thales-data sportMarketsV2.liquidityPoolPnls', error);
					throw error;
				});
		},
		liquidityPoolUserTransactions({
			max = Infinity,
			liquidityPool = undefined,
			type = undefined,
			account = undefined,
			minTimestamp = undefined,
			maxTimestamp = undefined,
			round = undefined,
			network = 10,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.sportMarketsV2[network],
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
							round: round ? round : undefined,
							timestamp_gte: minTimestamp ? minTimestamp : undefined,
							timestamp_lte: maxTimestamp ? maxTimestamp : undefined,
						},
					},
					properties: ['id', 'liquidityPool', 'hash', 'timestamp', 'type', 'account', 'amount', 'round'],
				},
			})
				.then(results =>
					results.map(({ id, liquidityPool, hash, timestamp, type, account, amount, round }) => ({
						id,
						liquidityPool,
						hash,
						timestamp: Number(timestamp * 1000),
						type,
						account,
						amount,
						round: Number(round),
					})),
				)
				.catch(error => {
					console.log('Error in thales-data sportMarketsV2.liquidityPoolUserTransactions', error);
					throw error;
				});
		},
		blockedGames({
			max = Infinity,
			gameId = undefined,
			isUnblocked = undefined,
			minTimestamp = undefined,
			maxTimestamp = undefined,
			network = 10,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.sportMarketsV2[network],
				max,
				query: {
					entity: 'blockedGames',
					selection: {
						orderBy: 'timestamp',
						orderDirection: 'desc',
						where: {
							gameId: gameId ? `\\"${gameId}\\"` : undefined,
							isUnblocked: isUnblocked !== undefined ? isUnblocked : undefined,
							timestamp_gte: minTimestamp ? minTimestamp : undefined,
							timestamp_lte: maxTimestamp ? maxTimestamp : undefined,
						},
					},
					properties: ['id', 'timestamp', 'hash', 'gameId', 'reason', 'isUnblocked', 'unblockedBy'],
				},
			})
				.then(results =>
					results.map(({ id, timestamp, hash, gameId, reason, isUnblocked, unblockedBy }) => ({
						id,
						timestamp: Number(timestamp * 1000),
						hash,
						gameId,
						reason,
						isUnblocked,
						unblockedBy,
					})),
				)
				.catch(error => {
					console.log('Error in thales-data sportMarketsV2.blockedGames', error);
					throw error;
				});
		},
	},
};
