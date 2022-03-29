import { ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/dist/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { BeMetaPlace, PrimarySale } from '../src/types'

export const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
	const { deployments, getNamedAccounts } = hre
	const { deploy } = deployments

	const { deployer } = await getNamedAccounts()

	const BeMetaPlaceDeployment = await deployments.get('BeMetaPlace')
	await deploy('PrimarySale', {
		from: deployer,
		log: true,
		skipIfAlreadyDeployed: true,
		args: [],
		proxy: {
			execute: {
				init: {
					methodName: 'initialize',
					args: [BeMetaPlaceDeployment.address],
				},
			},
			proxyContract: 'OptimizedTransparentProxy',
			upgradeIndex: 0,
		},
	})
	await deploy('PrimarySale', {
		from: deployer,
		log: true,
		skipIfAlreadyDeployed: true,
		args: [],
		proxy: {
			execute: {
				init: {
					methodName: 'initialize',
					args: [BeMetaPlaceDeployment.address],
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

	const BeMetaPlace = (await ethers.getContractAt(
		'BeMetaPlace',
		BeMetaPlaceDeployment.address,
		deployer
	)) as BeMetaPlace

	const tx0 = await BeMetaPlace.setAdminAccess(PrimarySale.address, true)
	console.log('Transaction hash:', tx0.hash)

	const receipt0 = await tx0.wait()
	console.log('Receipt hash:', receipt0.transactionHash)

	const tx = await PrimarySale.setAdminAccess(
		'0x7a783DCE34B58055610E87B373cD97F26B45B1D9',
		true
	)
	console.log('Transaction hash:', tx.hash)
	const receipt = await tx.wait()
	console.log('Receipt hash:', receipt.transactionHash)

	const tx2 = await PrimarySale.setAllowedERC20(
		(
			await deployments.get('BeMetaToken')!
		).address,
		true
	)
	console.log('Transaction hash ERC20:', tx2.hash)
	const receipt2 = await tx2.wait()
	console.log('Receipt hash:', receipt2.transactionHash)
}
export default func
func.tags = ['PrimarySale']
func.dependencies = ['BeMetaPlace']
