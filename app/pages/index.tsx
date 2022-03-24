import type { NextPage } from "next";
import Head from "next/head";
import NFT, { NFTTypes } from "../components/NFT";
import classes from "./index.module.scss";

const Home: NextPage = () => {
  const nfts: NFTTypes[] = [
    {
      owner: "AquaRules",
      item: {
        image:
          "https://external-preview.redd.it/604HAiILnE8x0SDxXo7jxkxstd5Ki7Cd82yS2LtqBmk.png?format=pjpg&auto=webp&s=6537951c3d9451e3827db293446fdc38d01fd732",
        video:
          "https://assets.foundation.app/Za/mo/Qmdx1dJY9J4xqLLcfvJ1diZMdBLAgfvxZoF7WHuuojZamo/nft.mp4",
        title: "Daft Punk #1",
        value: "1",
        currency: "ETH",
        address: "0x0000000000000000000000000000000000000000",
        description:
          "A tribute to the Parisian duo responsible for some of the most popular dance and pop songs.",
      },
    },
    {
      owner: "AquaRules",
      item: {
        image: "https://i.redd.it/0move82tzrm71.gif",
        title: "Royal Doge #69",
        value: "4.20",
        currency: "ETH",
        address: "0x0000000000000000000000000000000000000001",
      },
    },
    {
      owner: "AquaRules",
      item: {
        image:
          "https://i.pinimg.com/originals/ab/92/90/ab9290e4f21fbd1ffc909b014875ea98.gif",
        title: "Trip #420",
        value: "2",
        currency: "ETH",
        address: "0x0000000000000000000000000000000000000002",
        description:
          "A tribute to the Parisian duo responsible for some of the most popular dance and pop songs.A tribute to the Parisian duo responsible for some of the most popular dance and pop songs.",
      },
    },
    {
      owner: "AquaRules",
      item: {
        image:
          "https://static.wixstatic.com/media/0a7fb4_aeaf94b15bd84cd3821fa600519597b5~mv2.gif/v1/fit/w_400%2Ch_400%2Cal_c%2Cq_80/file.gif",
        title: "Taco #3",
        value: "5",
        currency: "ETH",
        address: "0x0000000000000000000000000000000000000003",
      },
    },
  ];
  return (
    <>
      <Head>
        <title>NFT Marketplace</title>
        <meta name="description" content="bemetaplace, NFT Marketplace" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={classes.root}>
        <h1>Today's Trending</h1>
        <div className={classes.grid}>
          {nfts.map((nft, i) => (
            <NFT {...{ nft }} key={i} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
