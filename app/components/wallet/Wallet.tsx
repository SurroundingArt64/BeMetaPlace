import { useEffect } from "react";
import { useWeb3 } from "../../hooks/useWeb3";
import { metamaskSvg, torusSvg } from "./images";

import styles from "./wallet.module.scss";

export default function Wallet({ outerClick }: { outerClick: Function }) {
  const { connect } = useWeb3();

  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
    };
  });

  return (
    <>
      <div className={styles.wallet}>
        <div className={styles.inner}>
          <div
            onClick={async () => {
              await connect("metamask");
              outerClick();
            }}
            className={styles.provider}
          >
            <div className={styles.providerIcon}>
              {/* eslint-disable-next-line */}
              <img src={metamaskSvg} alt="Metamask" />
            </div>
            <div>Metamask</div>
          </div>
          <div
            className={styles.provider}
            onClick={async () => {
              await connect("torus-wallet");
              outerClick();
            }}
          >
            <div className={styles.providerIcon}>
              {/* eslint-disable-next-line */}
              <img src={torusSvg} alt="Torus" />
            </div>
            Torus Wallet
          </div>
        </div>
      </div>
    </>
  );
}
