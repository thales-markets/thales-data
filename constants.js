const API_KEYS = {
	DigitalOptions: '02c406389fab68b2da28248ebb707777',
	Overtime: '26c1cbf423ad6542ba906dae598f7b7e',
	Token: 'b90964141e2756d681dc067178c54c64',
	MarchMadness: '81a502cf3a469b268e220c38e78a6823',
	TaleOfThales: '82b5389190f8d70d135cc771692c542f',
	Base: 'ee35409837e6206bbb88686b2559f0b5',
	OvertimeV2: 'ee35409837e6206bbb88686b2559f0b5',
};

const SUBGRAPH_IDS = {
	Token: {
		10: '2WQ9TKJt96NUxuS2DbR7B4aAwcU9CMiaBH7fwZZfjpn1',
		42161: 'GRHJHjVRzHrQoN86VyjXMDTDiw9pHNB9NqQJxQmnZcwb',
		8453: '',
		1: '6fFZCSzLX6XNbfBpTgo19fTeP3A3EjG2rmpmwEkXpkke',
		137: '',
	},
	DigitalOptions: {
		10: 'GADfDRePpbqyjK2Y3JkQTBPBVQj98imhgKo7oRWW7RqQ',
		42161: 'FZH9ySiLCdqKrwefaospe6seSqV1ZoW4FvPQUGP7MFob',
		8453: '',
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
		8453: '',
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
};

const LAST_DEPLOYMENT_IDS = {
	Token: {
		10: 'QmaU8Jq6PEWfXkoUB9NkbNAy3fVx42QQMrPTZ3aF9WroSF',
		42161: 'QmavMBnEpQf7JKeK3kBu6FxXooCneynEUVMd5nvuw3fnQD',
		8453: 'QmNdpnRBiJR5T4NdYKuBD1E2NYPZwV4emiG4zyYahBGfHA',
		1: 'QmTFBtGHtbXgU9FEnzNuz56HKNu5kX6d9zFFzMLWp4t5Zz',
		137: '',
	},
	DigitalOptions: {
		10: 'QmUgLVEawrUuV8M6xxauDPf1W7nW7VMn6Yf7KtjbSDg46K',
		42161: 'QmZqty5SxWqHkXznX3VBQ2oPUT3uzWmWdVznTPNLKpKxEf',
		8453: 'QmQRj8CnyKYT1dHVuXDVLQFLLHXik4GUfoemjRSnmsJvs9',
		1: '',
		137: 'QmSz5FuLoLsrkLdvmmsvaChy6jbgei6aQxAcBXMURy5k66',
	},
	DigitalOptionsLP: {
		10: 'QmVPvbgX78CSidKtKmUc7CzEomoyh8JJDUreh1878m48c4',
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
		42161: 'QmSnKk6M4QcTzFo4KvstvtNQDjLNdswFoT85JcmzrM6NUp',
		8453: '',
		1: '',
		137: '',
	},
	TaleOfThales: {
		10: 'QmUWHqAcH5FutcVBmGJYFfquu98CXrVSPLjWRbveV1GnDG',
		42161: 'Qmc17HAy8QZWSz3agp2xVw3FneavNuP7Z5ZNXtJNMdypA1',
		8453: '',
		1: '',
		137: '',
	},
	TradeRewards: {
		10: 'QmVykqjYvVG8mrsgWWyZ9ugUu1v8gQvgZdbhYfHNyfoVGM',
		42161: '',
		8453: '',
		1: '',
		137: '',
	},
	SportsMarketsV2: {
		10: 'QmfSiTBoZbVKKKuqgwjxx1ZZfpa9UtVJ4vGu2k6aqt2wCF',
		42161: 'QmcuiCKfqaKb5N27UJKNyStsYjfaDztAKUfg87QYtv2p1w',
		8453: '',
		1: '',
		137: '',
	},
};

module.exports = {
	SUBGRAPH_IDS,
	LAST_DEPLOYMENT_IDS,
	API_KEYS,
};
