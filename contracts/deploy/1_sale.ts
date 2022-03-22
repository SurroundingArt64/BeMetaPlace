import { ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/dist/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { PrimarySale } from '../src/types'

export const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
	const { deployments, getNamedAccounts } = hre
	const { deploy } = deployments

	const { deployer } = await getNamedAccounts()

	const BeMetaPlace = await deployments.get('BeMetaPlace')

	await deploy('PrimarySale', {
		from: deployer,
		log: true,
		skipIfAlreadyDeployed: true,
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
	const PrimarySale = (await ethers.getContract(
		'PrimarySale',
		deployer
	)) as PrimarySale

	const tx = await PrimarySale.setAdminAccess(
		'0xb8D249aa28E689f418c6c3D41Dd40076B9F09797',
		true
	)
	console.log('Transaction hash:', tx.hash)
	const receipt = await tx.wait()
	console.log('Receipt hash:', receipt.transactionHash)
}
export default func
func.tags = ['PrimarySale']
func.dependencies = ['BeMetaPlace']
