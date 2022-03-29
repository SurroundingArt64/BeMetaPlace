// @ts-ignore
import { Biconomy } from '@biconomy/mexa'
import { ethers } from 'ethers'

export const getBiconomy = (provider: any, walletProvider: any) => {
    const biconomy = new Biconomy(provider, {
        walletProvider: walletProvider,
        debug: true,
        apiKey: '8y4LN3kYT.97f17e50-39c2-410f-8dac-7174d4334d19',
    })
    biconomy
        .onEvent(biconomy.READY, () => {
            console.log('ready')
        })
        .onEvent(biconomy.ERROR, (error: any, message: any) => {
            console.error(error, message)
        })

    return new ethers.providers.Web3Provider(biconomy)
}
