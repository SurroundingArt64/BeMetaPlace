import React, { Dispatch, SetStateAction } from "react";

const AppContext = React.createContext<{
  connectedAddress?: string;
  loader: boolean;
  setConnectedAddress: Dispatch<SetStateAction<string | undefined>>;
  setLoader: Dispatch<SetStateAction<boolean>>;
}>({
  loader: false,
  setConnectedAddress: () => {},
  setLoader: () => {},
});

export default AppContext;
