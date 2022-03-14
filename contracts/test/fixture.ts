import {
	deployments,
	ethers,
	getNamedAccounts,
	getUnnamedAccounts,
} from 'hardhat'
import { BeMetaPlace } from '../src/types'
import { setupUser, setupUsers } from './utils'

export const setupTest = deployments.createFixture(async () => {
	await deployments.fixture(['BeMetaPlace'])

	const BeMetaPlace = (await ethers.getContract('BeMetaPlace')) as BeMetaPlace

	const contracts = { BeMetaPlace }
	const { deployer: deployerAddress } = await getNamedAccounts()
	const userAddresses = await getUnnamedAccounts()

	const deployer = await setupUser(deployerAddress, contracts)
	const users = await setupUsers(userAddresses, contracts)

	return { deployer, users, ...contracts }
})
