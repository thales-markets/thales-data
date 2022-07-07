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
		80001: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-mumbai', // polygon mumbai
		137: 'https://api.thegraph.com/subgraphs/name/thales-markets/thales-polygon', // polygon
	},
	exoticMarkets: {
		69: 'https://api.thegraph.com/subgraphs/name/thales-markets/exotic-markets-optimism-kovan', // optimism kovan
		10: 'https://api.thegraph.com/subgraphs/name/thales-markets/exotic-markets-optimism', // optimism
	},
	sportMarkets: {
		42: 'https://api.thegraph.com/subgraphs/name/thales-markets/sport-markets-kovan', // kovan
		10: 'https://api.thegraph.com/subgraphs/name/thales-markets/sport-markets-optimism', // optimism
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
				api: graphAPIEndpoints.binaryOptions[network],
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
			network = 1,
		} = {}) {
			return pageResults({
				api: graphAPIEndpoints.binaryOptions[network],
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
			maker = undefined,
			taker = undefined,
			market = undefined,
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
						makerAmount:
							network === 137 && makerToken === '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'
								? makerAmount / 1e6
								: makerAmount / 1e18,
						takerAmount:
							network === 137 && takerToken === '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'
								? takerAmount / 1e6
								: takerAmount / 1e18,
						market,
						orderSide,
						optionSide,
						blockNumber: Number(blockNumber),
					}),
				),
			);
		},
		positionBalances({ max = Infinity, account = undefined, network = 137 } = {}) {
			return pageResults({
				api: graphAPIEndpoints.binaryOptions[network],
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
		referrers({ max = Infinity, address = undefined, network = 137 } = {}) {
			return pageResults({
				api: graphAPIEndpoints.binaryOptions[network],
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
					totalVolume: totalVolume / 1e18,
					totalEarned: totalEarned / 1e18,
					timestamp: Number(timestamp * 1000),
				})),
			);
		},
		referralTransfers({ max = Infinity, trader = undefined, referrer = undefined, network = 137 } = {}) {
			return pageResults({
				api: graphAPIEndpoints.binaryOptions[network],
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
					amount: amount / 1e18,
					volume: volume / 1e18,
					timestamp: Number(timestamp * 1000),
				})),
			);
		},
		referredTraders({ max = Infinity, referrer = undefined, network = 137 } = {}) {
			return pageResults({
				api: graphAPIEndpoints.binaryOptions[network],
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
					totalVolume: totalVolume / 1e18,
					totalEarned: totalEarned / 1e18,
					refferer,
					timestamp: Number(timestamp * 1000),
				})),
			);
		},
		rangedPositionBalances({ max = Infinity, account = undefined, network = 137 } = {}) {
			return pageResults({
				api: graphAPIEndpoints.binaryOptions[network],
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
				api: graphAPIEndpoints.binaryOptions[network],
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
				api: graphAPIEndpoints.binaryOptions[network],
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
				api: graphAPIEndpoints.binaryOptions[network],
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
			minTimestamp = undefined,
			maxTimestamp = undefined,
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
							isOpen: isOpen !== undefined ? isOpen : undefined,
							timestamp_gte: minTimestamp || undefined,
							timestamp_lte: maxTimestamp || undefined,
						},
					},
					properties: [
						'id',
						'timestamp',
						'address',
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
					],
				},
			}).then(results =>
				results.map(
					({
						id,
						timestamp,
						address,
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
					}) => ({
						id,
						timestamp: Number(timestamp * 1000),
						address,
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
					}),
				),
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
						},
					},
					properties: ['id', 'hash', 'timestamp', 'type', 'account', 'market', 'amount', 'position'],
				},
			}).then(results =>
				results.map(({ id, hash, timestamp, type, account, market, amount, position }) => ({
					id,
					timestamp: Number(timestamp * 1000),
					hash,
					type,
					account,
					market,
					amount: Number(amount) / 1e18,
					position: Number(position),
				})),
			);
		},
		positionBalances({ max = Infinity, account = undefined, network = 42 } = {}) {
			return pageResults({
				api: graphAPIEndpoints.sportMarkets[network],
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
						'position {id, side, claimable, market { id, timestamp, address, maturityDate, tags, isOpen, isResolved, isCanceled, finalResult, poolSize, numberOfParticipants, homeTeam, awayTeam, homeOdds, awayOdds, drawOdds, homeScore, awayScore }}',
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
	},
};
