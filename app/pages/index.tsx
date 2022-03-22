import type { NextPage } from 'next'
import Head from 'next/head'
import NFT, { NFTTypes } from '../components/NFT'
import classes from './index.module.scss'

const Home: NextPage = () => {
  const nfts: NFTTypes[] = [
    {
      owner: 'AquaRules',
      item: {
        image:
          'https://external-preview.redd.it/604HAiILnE8x0SDxXo7jxkxstd5Ki7Cd82yS2LtqBmk.png?format=pjpg&auto=webp&s=6537951c3d9451e3827db293446fdc38d01fd732',
        video:
          'https://assets.foundation.app/Za/mo/Qmdx1dJY9J4xqLLcfvJ1diZMdBLAgfvxZoF7WHuuojZamo/nft.mp4',
        title: 'Daft Punk #1',
        value: '1',
        currency: 'ETH',
        address: '0x0000000000000000000000000000000000000000',
        description:
          'A tribute to the Parisian duo responsible for some of the most popular dance and pop songs.',
      },
    },
  ]

  return (
    <>
      <Head>
        <title>NFT Marketplace</title>
        <meta name='description' content='bemetaplace, NFT Marketplace' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className={classes.root}>
        <h1>Today's Trending</h1>
        <div className={classes.grid}>
          {nfts.map((nft) => (
            <NFT {...{ nft }} />
          ))}
        </div>
      </div>
    </>
  )
}

export default Home
