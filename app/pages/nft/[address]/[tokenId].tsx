import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import React, { useEffect, useState } from "react";
import { NFTTypes } from "../../../components/NFT";

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
        "The Antara Universe NFT Collection is a collection of Ancient Arabian warrior inspired NFTs that enable enthusiasts to be a part of something big.\nThe Arabian Camel NFTs are the first of this collection to be released. The Arabian Camels is a collection of 12,012 uniquely generated digital collectibles living on the Ethereum blockchain.\nEach Camel is programmatically generated from over 180 assets with 7 traits, such as expressions, accessories and headgear etc.\nSeveral future perks and incentives will be unlocked by our beloved community as our projects mature.",
    },
  });

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <div className={classes.title}>
          <h1>{sample.item.title}</h1>
          <span className={classes.verified}>{verified}</span>
        </div>
        <div className={classes.social}>
          <div>{likeButton}</div>
          <div>{shareButton}</div>
        </div>
      </div>
      <div className={classes.content}>
        <div className={classes.content__nft}>
          <img className={classes.image} src={sample.item.image} />
        </div>
        <div className={classes.content__right}>
          <div className={classes.ownedBy}>Owned by {sample.owner}</div>
          <div className={classes.price}>
            <div>CURRENT PRICE</div>
            <div>
              {sample.item.value} {sample.item.currency}
            </div>
          </div>
          Part of the Arabian Camel Caravan. Unique Camel ID:
          96eRxKZdoZvpiYWQadUcBM
          <div className={classes.price}>ABOUT {sample.item.title}</div>
          {sample.item.description?.split("\n").map((elem) => (
            <>
              <div className={classes.desc}>{elem}</div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NFTPage;

const likeButton = (
  <svg
    width="35"
    height="32"
    viewBox="0 0 35 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.0664 5.86248L15.5368 4.29022C11.9464 0.599568 5.36296 1.87316 2.98643 6.51315C1.8707 8.69554 1.61897 11.8465 3.6563 15.8678C5.61896 19.7398 9.70215 24.3776 17.0664 29.4293C24.4306 24.3776 28.5117 19.7398 30.4765 15.8678C32.5138 11.8443 32.2642 8.69554 31.1463 6.51315C28.7698 1.87316 22.1864 0.597435 18.596 4.28809L17.0664 5.86248ZM17.0664 32C-15.6439 10.3851 6.99495 -6.48521 16.6909 2.4385C16.8189 2.55583 16.9448 2.67743 17.0664 2.80329C17.1868 2.67754 17.312 2.55656 17.4419 2.44063C27.1357 -6.48948 49.7767 10.383 17.0664 32Z"
      fill="black"
    />
  </svg>
);

const shareButton = (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M27.0003 2.00038C26.2046 2.00038 25.4416 2.31645 24.879 2.87906C24.3164 3.44167 24.0003 4.20473 24.0003 5.00038C24.0003 5.79603 24.3164 6.5591 24.879 7.1217C25.4416 7.68431 26.2046 8.00038 27.0003 8.00038C27.7959 8.00038 28.559 7.68431 29.1216 7.1217C29.6842 6.5591 30.0003 5.79603 30.0003 5.00038C30.0003 4.20473 29.6842 3.44167 29.1216 2.87906C28.559 2.31645 27.7959 2.00038 27.0003 2.00038ZM22.0003 5.00038C22.0001 3.82725 22.4125 2.69142 23.1652 1.79161C23.9179 0.891797 24.9631 0.285311 26.1178 0.0782581C27.2725 -0.128795 28.4633 0.0767707 29.4817 0.658989C30.5002 1.24121 31.2815 2.163 31.689 3.2631C32.0965 4.3632 32.1041 5.57154 31.7107 6.67673C31.3172 7.78191 30.5477 8.71356 29.5367 9.30867C28.5257 9.90378 27.3377 10.1245 26.1804 9.93209C25.0231 9.73972 23.9704 9.14656 23.2063 8.25638L9.77029 14.4964C10.0792 15.4753 10.0792 16.5255 9.77029 17.5044L23.2063 23.7444C24.014 22.805 25.1416 22.199 26.3707 22.0437C27.5997 21.8884 28.8427 22.1949 29.8586 22.9038C30.8746 23.6127 31.5912 24.6735 31.8696 25.8806C32.148 27.0878 31.9684 28.3553 31.3655 29.4375C30.7626 30.5198 29.7794 31.3397 28.6064 31.7383C27.4335 32.1369 26.1543 32.0859 25.0168 31.5952C23.8794 31.1045 22.9645 30.2089 22.4497 29.0821C21.9349 27.9553 21.8567 26.6775 22.2303 25.4964L8.79429 19.2564C8.12916 20.0315 7.24259 20.5844 6.25384 20.8406C5.2651 21.0967 4.22162 21.044 3.26376 20.6893C2.30591 20.3347 1.47964 19.6952 0.896101 18.857C0.312564 18.0187 -0.000244141 17.0218 -0.000244141 16.0004C-0.000244141 14.979 0.312564 13.9821 0.896101 13.1438C1.47964 12.3055 2.30591 11.6661 3.26376 11.3114C4.22162 10.9568 5.2651 10.904 6.25384 11.1602C7.24259 11.4164 8.12916 11.9692 8.79429 12.7444L22.2303 6.50438C22.0773 6.01772 21.9998 5.51052 22.0003 5.00038ZM5.00029 13.0004C4.20464 13.0004 3.44158 13.3165 2.87897 13.8791C2.31636 14.4417 2.00029 15.2047 2.00029 16.0004C2.00029 16.796 2.31636 17.5591 2.87897 18.1217C3.44158 18.6843 4.20464 19.0004 5.00029 19.0004C5.79594 19.0004 6.559 18.6843 7.12161 18.1217C7.68422 17.5591 8.00029 16.796 8.00029 16.0004C8.00029 15.2047 7.68422 14.4417 7.12161 13.8791C6.559 13.3165 5.79594 13.0004 5.00029 13.0004ZM27.0003 24.0004C26.2046 24.0004 25.4416 24.3165 24.879 24.8791C24.3164 25.4417 24.0003 26.2047 24.0003 27.0004C24.0003 27.796 24.3164 28.5591 24.879 29.1217C25.4416 29.6843 26.2046 30.0004 27.0003 30.0004C27.7959 30.0004 28.559 29.6843 29.1216 29.1217C29.6842 28.5591 30.0003 27.796 30.0003 27.0004C30.0003 26.2047 29.6842 25.4417 29.1216 24.8791C28.559 24.3165 27.7959 24.0004 27.0003 24.0004Z"
      fill="black"
    />
  </svg>
);

const verified = (
  <svg
    width="45"
    height="43"
    viewBox="0 0 45 43"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M45 21.5L40.0091 15.7871L40.7045 8.23143L33.3205 6.55238L29.4545 0L22.5 2.98952L15.5455 0L11.6795 6.5319L4.29545 8.19048L4.99091 15.7667L0 21.5L4.99091 27.2129L4.29545 34.789L11.6795 36.4681L15.5455 43L22.5 39.99L29.4545 42.9795L33.3205 36.4476L40.7045 34.7686L40.0091 27.2129L45 21.5ZM17.1409 29.711L12.2727 24.7967C12.0831 24.6072 11.9327 24.3822 11.83 24.1345C11.7274 23.8868 11.6745 23.6213 11.6745 23.3531C11.6745 23.0849 11.7274 22.8194 11.83 22.5717C11.9327 22.324 12.0831 22.099 12.2727 21.9095L12.4159 21.7662C13.2136 20.9676 14.5227 20.9676 15.3205 21.7662L18.6136 25.0833L29.1477 14.5176C29.9455 13.719 31.2545 13.719 32.0523 14.5176L32.1955 14.661C32.9932 15.4595 32.9932 16.7495 32.1955 17.5481L20.0864 29.711C19.2477 30.5095 17.9591 30.5095 17.1409 29.711Z"
      fill="#4262EA"
    />
  </svg>
);
