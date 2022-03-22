import { DeployFunction } from 'hardhat-deploy/dist/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

export const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
	const { deployments, getNamedAccounts } = hre
	const { deploy } = deployments

	const { deployer } = await getNamedAccounts()

	const BeMetaPlace = await deployments.get('BeMetaPlace')

	await deploy('PrimarySale', {
		from: deployer,
		log: true,
		// skipIfAlreadyDeployed: true,
		args: [],
		proxy: {
			execute: {
				init: {
					methodName: 'initialize',
					args: [BeMetaPlace.address],
				},
			},
			proxyContract: 'OptimizedTransparentProxy',
			upgradeIndex: 1,
		},
	})
}
export default func
func.tags = ['PrimarySale']
func.dependencies = ['BeMetaPlace']
