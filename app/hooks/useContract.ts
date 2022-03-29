import { Web3Provider } from '@ethersproject/providers'
import { ethers } from 'ethers'

const networks = {
    80001: {
        NFT: '0xe16Bf37E673757452319BcEa11C7c5702CBA6783',
        NFTSale: '0x2e14ec4A7929F3A5C8beB40F991c4FC4fAED75Aa',
        BMP: '0x93cd650E4e9B187c7332D6E3B455156EC3442fEA',
    },
    137: { NFT: '', NFTSale: '', BMP: '' },
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
