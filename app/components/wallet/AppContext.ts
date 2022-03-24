import React, { Dispatch, SetStateAction } from "react";

const AppContext = React.createContext<{
  connectedAddress?: string;
  loader: boolean;
  wallet: boolean;
  showWallet: Dispatch<SetStateAction<boolean>>;
  setConnectedAddress: Dispatch<SetStateAction<string | undefined>>;
  setLoader: Dispatch<SetStateAction<boolean>>;
}>({
  loader: false,
  setConnectedAddress: () => {},
  setLoader: () => {},
  wallet: false,
  showWallet: () => {},
});

export default AppContext;
