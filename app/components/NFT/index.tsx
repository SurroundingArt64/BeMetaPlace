import React from 'react'
import classes from './NFT.module.scss'

export interface NFTTypes {
  owner: string
  item: {
    image: string
    video?: string
    title: string
    value: string
    currency: string
    address: string
    description?: string
  }
}

const NFT: React.FC<{ nft: NFTTypes }> = ({ nft }) => {
  return (
    <div className={classes.root}>
      <div className={classes.container}>
        {nft.item.video ? (
          <video autoPlay muted loop className={classes.image}>
            <source src={nft.item.video} type='video/mp4' />
          </video>
        ) : (
          <img className={classes.image} src={nft.item.image} />
        )}
        <div className={classes.info}>
          <h1 className={classes.title}>{nft.item.title}</h1>
          <h2 className={classes.owner}>Owned by {nft.owner}</h2>
          <div className={classes.currency}>
            <h3>Current Price</h3>
            <div className={classes.price}>
              <h3 className={classes.value}>{nft.item.value}</h3>
              <h3 className={classes.currency}>{nft.item.currency}</h3>
            </div>
          </div>
          <p className={classes.description}>
            {nft.item.description ?? 'No description given.'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default NFT
