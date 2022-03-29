import { deployments, ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/dist/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { BeMetaPlace, PrimarySale } from '../src/types'

export const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
	const { getNamedAccounts } = hre

	const { deployer } = await getNamedAccounts()
	// const BeMetaPlace = (await ethers.getContract(
	// 	'BeMetaPlace',
	// 	deployer
	// )) as BeMetaPlace

	const PrimarySale = (await ethers.getContract(
		'PrimarySale',
		deployer
	)) as PrimarySale
	const array = [PrimarySale]
	for (let index = 0; index < array.length; index++) {
		const element = array[index]
		const tx = await element.setTrustedForwarder(
			'0x9399BB24DBB5C4b782C70c2969F58716Ebbd6a3b'
		)
		console.log('hash:', tx.hash)
		const r = await tx.wait()
		console.log('Receipt:', r.transactionHash)
	}
}
export default func
func.tags = ['SetTrustedForwarder']
func.dependencies = []
