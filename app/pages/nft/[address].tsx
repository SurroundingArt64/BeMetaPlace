import { useRouter } from 'next/router'
import React from 'react'

import classes from './NFTPage.module.scss'

const NFTPage = () => {
  const router = useRouter()
  const address = (router.query.address as string) ?? ''
  return (
    <div className={classes.root}>
      <h1>
        #
        {address.substring(0, 5) +
          '...' +
          address.substring(address.length - 5)}
      </h1>
    </div>
  )
}

export default NFTPage
