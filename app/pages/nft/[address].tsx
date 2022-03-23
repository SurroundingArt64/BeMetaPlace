import { useRouter } from 'next/router'
import React from 'react'

import classes from './NFTPage.module.scss'

const NFTPage = () => {
  const router = useRouter()
  const address = (router.query.address as string) ?? ''
  return (
    <div className={classes.root}>
      <h1>SuperBemta NFT</h1>
    </div>
  )
}

export default NFTPage
