import type { NextPage } from 'next'
import Head from 'next/head'
import React from 'react'
import { SpinnerDotted } from 'spinners-react'
import NFT, { NFTTypes } from '../components/NFT'
import classes from './index.module.scss'

const Home: NextPage = () => {
    const [nfts, setNfts] = React.useState<NFTTypes[]>([])
    const [loading, setLoading] = React.useState<boolean>(true)

    React.useEffect(() => {
        const run = async () => {
            const data = await (await fetch('/api/nft')).json()
            setNfts(data.message)
            setLoading(false)
        }
        run()
    }, [])

    if (!nfts.length) {
        return (
            <div className={classes.root}>
                <h1
                    className={classes.loading}
                    style={{ height: 'calc(100vh - 369px)' }}
                >
                    RECENTLY LISTED
                </h1>
                <div className={classes.spinner}>
                    {loading ? (
                        <SpinnerDotted color="#4262ea" />
                    ) : (
                        'NO LISTINGS FOUND'
                    )}
                </div>
            </div>
        )
    }

    return (
        <>
            <Head>
                <title>NFT Marketplace</title>
                <meta
                    name="description"
                    content="bemetaplace, NFT Marketplace"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={classes.root}>
                <h1>RECENTLY LISTED</h1>
                <div className={classes.grid}>
                    {nfts.map((nft, i) =>
                        nft.item ? <NFT {...{ nft }} key={i} /> : <></>
                    )}
                </div>
            </div>
        </>
    )
}

export default Home
