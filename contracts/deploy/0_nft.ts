import { DeployFunction } from 'hardhat-deploy/dist/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

export const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
	const { deployments, getNamedAccounts } = hre
	const { deploy } = deployments

	const { deployer } = await getNamedAccounts()

	await deploy('BeMetaPlace', {
		from: deployer,
		log: true,
		skipIfAlreadyDeployed: true,
		args: [],
		proxy: {
			execute: {
				init: {
					methodName: 'initialize',
					args: [
						'https://raw.githubusercontent.com/SurroundingArt64/cdn/master/{id}.json',
					],
				},
			},
			proxyContract: 'OptimizedTransparentProxy',
		},
	})
}
export default func
func.tags = ['BeMetaPlace1155']
func.dependencies = []
