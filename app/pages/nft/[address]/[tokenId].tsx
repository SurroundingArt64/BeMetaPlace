import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import React, { useEffect, useState } from 'react'
import { likeButton, shareButton, verified } from '../../../components/assets'
import { NFTTypes } from '../../../components/NFT'

import classes from './NFTPage.module.scss'
interface IParams extends ParsedUrlQuery {
  address?: string
  tokenId?: string
}
const NFTPage: React.FC = () => {
  const router = useRouter()
  const [, setAddress] = useState<string>()
  const [, setTokenId] = useState<string>()

  useEffect(() => {
    const query = router.query as IParams
    if (query.address && query.tokenId) {
      setAddress(query.address)
      setTokenId(query.tokenId)

      setSample((sample) => {
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

  // GET FROM IPFS
  const [sample, setSample] = useState<NFTTypes>({
    owner: 'AquaRules',
    item: {
      image:
        'https://external-preview.redd.it/604HAiILnE8x0SDxXo7jxkxstd5Ki7Cd82yS2LtqBmk.png?format=pjpg&auto=webp&s=6537951c3d9451e3827db293446fdc38d01fd732',
      video:
        'https://assets.foundation.app/Za/mo/Qmdx1dJY9J4xqLLcfvJ1diZMdBLAgfvxZoF7WHuuojZamo/nft.mp4',
      title: 'Daft Punk #1',
      value: '1',
      tokenId: '1',
      currency: 'ETH',
      address: '',
      description:
        'The Antara Universe NFT Collection is a collection of Ancient Arabian warrior inspired NFTs that enable enthusiasts to be a part of something big.\nThe Arabian Camel NFTs are the first of this collection to be released. The Arabian Camels is a collection of 12,012 uniquely generated digital collectibles living on the Ethereum blockchain.\nEach Camel is programmatically generated from over 180 assets with 7 traits, such as expressions, accessories and headgear etc.\nSeveral future perks and incentives will be unlocked by our beloved community as our projects mature.',
    },
  })

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
          {sample.item.description?.split('\n').map((elem, idx) => (
            <>
              <div key={idx} className={classes.desc}>
                {elem}
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NFTPage
