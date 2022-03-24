import "../styles/globals.scss";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { useState } from "react";
import AppContext from "../components/wallet/AppContext";

function MyApp({ Component, pageProps }: AppProps) {
  const [connectedAddress, setConnectedAddress] = useState<string>();
  const [loader, setLoader] = useState<boolean>(true);
  const [wallet, showWallet] = useState<boolean>(false);

  const setLoaderWithTimeOut = ((value: boolean) => {
    setTimeout(() => setLoader(value), 500);
  }) as typeof setLoader;

  return (
    <AppContext.Provider
      value={{
        connectedAddress: connectedAddress,
        setConnectedAddress,
        loader,
        setLoader: setLoaderWithTimeOut,
        wallet,
        showWallet,
      }}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppContext.Provider>
  );
}

export default MyApp;
