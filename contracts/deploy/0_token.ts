import { DeployFunction } from 'hardhat-deploy/dist/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

export const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
	const { deployments, getNamedAccounts } = hre
	const { deploy } = deployments

	const { deployer } = await getNamedAccounts()

	await deploy('BeMetaToken', {
		from: deployer,
		log: true,
		skipIfAlreadyDeployed: true,
		args: [],
		proxy: {
			execute: {
				init: {
					methodName: 'initialize',
					args: ['BeMetaToken', 'BMT'],
				},
			},
			proxyContract: 'OptimizedTransparentProxy',
			upgradeIndex: 0,
		},
	})
}
export default func
func.tags = ['BeMetaToken']
func.dependencies = []
