import { Web3Provider } from '@ethersproject/providers'
import { ethers } from 'ethers'

const networks = {
    80001: {
        NFT: '0x394E9697138E49077d09d7EBeB2075D4b960AB66',
        NFTSale: '0x74b3017735840d79Cd31997E45D261249B3286F2',
    },
    137: { NFT: '', NFTSale: '' },
}
export const getContractAddress = (
    network: keyof typeof networks,
    contract: keyof typeof networks[keyof typeof networks]
) => {
    const address = networks[network][contract]
    return address
}

export const getContractABI = async (
    contract: keyof typeof networks[keyof typeof networks]
) => {
    return Array.from<any>((await import(`./${contract}.json`)) as any)
}

export const getContract = async (
    contract: keyof typeof networks[keyof typeof networks]
) => {
    const abi = await getContractABI(contract)
    ;(window as any).abi = abi
    if (ContractInstance.provider && ContractInstance.chainId && abi) {
        return new ethers.Contract(
            getContractAddress(ContractInstance.chainId, contract),
            abi,
            ContractInstance.provider
        ).connect(ContractInstance.provider.getSigner(0))
    }
}

export class ContractInstance {
    private static _provider: Web3Provider

    public static get provider(): Web3Provider {
        return ContractInstance._provider
    }

    public static set provider(provider: Web3Provider) {
        ContractInstance._provider = provider
    }

    private static _chainId: keyof typeof networks

    public static get chainId(): keyof typeof networks {
        return ContractInstance._chainId
    }

    public static set chainId(value: keyof typeof networks) {
        ContractInstance._chainId = value
    }
}
