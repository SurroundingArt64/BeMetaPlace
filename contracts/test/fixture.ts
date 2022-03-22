import {
	deployments,
	ethers,
	getNamedAccounts,
	getUnnamedAccounts,
} from 'hardhat'
import { BeMetaPlace, BeMetaToken, PrimarySale } from '../src/types'
import { setupUser, setupUsers } from './utils'

export const setupTest = deployments.createFixture(async () => {
	await deployments.fixture(['BeMetaPlace', 'BeMetaToken', 'PrimarySale'])

	const BeMetaPlace = (await ethers.getContract('BeMetaPlace')) as BeMetaPlace
	const PrimarySale = (await ethers.getContract('PrimarySale')) as PrimarySale
	const BeMetaToken = (await ethers.getContract('BeMetaToken')) as BeMetaToken

	const contracts = { BeMetaPlace, PrimarySale, BeMetaToken }
	const { deployer: deployerAddress } = await getNamedAccounts()
	const userAddresses = await getUnnamedAccounts()

	const deployer = await setupUser(deployerAddress, contracts)
	const users = await setupUsers(userAddresses, contracts)

	return { deployer, users, ...contracts }
})
