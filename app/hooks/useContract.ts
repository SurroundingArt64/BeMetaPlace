import { Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers";

const networks = {
  80001: { NFTSale: "" },
  137: { NFTSale: "" },
};
export const getContractAddress = (
  network: keyof typeof networks,
  contract: keyof typeof networks[keyof typeof networks]
) => {
  return networks[network][contract];
};

export const getContractABI = async (
  contract: keyof typeof networks[keyof typeof networks]
) => {
  return (await import(`./${contract}.json`)) as any;
};

export const getContract = async (
  contract: keyof typeof networks[keyof typeof networks]
) => {
  if (ContractInstance.provider && ContractInstance.chainId) {
    return new ethers.Contract(
      getContractAddress(ContractInstance.chainId, contract),
      await getContractABI(contract),
      ContractInstance.provider
    );
  }
};

export class ContractInstance {
  private static _provider: Web3Provider;

  public static get provider(): Web3Provider {
    return ContractInstance._provider;
  }

  public static set provider(provider: Web3Provider) {
    ContractInstance._provider = provider;
  }

  private static _chainId: keyof typeof networks;

  public static get chainId(): keyof typeof networks {
    return ContractInstance._chainId;
  }

  public static set chainId(value: keyof typeof networks) {
    ContractInstance._chainId = value;
  }
}
