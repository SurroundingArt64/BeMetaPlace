import { useRouter } from 'next/router'
import React from 'react'
import NFT from '../../components/NFT'

import classes from './NFTPage.module.scss'

const NFTPage = () => {
  const router = useRouter()
  const address = (router.query.address as string) ?? ''

  // GET FROM IPFS
  const sample = {
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
  }

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
  )
}

export default NFTPage
