import { expect } from 'chai'
import { ethers } from 'hardhat'
import { PromiseType } from 'utility-types'
import { setupTest } from './fixture'

describe('BeMetaPlace.sol', () => {
	type FixtureType = PromiseType<ReturnType<typeof setupTest>>
	type UserType = FixtureType['deployer']

	let deployer: UserType,
		alice: UserType,
		bob: UserType,
		BeMetaPlace: FixtureType['BeMetaPlace'],
		PrimarySale: FixtureType['PrimarySale'],
		BeMetaToken: FixtureType['BeMetaToken']

	beforeEach(async () => {
		;({
			deployer,
			users: [alice, bob],
			BeMetaPlace,
			BeMetaToken,
			PrimarySale,
		} = await setupTest())
		await deployer.BeMetaPlace.setAdminAccess(PrimarySale.address, true)
	})

	it('correct name', async () => {
		expect(await BeMetaPlace.name()).to.equal('BeMetaPlace')
		expect(await BeMetaPlace.symbol()).to.equal('BMP')
	})

	it('cannot sale with un-allowed', async () => {
		await expect(
			deployer.PrimarySale.create('utr-1', BeMetaToken.address, 3600, 1)
		).to.be.revertedWith('Not allowed token')
	})

	it('can create sale with allowed token', async () => {
		await deployer.PrimarySale.setAllowedERC20(BeMetaToken.address, true)
		await deployer.PrimarySale.create('link-1', BeMetaToken.address, 3600, 1)
	})

	it('create multiple buy [2]', async () => {
		const amount = ethers.utils.parseEther('100')
		await deployer.PrimarySale.setAllowedERC20(BeMetaToken.address, true)
		await deployer.PrimarySale.create(
			'link-1',
			BeMetaToken.address,
			3600,
			amount
		)
		await deployer.PrimarySale.create(
			'link-2',
			BeMetaToken.address,
			3600,
			amount
		)
		await deployer.PrimarySale.create(
			'link-3',
			BeMetaToken.address,
			3600,
			amount
		)

		await deployer.BeMetaToken.transfer(alice.address, amount)

		await alice.BeMetaToken.approve(PrimarySale.address, amount)

		await alice.PrimarySale.buy(2)

		const values = (
			await deployer.PrimarySale.getListings(deployer.address)
		).map((elem) => elem.toNumber())

		expect(values).to.deep.eq([1, 3])

		const sales = (await deployer.PrimarySale.getSales(deployer.address)).map(
			(sale) => sale.listingIndex.toNumber()
		)
		expect(sales).to.deep.eq([0, 1])

		expect(await BeMetaPlace.ownerOf(2)).to.eq(alice.address)
	})
})
