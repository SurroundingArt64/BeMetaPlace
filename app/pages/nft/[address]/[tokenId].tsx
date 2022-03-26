import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import React, { useEffect, useState } from "react";
import NFT, { NFTTypes } from "../../../components/NFT";

import classes from "./NFTPage.module.scss";
interface IParams extends ParsedUrlQuery {
  address?: string;
  tokenId?: string;
}
const NFTPage: React.FC = () => {
  const router = useRouter();
  const [, setAddress] = useState<string>();
  const [, setTokenId] = useState<string>();

  useEffect(() => {
    const query = router.query as IParams;
    if (query.address && query.tokenId) {
      setAddress(query.address);
      setTokenId(query.tokenId);

      setSample((sample) => {
        if (query.address && query.tokenId)
          return {
            ...sample,
            item: {
              ...sample.item,
              address: query.address,
              tokenId: query.tokenId,
            },
          };
        else {
          return sample;
        }
      });
      console.log({ query });
    }
  }, [router]);
  // GET FROM IPFS
  const [sample, setSample] = useState<NFTTypes>({
    owner: "AquaRules",
    item: {
      image:
        "https://external-preview.redd.it/604HAiILnE8x0SDxXo7jxkxstd5Ki7Cd82yS2LtqBmk.png?format=pjpg&auto=webp&s=6537951c3d9451e3827db293446fdc38d01fd732",
      video:
        "https://assets.foundation.app/Za/mo/Qmdx1dJY9J4xqLLcfvJ1diZMdBLAgfvxZoF7WHuuojZamo/nft.mp4",
      title: "Daft Punk #1",
      value: "1",
      tokenId: "1",
      currency: "ETH",
      address: "",
      description:
        "A tribute to the Parisian duo responsible for some of the most popular dance and pop songs.",
    },
  });

  return (
    <div className={classes.root}>
      <h1>SuperBemta NFT</h1>
      <div className={classes.content}>
        <div className={classes.content__nft}>
          <NFT nft={sample} disabled />
        </div>
        <div className={classes.content__right}></div>
      </div>
    </div>
  );
};

export default NFTPage;
