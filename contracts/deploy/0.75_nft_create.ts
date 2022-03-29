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

	// const tx = await BeMetaPlace.mint(
	// 	deployer,
	// 	'ipfs://QmPsm1f5vPizbnRfwiJCjRrKz3v2naZg6G192BUzCfS2Xt'
	// )
	// console.log('hash:', tx.hash)
	// const r = await tx.wait()
	// console.log('Receipt:', r.transactionHash)
}
export default func
func.tags = ['NFTCreate']
func.dependencies = []
