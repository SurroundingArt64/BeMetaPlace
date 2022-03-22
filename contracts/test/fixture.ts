import {
	deployments,
	ethers,
	getNamedAccounts,
	getUnnamedAccounts,
} from 'hardhat'
import {
	BeMetaPlace,
	BeMetaToken,
	PrimarySale,
	SecondarySale,
} from '../src/types'
import { setupUser, setupUsers } from './utils'

export const setupTest = deployments.createFixture(async () => {
	await deployments.fixture([
		'BeMetaPlace',
		'BeMetaToken',
		'PrimarySale',
		'SecondarySale',
	])

	const BeMetaPlace = (await ethers.getContract('BeMetaPlace')) as BeMetaPlace
	const PrimarySale = (await ethers.getContract('PrimarySale')) as PrimarySale
	const SecondarySale = (await ethers.getContract(
		'SecondarySale'
	)) as SecondarySale
	const BeMetaToken = (await ethers.getContract('BeMetaToken')) as BeMetaToken

	const contracts = { BeMetaPlace, PrimarySale, BeMetaToken, SecondarySale }
	const { deployer: deployerAddress } = await getNamedAccounts()
	const userAddresses = await getUnnamedAccounts()

	const deployer = await setupUser(deployerAddress, contracts)
	const users = await setupUsers(userAddresses, contracts)

	return { deployer, users, ...contracts }
})
