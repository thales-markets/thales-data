const API_KEYS = {
	DigitalOptions: 'a6068becfe82e6542c05ec1385be2942',
	Overtime: 'd19a6a80c2d5a004e62041171d5f4c64',
	Token: '8f8a910e03ea428c12311ab51f54e693',
	MarchMadness: '9ab2d34bfd0ca23bf69102403c4631f3',
	TaleOfThales: '2c6305efe0806f0160e111f5f03e600d',
	OvertimeV2: '9e4d7057d40ebc4a5a3b672cd67d2994',
};

const SUBGRAPH_IDS = {
	Token: {
		10: '2WQ9TKJt96NUxuS2DbR7B4aAwcU9CMiaBH7fwZZfjpn1',
		42161: 'GRHJHjVRzHrQoN86VyjXMDTDiw9pHNB9NqQJxQmnZcwb',
		8453: '3cwvVz7HwAJD76gfmjfu8A92e9cELN9TEvY6rkdxyjaY',
		1: '6fFZCSzLX6XNbfBpTgo19fTeP3A3EjG2rmpmwEkXpkke',
		137: '',
	},
	DigitalOptions: {
		10: 'GADfDRePpbqyjK2Y3JkQTBPBVQj98imhgKo7oRWW7RqQ',
		42161: 'FZH9ySiLCdqKrwefaospe6seSqV1ZoW4FvPQUGP7MFob',
		8453: 'EK55ptWg45X5Zbq2uF2cMCgEVkhXzHw5tiHaNc6CDsET',
		1: '',
		137: 'G7wi71W3PdtYYidKy5pEmJvJ1Xpop25ogynstRjPdyPG',
	},
	DigitalOptionsLP: {
		10: '2KwbpRegJoWZw18YQ42ymWSe1ypdPsQwGZCTRZEEpjrP',
		42161: '',
		8453: '',
		1: '',
		137: '',
	},
	SportsMarkets: {
		10: 'GNVg7vqPeoaqDARvssvwCUaLfizACsrmeFFCpZd4VBDq',
		42161: 'DFNKpS95y26V3kuTa9MtD2J3ws65QF6RPP7RFLRjaHFx',
		8453: '8QTYZrM43ewCWjWN9XGv6oboR6FPHm8cuPoZiWtRSHsk',
		1: '',
		137: '',
	},
	MarchMadness: {
		10: '4XVWDUFBKfkLRv5U9ch1jkt4W7fV7qhMxHSfH9k8ooDs',
		42161: 'J6TKRNiASpm5p6o8YJQJ3yYh5sXZ8DQxLtMTWWemH3pf',
		8453: '',
		1: '',
		137: '',
	},
	TaleOfThales: {
		10: 'EjtVBQUbMHWUiuEBM2QpCAatNm4cKA3bgubEgq9i2S36',
		42161: 'DvYFC7pdUGudJ2rCQH5Z3Stb6p4Px2YRMRcDsFG1Zia',
		8453: '',
		1: '',
		137: '',
	},
	TradeRewards: {
		10: '6XZzT3mWKP2aenQK2x4DGFzfHt1deDGycC8squJ9C5fL',
		42161: '',
		8453: '',
		1: '',
		137: '',
	},
	SportsMarketsV2: {
		10: 'DSxiPB7bWCBU4Aw1gsqSPJ72Usk4STbiWQSnQRn9YGD4',
		42161: 'BRtus5QB7fZzKBAtMEm4KyhJyGCKWPoGGiMiQzqdFmfv',
		8453: '',
		1: '',
		137: '',
	},
};

const LAST_DEPLOYMENT_IDS = {
	Token: {
		10: 'QmUma8S2voyADChDiSHqtNKHbL5Z55B8PDrcxMH7MbmYEy',
		42161: 'QmSFwUzrf1rBQovQ13kDuTrD1cQmP9fKEynUgziowspihj',
		8453: 'QmNdpnRBiJR5T4NdYKuBD1E2NYPZwV4emiG4zyYahBGfHA',
		1: 'QmTFBtGHtbXgU9FEnzNuz56HKNu5kX6d9zFFzMLWp4t5Zz',
		137: '',
	},
	DigitalOptions: {
		10: 'QmahfsRc8sMY1W53Qq3NoKh5TpCewFuwPkfwoQPJC3B7F7',
		42161: 'QmctjL39winw3G1WetmVhwHYwctXgp1LYK8GYEExSNQSzA',
		8453: 'QmTAnoQoWMwQGskiYbaYRAHPQNi7Qoq1r2aUS11t2D8kpp',
		1: '',
		137: 'QmarczrQUEpWMA73sGRgaQCCAzZ6EJnwntQUfgbdsVcjqy',
	},
	DigitalOptionsLP: {
		10: 'QmXhBxrvRGrq1538YmuLjCyJNdAop74iF1jpbKpXve3AxG',
		42161: '',
		8453: '',
		1: '',
		137: '',
	},
	SportsMarkets: {
		10: 'QmVTmfjNXA5ZM9uZy75eNgGHjX45tmgDfnSYjm5EQjLbJN',
		42161: 'QmXEs6E47dLKNpFpUTkY5MDfoDmLU2WiCn7n6HjmfWNsyx',
		8453: 'QmRrECmBU89D7SZJU54M5qKBFFfRRSQWPPpiKM288fSebs',
		1: '',
		137: '',
	},
	MarchMadness: {
		10: 'QmYetKzc4ejBxu2YYsKoAJwJw8yN5Nu2XoXjJfRMVLqkSn',
		42161: 'QmRPjR5CvEbS1zfyjZJxTCDp7GX25rGiBoAS4Dox9q5aQj',
		8453: '',
		1: '',
		137: '',
		11155420: 'QmTnG6h9KKyKK7k5EwWhcMWoNF5PoCSyMSHZHFcdS8rHct',
	},
	TaleOfThales: {
		10: 'QmUWHqAcH5FutcVBmGJYFfquu98CXrVSPLjWRbveV1GnDG',
		42161: 'Qmc17HAy8QZWSz3agp2xVw3FneavNuP7Z5ZNXtJNMdypA1',
		8453: '',
		1: '',
		137: '',
	},
	SportsMarketsV2: {
		10: 'QmbrCRe72xEPdDKeX4ZWKGH2Z9zMWtcpmeaFhpVfyWmX7C',
		42161: 'QmeiiH6e76Z2Bvgm31yoAWKiWhuXdNrvb4bsSJR44rCqG3',
		8453: 'QmaqaeqMkRCi17XJMVm7b18dWvTRDuFHJ2y1fVA9fpUxJZ',
		1: '',
		137: '',
		11155420: 'QmR1gaeBTAo572NiMyp72TX1BCdBFk5QMj1g1JNTc6VGQ3',
	},
};

module.exports = {
	SUBGRAPH_IDS,
	LAST_DEPLOYMENT_IDS,
	API_KEYS,
};
