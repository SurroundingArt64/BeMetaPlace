import type { NextPage } from 'next'
import Head from 'next/head'
import React from 'react'
import NFT, { NFTTypes } from '../components/NFT'
import classes from './index.module.scss'

const Home: NextPage = () => {
  const [nfts, setNfts] = React.useState<NFTTypes[]>([])

  React.useEffect(() => {
    const run = async () => {
      const data = await (await fetch('/api/nft')).json()
      setNfts(data.message)
    }
    run()
  }, [])

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
          {nfts.length > 0 ? (
            nfts.map((nft, i) =>
              nft.item ? <NFT {...{ nft }} key={i} /> : <></>
            )
          ) : (
            <div className={classes.loading}>NO NFTS FOUND!</div>
          )}
        </div>
      </div>
    </>
  )
}

export default Home
