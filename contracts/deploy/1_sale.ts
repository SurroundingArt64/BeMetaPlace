import { ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/dist/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

export const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
	const { deployments, getNamedAccounts } = hre
	const { deploy, execute } = deployments
	const BeMetaPlace = await deployments.get('BeMetaPlace')
	const { deployer, beneficiary } = await getNamedAccounts()

	const NFTSale = await deploy('NFTSale', {
		from: deployer,
		log: true,
		skipIfAlreadyDeployed: true,
		args: [],
		proxy: {
			execute: {
				init: {
					methodName: 'initialize',
					args: [
						BeMetaPlace!.address,
						beneficiary,
						'0x27D5B61bCCBF2b7b44ce2f51aa17Eab4EB904c04',
					],
				},
			},
			proxyContract: 'OptimizedTransparentProxy',
		},
	})

	await execute(
		'BeMetaPlace',
		{ from: deployer, log: true },
		'setAdminAccess',
		NFTSale!.address,
		true
	)

	await execute(
		'NFTSale',
		{ from: deployer, log: true },
		'createSale',
		100,
		0,
		3600 * 24 * 30,
		ethers.utils.parseEther('100'),
		'0x27D5B61bCCBF2b7b44ce2f51aa17Eab4EB904c04'
	)
}
export default func
func.tags = ['NFTSale']
func.dependencies = []
