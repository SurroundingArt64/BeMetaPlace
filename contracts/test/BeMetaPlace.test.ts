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
		SecondarySale: FixtureType['SecondarySale'],
		BeMetaToken: FixtureType['BeMetaToken']

	beforeEach(async () => {
		;({
			deployer,
			users: [alice, bob],
			BeMetaPlace,
			BeMetaToken,
			PrimarySale,
			SecondarySale,
		} = await setupTest())
		await deployer.BeMetaPlace.setAdminAccess(PrimarySale.address, true)
		await deployer.BeMetaPlace.setAdminAccess(SecondarySale.address, true)
	})

	it('correct name', async () => {
		expect(await BeMetaPlace.name()).to.equal('BeMetaPlace')
		expect(await BeMetaPlace.symbol()).to.equal('BMP')
	})

	describe('Primary Sale', () => {
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
			).map((elem: any) => elem.toNumber())
			expect(values).to.deep.eq([1, 3])
			const sales = (await deployer.PrimarySale.getSales(deployer.address)).map(
				(sale: any) => sale.listingIndex.toNumber()
			)
			expect(sales).to.deep.eq([0, 1])
			expect(await BeMetaPlace.ownerOf(2)).to.eq(alice.address)
		})
		it('can cancel sale', async () => {
			const amount = ethers.utils.parseEther('100')
			await deployer.PrimarySale.setAllowedERC20(BeMetaToken.address, true)
			await deployer.PrimarySale.create(
				'cancel-1',
				BeMetaToken.address,
				3600,
				amount
			)
			await deployer.PrimarySale.cancel(1)
			const values = (
				await deployer.PrimarySale.getListings(deployer.address)
			).map((elem: any) => elem.toNumber())
			expect(values).to.deep.eq([])
		})
		it('can cancel and re-list', async () => {
			const amount = ethers.utils.parseEther('100')
			await deployer.PrimarySale.setAllowedERC20(BeMetaToken.address, true)
			await deployer.PrimarySale.create(
				'cancel-1',
				BeMetaToken.address,
				3600,
				amount
			)
			await deployer.PrimarySale.cancel(1)
			let values = (
				await deployer.PrimarySale.getListings(deployer.address)
			).map((elem: any) => elem.toNumber())
			expect(values).to.deep.eq([])
			await deployer.PrimarySale.setAllowedERC20(BeMetaToken.address, true)
			await deployer.PrimarySale.create(
				'cancel-1',
				BeMetaToken.address,
				3600,
				amount
			)
			values = (await deployer.PrimarySale.getListings(deployer.address)).map(
				(elem: any) => elem.toNumber()
			)
			expect(values).to.deep.eq([2])
		})
	})

	describe('Secondary Sale', () => {
		it('cannot sale with un-allowed NFTAddress', async () => {
			const amount = ethers.utils.parseEther('100')
			await expect(
				alice.SecondarySale.create(
					BeMetaPlace.address,
					BeMetaToken.address,
					'utr-1',
					amount,
					Date.now(),
					Date.now() + 3600
				)
			).to.be.revertedWith('NFTAddress not allowed')
		})
		it('cannot sale with un-allowed CurrencyAddress', async () => {
			const amount = ethers.utils.parseEther('100')
			await deployer.SecondarySale.setAllowedNFTAddress(
				BeMetaPlace.address,
				true
			)
			await expect(
				alice.SecondarySale.create(
					BeMetaPlace.address,
					BeMetaToken.address,
					'utr-1',
					amount,
					Date.now(),
					Date.now() + 3600
				)
			).to.be.revertedWith('Currency not allowed')
		})
		it('Should be able to put on sale', async () => {
			const amount = ethers.utils.parseEther('100')
			await deployer.SecondarySale.setAllowedNFTAddress(
				BeMetaPlace.address,
				true
			)
			await deployer.SecondarySale.setAllowedCurrency(BeMetaToken.address, true)
			await alice.BeMetaPlace.setApprovalForAll(SecondarySale.address, true)
			await alice.SecondarySale.create(
				BeMetaPlace.address,
				BeMetaToken.address,
				'utr-1',
				amount,
				Date.now(),
				Date.now() + 3600
			)
			let values = (await alice.SecondarySale.getListings(alice.address)).map(
				(elem: any) => elem.tokenId.toNumber()
			)
			expect(values).to.deep.eq([1])
			values = (await alice.SecondarySale.getListings(alice.address)).map(
				(elem: any) => elem.seller
			)
			expect(values).to.deep.eq([alice.address])
		})
		it('should be able to buy', async () => {
			const amount = ethers.utils.parseEther('100')
			await deployer.SecondarySale.setAllowedNFTAddress(
				BeMetaPlace.address,
				true
			)
			await deployer.SecondarySale.setAllowedCurrency(BeMetaToken.address, true)
			await alice.BeMetaPlace.setApprovalForAll(SecondarySale.address, true)
			await alice.SecondarySale.create(
				BeMetaPlace.address,
				BeMetaToken.address,
				'utr-1',
				amount,
				0,
				Date.now() + 3600
			)
			let values = (await alice.SecondarySale.getListings(alice.address)).map(
				(elem: any) => elem.tokenId.toNumber()
			)
			await deployer.BeMetaToken.transfer(bob.address, amount)
			await bob.BeMetaToken.approve(SecondarySale.address, amount)
			await bob.SecondarySale.buy(BeMetaPlace.address, values[0])
			let alice_values = (
				await alice.SecondarySale.getListings(alice.address)
			).map((elem: any) => elem.tokenId.toNumber())
			let bob_values = (await bob.SecondarySale.getListings(bob.address)).map(
				(elem: any) => elem.tokenId.toNumber()
			)
			expect(alice_values).to.deep.eq([])
			expect(bob_values).to.deep.eq(values)
		})
		it('should be able to put on sale and not cancel', async () => {
			const amount = ethers.utils.parseEther('100')
			await deployer.SecondarySale.setAllowedNFTAddress(
				BeMetaPlace.address,
				true
			)
			await deployer.SecondarySale.setAllowedCurrency(BeMetaToken.address, true)
			await alice.BeMetaPlace.setApprovalForAll(SecondarySale.address, true)
			await alice.SecondarySale.create(
				BeMetaPlace.address,
				BeMetaToken.address,
				'utr-1',
				amount,
				Date.now(),
				Date.now() + 3600
			)
			let values = (await alice.SecondarySale.getListings(alice.address)).map(
				(elem: any) => elem.tokenId.toNumber()
			)
			await expect(
				alice.SecondarySale.cancel(BeMetaPlace.address, values[0])
			).to.be.revertedWith('Caller is not admin')
		})
		it('should be able to put on sale and cancel as admin', async () => {
			const amount = ethers.utils.parseEther('100')
			await deployer.SecondarySale.setAllowedNFTAddress(
				BeMetaPlace.address,
				true
			)
			await deployer.SecondarySale.setAllowedCurrency(BeMetaToken.address, true)
			await alice.BeMetaPlace.setApprovalForAll(SecondarySale.address, true)
			await alice.SecondarySale.create(
				BeMetaPlace.address,
				BeMetaToken.address,
				'utr-1',
				amount,
				Date.now(),
				Date.now() + 3600
			)
			let values = (await alice.SecondarySale.getListings(alice.address)).map(
				(elem: any) => elem.tokenId.toNumber()
			)
			await deployer.SecondarySale.cancel(BeMetaPlace.address, values[0])
			values = (await alice.SecondarySale.getListings(alice.address)).map(
				(elem: any) => elem.tokenId.toNumber()
			)
			expect(values).to.deep.eq([])
		})
	})
})
