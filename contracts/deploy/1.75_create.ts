import { deployments, ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/dist/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { BeMetaPlace, PrimarySale } from '../src/types'

export const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
	const { getNamedAccounts } = hre

	const { deployer } = await getNamedAccounts()
	const BeMetaPlace = (await ethers.getContract(
		'BeMetaPlace',
		deployer
	)) as BeMetaPlace

	const PrimarySale = (await ethers.getContract(
		'PrimarySale',
		deployer
	)) as PrimarySale

	const tx = await PrimarySale.create(
		'https://gateway.pinata.cloud/ipfs/QmWr11LeYF6GSUVZrWoKKHGZ6bZCwtz414PofyDR8sjDhL',
		(
			await deployments.get('BeMetaToken')
		).address,
		3600 * 30,
		ethers.utils.parseEther('200')
	)
	console.log('hash:', tx.hash)
	const r = await tx.wait()
	console.log('Receipt:', r.transactionHash)
}
export default func
func.tags = ['SetAdminPrimary']
func.dependencies = []
