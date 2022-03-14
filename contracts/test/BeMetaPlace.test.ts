import { expect } from 'chai'
import { PromiseType } from 'utility-types'
import { setupTest } from './fixture'

describe('BeMetaPlace.sol', () => {
	type FixtureType = PromiseType<ReturnType<typeof setupTest>>
	type UserType = FixtureType['deployer']

	let deployer: UserType,
		users: UserType[],
		BeMetaPlace: FixtureType['BeMetaPlace']

	beforeEach(async () => {
		;({ deployer, users, BeMetaPlace } = await setupTest())
	})

	it('correct name', async () => {
		expect(await BeMetaPlace.name()).to.equal('BeMetaPlace')
		expect(await BeMetaPlace.symbol()).to.equal('BMP')
	})
})
