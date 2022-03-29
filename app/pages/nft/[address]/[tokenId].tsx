import Link from 'next/link'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import React, { useEffect, useState } from 'react'
import { SpinnerDotted } from 'spinners-react'
import { likeButton, shareButton, verified } from '../../../components/assets'
import { NFTTypes } from '../../../components/NFT'

import classes from './NFTPage.module.scss'
interface IParams extends ParsedUrlQuery {
  address?: string
  tokenId?: string
}
const NFTPage: React.FC = () => {
  const router = useRouter()
  const [address, setAddress] = useState<string>()
  const [tokenId, setTokenId] = useState<string>()
  const [loading, setLoading] = React.useState<boolean>(true)

  useEffect(() => {
    const query = router.query as IParams
    if (query.address && query.tokenId) {
      setAddress(query.address)
      setTokenId(query.tokenId)

      setNft((sample) => {
        if (query.address && query.tokenId)
          return {
            ...sample,
            item: {
              ...sample.item,
              address: query.address,
              tokenId: query.tokenId,
            },
          }
        else {
          return sample
        }
      })
      console.log({ query })
    }
  }, [router])

  const [nft, setNft] = React.useState<NFTTypes>({
    owner: '',
    uri: '',
    item: {
      image: '',
      title: '',
      tokenId: '',
      value: '',
      currency: '',
      address: '',
    },
  })

  React.useEffect(() => {
    const run = async () => {
      const data = await (await fetch(`/api/nft/${address}/${tokenId}`)).json()
      console.log({ api: `/api/nft/${address}/${tokenId}`, data })
      setNft(data.message)
    }
    if (address && tokenId) run()
  }, [address, tokenId])

  if (nft.owner === '')
    return (
      <div className={classes.root} style={{ height: 'calc(100vh - 369px)' }}>
        <div className={classes.spinner}>
          {loading ? <SpinnerDotted color='#4262ea' /> : 'NO LISTINGS FOUND'}
        </div>
      </div>
    )

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <div className={classes.title}>
          <h1>{nft.item.title}</h1>
          <span className={classes.verified}>{verified}</span>
        </div>
        <div className={classes.social}>
          <div>{likeButton}</div>
          <div>{shareButton}</div>
        </div>
      </div>
      <div className={classes.content}>
        <div className={classes.content__nft}>
          <img className={classes.image} src={nft.item.image} />
        </div>
        <div className={classes.content__right}>
          <div className={classes.ownedBy}>Owned by {nft.owner}</div>
          <div className={classes.price}>
            <div>CURRENT PRICE</div>
            <div>
              {nft.item.value} {nft.item.currency}
            </div>
          </div>
          Part of the Arabian Camel Caravan. Unique Camel ID:
          96eRxKZdoZvpiYWQadUcBM
          <div className={classes.price}>ABOUT {nft.item.title}</div>
          {nft.item.description?.split('\n').map((elem, idx) => (
            <>
              <div key={idx} className={classes.desc}>
                {elem}
              </div>
            </>
          ))}
          {nft.uri && (
            <p className={classes.description}>
              Check out the{' '}
              <Link href={`https://gateway.pinata.cloud/ipfs/${nft.uri}` ?? ''}>
                <a target='_blank' rel='noopener noreferrer'>
                  metadata
                </a>
              </Link>
              .
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default NFTPage
