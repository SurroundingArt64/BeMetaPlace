import './loadEnv.ts'
import { HardhatUserConfig } from 'hardhat/types'

import 'hardhat-deploy'
import '@typechain/hardhat'

import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'

import 'solidity-coverage'
import 'hardhat-gas-reporter'

import { readFileSync } from 'fs'

const getPrivateKey = () => {
	return [
		readFileSync(process.env.DEPLOYER_PRIVATE_KEY as string, 'utf-8').trim(),
	]
}

const config: HardhatUserConfig = {
	solidity: {
		compilers: [
			{
				version: '0.8.6',
				settings: {
					optimizer: {
						enabled: true,
						runs: 200,
					},
				},
			},
		],
	},
	networks: {
		hardhat: {
			tags: ['testing'],
		},
		rinkeby: {
			url: `https://rinkeby.infura.io/v3/${process.env.INFURA_APP_ID}`,
			chainId: 4,
			accounts: process.env.DEPLOYER_PRIVATE_KEY ? getPrivateKey() : undefined,
			gasPrice: 2_000_000_000, // 2 gwei in numerical wei
		},
		mumbai: {
			url: `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_APP_ID}`,
			chainId: 80001,
			accounts: process.env.DEPLOYER_PRIVATE_KEY ? getPrivateKey() : undefined,
			gasPrice: 2_500_000_000, // 2.5 gwei in numerical wei
		},
		bsc_testnet: {
			url: `https://bsc.getblock.io/testnet/?api_key=${process.env.BLOCK_API_KEY}`,
			chainId: 97,
			accounts: process.env.DEPLOYER_PRIVATE_KEY ? getPrivateKey() : undefined,
			gasPrice: 5_500_000_000, // 5.5 gwei in numerical wei
		},
		mainnet: {
			url: `https://mainnet.infura.io/v3/${process.env.INFURA_APP_ID}`,
			chainId: 1,
			accounts: process.env.DEPLOYER_PRIVATE_KEY ? getPrivateKey() : undefined,
		},
	},
	namedAccounts: {
		deployer: {
			default: 0,
			4: 0,
		},
		admin: {
			default: 1,
			4: 0,
		},
		beneficiary: {
			default: 2,
			4: 0,
		},
	},
	paths: {
		sources: 'src',
	},
	typechain: {
		outDir: 'src/types',
		target: 'ethers-v5',
	},
	etherscan: {
		apiKey: process.env.EXPLORER_API_KEY || '',
	},
	mocha: {
		timeout: 0,
	},
	gasReporter: {
		enabled: true,
	},
}
export default config
