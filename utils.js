const ZERO_ADDRESS = '0x' + '0'.repeat(40);

const hexToAscii = str => {
	const hex = str.toString();
	let out = '';
	for (let n = 2; n < hex.length; n += 2) {
		const nextPair = hex.substr(n, 2);
		if (nextPair !== '00') {
			out += String.fromCharCode(parseInt(nextPair, 16));
		}
	}
	return out;
};

const roundTimestampTenSeconds = timestamp => Math.round(timestamp / 10) * 10;

const getHashFromId = id => id.split('-')[0];

const formatGQLArray = arr => '[' + arr.map(code => `\\"${code}\\"`).join(',') + ']';

const formatGQLString = str => `\\"${str}\\"`;

const sportMarketTypeFormatting = market => {
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
				? Number(market.playerPropsLine) / 100
				: 0,
		playerPropsType:
			market.playerPropsType !== undefined && market.playerPropsType !== null ? Number(market.playerPropsType) : 0,
		playerPropsOutcome: market.playerPropsOutcome,
		playerPropsScore:
			market.playerPropsScore !== undefined && market.playerPropsScore !== null ? Number(market.playerPropsScore) : 0,
	};
};

const getGraphStudioAPIUrl = (graphId, apiKey) => {
	return `https://gateway-arbitrum.network.thegraph.com/api/${apiKey}/subgraphs/id/${graphId}`;
};

const getGraphStudioV2APIUrl = (deploymentId, apiKey) => {
	return `https://gateway-arbitrum.network.thegraph.com/api/${apiKey}/deployments/id/${deploymentId}`;
};

module.exports = {
	ZERO_ADDRESS,
	hexToAscii,
	roundTimestampTenSeconds,
	getHashFromId,
	formatGQLArray,
	formatGQLString,
	sportMarketTypeFormatting,
	getGraphStudioAPIUrl,
	getGraphStudioV2APIUrl,
};
