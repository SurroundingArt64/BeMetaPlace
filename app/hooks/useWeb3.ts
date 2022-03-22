import { useContext, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import AppContext from "../components/wallet/AppContext";
import { ethers } from "ethers";
import { PromiseType } from "utility-types";

export type WalletType = "metamask" | "wallet-connect" | "torus-wallet";
const getTorus = async () => {
  return (await import("@toruslabs/torus-embed")).default;
};

const isDev = true;

export const useWeb3 = () => {
  const [walletType, setWalletType] = useState<WalletType>();

  const { setLoader, connectedAddress, setConnectedAddress } =
    useContext(AppContext);

  const getProvider = async (
    throwErr: boolean = false
  ): Promise<Web3Provider> => {
    if (ContractInstance.provider !== undefined) {
      if (!connectedAddress) {
        const walletAddress = await ContractInstance.provider
          .getSigner()
          .getAddress();
        setConnectedAddress(walletAddress);
      }
      return ContractInstance.provider;
    } else return ContractInstance.provider;
  };
  let torus: PromiseType<ReturnType<typeof getTorus>>["prototype"];

  const connect = async (walletType: WalletType) => {
    setWalletType(walletType);
    if (walletType == "metamask") {
      const ethereum = (window as any)?.ethereum;
      if (ethereum) {
        await ethereum.request({
          method: "eth_requestAccounts",
        });
        ContractInstance.provider = new ethers.providers.Web3Provider(ethereum);
        setWalletType(walletType);

        setLoader(false);
        return getProvider();
      }
    }
    if (walletType === "torus-wallet") {
      const Torus = await getTorus();

      torus = new Torus({});

      await torus.init(
        isDev
          ? {
              enableLogging: true,
              network: {
                host: "https://mumbai.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
                chainId: 80001,
              },
              useLocalStorage: true,
            }
          : {
              enableLogging: false,
              network: {
                host: "https://polygon-rpc.com/",
                chainId: 137,
              },
              useLocalStorage: false,
            }
      );

      await torus.login({
        verifier: "google",
      });
      if (torus.provider) {
        ContractInstance.provider = new ethers.providers.Web3Provider(
          torus.provider
        );
        setWalletType(walletType);

        localStorage?.setItem("walletType", walletType);
        setLoader(false);

        return getProvider();
      }
    }
  };
  return { connect, walletType, getProvider, connectedAddress };
};

class ContractInstance {
  private static _provider: Web3Provider;

  public static get provider(): Web3Provider {
    return ContractInstance._provider;
  }

  public static set provider(provider: Web3Provider) {
    ContractInstance._provider = provider;
  }
}
