import "../styles/globals.scss";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { useState } from "react";
import AppContext from "../components/wallet/AppContext";

function MyApp({ Component, pageProps }: AppProps) {
  const [connectedAddress, setConnectedAddress] = useState<string>();
  const [loader, setLoader] = useState<boolean>(true);
  const setLoaderWithTimeOut = ((value: boolean) => {
    setTimeout(() => setLoader(value), 500);
  }) as typeof setLoader;
  return (
    <Layout>
      <AppContext.Provider
        value={{
          connectedAddress: connectedAddress,
          setConnectedAddress,
          loader,
          setLoader: setLoaderWithTimeOut,
        }}
      >
        <Component {...pageProps} />
      </AppContext.Provider>
    </Layout>
  );
}

export default MyApp;
