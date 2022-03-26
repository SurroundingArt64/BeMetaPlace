import { useRouter } from "next/router";
import React from "react";
import classes from "./NFT.module.scss";

export interface NFTTypes {
  owner: string;
  item: {
    image: string;
    video?: string;
    title: string;
    value: string;
    currency: string;
    address: string;
    description?: string;
    tokenId: string;
  };
}

const NFT: React.FC<{ nft: NFTTypes; disabled?: boolean }> = ({
  nft,
  disabled,
}) => {
  const { push } = useRouter();
  return (
    <div
      onClick={() => {
        if (!disabled) {
          push(`/nft/${nft.item.address}`);
        }
      }}
      className={classes.root}
    >
      <div className={classes.container}>
        {nft.item.video ? (
          <video autoPlay muted loop className={classes.image}>
            <source src={nft.item.video} type="video/mp4" />
          </video>
        ) : (
          <img className={classes.image} src={nft.item.image} />
        )}
        <div className={classes.info}>
          <h1 className={classes.title}>{nft.item.title}</h1>
          <h2 className={classes.owner}>Owned by {nft.owner}</h2>
          <div className={classes.currency}>
            <h3>Current Price</h3>
            <div className={classes.price}>
              <h3 className={classes.value}>{nft.item.value}</h3>
              <h3 className={classes.currency_value}>{nft.item.currency}</h3>
            </div>
          </div>
          <p className={classes.description}>
            {nft.item.description ? (
              nft.item.description.length > 80 ? (
                <>
                  {nft.item.description.slice(0, 80) + "... "}{" "}
                  <div className={classes.more}> READ MORE</div>{" "}
                </>
              ) : (
                nft.item.description
              )
            ) : (
              "No description given."
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NFT;
