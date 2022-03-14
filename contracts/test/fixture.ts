import { deployments, ethers } from 'hardhat'

export const setupTest = deployments.createFixture(async () => {
	await deployments.fixture(['BeMetaPlace'])

	await ethers.getContract('BeMetaPlace')
})
