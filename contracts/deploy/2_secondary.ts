import { DeployFunction } from 'hardhat-deploy/dist/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

export const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
	const { deployments, getNamedAccounts } = hre
	const { deploy } = deployments

	const { deployer } = await getNamedAccounts()

	await deploy('SecondarySale', {
		from: deployer,
		log: true,
		skipIfAlreadyDeployed: true,
		args: [],
		proxy: {
			execute: {
				init: {
					methodName: 'initialize',
					args: [],
				},
			},
			proxyContract: 'OptimizedTransparentProxy',
			upgradeIndex: 0,
		},
	})

	await deploy('SecondarySale', {
		from: deployer,
		log: true,
		skipIfAlreadyDeployed: true,
		args: [],
		proxy: {
			execute: {
				init: {
					methodName: 'initialize',
					args: [],
				},
			},
			proxyContract: 'OptimizedTransparentProxy',
			upgradeIndex: 1,
		},
	})
}
export default func
func.tags = ['SecondarySale']
func.dependencies = ['BeMetaPlace']
