import { Button, Group, Text } from '@mantine/core'
import { useNotifications } from '@mantine/notifications'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import React, { useEffect, useState } from 'react'
import { SpinnerDotted } from 'spinners-react'
import { likeButton, shareButton, verified } from '../../../components/assets'
import { NFTTypes } from '../../../components/NFT'
import TableNFTSales, {
  TableNFTSalesProps,
} from '../../../components/TableNFTSales'
import { useWeb3 } from '../../../hooks/useWeb3'
import styles from './NFTPage.module.scss'

interface IParams extends ParsedUrlQuery {
  address?: string
  tokenId?: string
}

const NFTPage: React.FC = () => {
  const router = useRouter()
  const [address, setAddress] = useState<string>()
  const [tokenId, setTokenId] = useState<string>()
  const { connectedAddress, showWallet } = useWeb3()
  const [data, setData] = useState<TableNFTSalesProps['data']>()
  const [loading, setLoading] = useState<boolean>(true)
  const notifications = useNotifications()

  useEffect(() => {
    const query = router.query as IParams
    if (query.address && query.tokenId) {
      setAddress(query.address)
      setTokenId(query.tokenId)
      setNft((sample) => {
        if (query.address && query.tokenId) {
          return {
            ...sample,
            item: {
              ...sample.item,
              address: query.address,
              tokenId: query.tokenId,
            },
          }
        } else {
          return sample
        }
      })
      console.log({ query })
    }
  }, [router])

  const [nft, setNft] = React.useState<NFTTypes>({
    owner: '',
    uri: '',
    sale: {
      enabled: false,
      price: '',
    },
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
      let data = await (await fetch(`/api/nft/${address}/${tokenId}`)).json()
      console.log({ api: `/api/nft/${address}/${tokenId}`, data })
      setNft(data.message)

      data = await (await fetch(`/api/nft/sales/${address}/${tokenId}`)).json()
      console.log({ api: `/api/nft/sales/${address}/${tokenId}`, data })
      setData(data.message)
      setLoading(false)
    }
    if (address && tokenId) run()
  }, [address, tokenId])

  const handleBuy = React.useCallback(async () => {
    try {
      if (!nft.sale) throw new Error('COULD NOT LIST')
      if (!connectedAddress) throw new Error('NOT CONNECTED TO WALLET')
      throw new Error('API NOT IMPLEMENTED')

      // const owner = nft.owner
      // const price = nft.sale.price
      // const address = nft.item.address
      // const { message } = await (await fetch(`/api/nft/buy`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     owner,
      //     address,
      //     tokenId,
      //     price,
      //   }),
      // })).json()
      // if(!message.status) throw new Error(message.message)
      // else {
      //   notifications.showNotification({
      //     title: 'Successfully bought',
      //     message: "NFT was successfully purchased",
      //     color: 'green',
      //   })
      // }
    } catch (err: any) {
      notifications.showNotification({
        title: 'Error',
        message: err,
        color: 'red',
      })
    }
  }, [])

  const handleList = React.useCallback(async () => {
    try {
      if (!nft.sale) throw new Error('COULD NOT LIST')
      if (!connectedAddress) throw new Error('NOT CONNECTED TO WALLET')
      throw new Error('API NOT IMPLEMENTED')

      // const owner = nft.owner
      // const price = nft.sale.price
      // const address = nft.item.address
      // const { message } = await (await fetch(`/api/nft/list`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     owner,
      //     address,
      //     tokenId,
      //     price,
      //   }),
      // })).json()
      // if(!message.status) throw new Error(message.message)
      // else {
      //   notifications.showNotification({
      //     title: 'Successfully Listed',
      //     message: "NFT was successfully listed on Sale",
      //     color: 'green',
      //   })
      // }
    } catch (err: any) {
      notifications.showNotification({
        title: 'Error',
        message: err,
        color: 'red',
      })
    }
  }, [])

  if (nft && !nft.item)
    return (
      <div className={styles.root} style={{ height: 'calc(100vh - 200px)' }}>
        <div className={styles.spinner}>
          {nft.item !== undefined ? (
            <SpinnerDotted color='#4262ea' />
          ) : (
            'NO LISTINGS FOUND'
          )}
        </div>
      </div>
    )

  return (
    <div className={styles.root}>
      {loading ? (
        <div className={styles.spinner} style={{ height: '69vh' }}>
          <SpinnerDotted color='#4262ea' />
        </div>
      ) : (
        <>
          <div className={styles.header}>
            <div className={styles.title}>
              <h1>{nft.item.title}</h1>
              <span className={styles.verified}>{verified}</span>
            </div>
            <div className={styles.social}>
              <div>{likeButton}</div>
              <div>{shareButton}</div>
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.content__nft}>
              <img className={styles.image} src={nft.item.image} />
            </div>
            <div className={styles.content__right}>
              <div
                className={styles.ownedBy}
                style={nft.owner.length > 28 ? { fontSize: '12px' } : {}}
              >
                Owned by {nft.owner.substring(0, 42)}
              </div>
              <div className={styles.price}>
                <div>CURRENT PRICE</div>
                <div>
                  {nft.item.value} {nft.item.currency}
                </div>
              </div>
              Part of the Arabian Camel Caravan. Unique Camel ID:
              96eRxKZdoZvpiYWQadUcBM
              <div className={styles.price}>ABOUT {nft.item.title}</div>
              {nft.item.description?.split('\n').map((elem, idx) => (
                <>
                  <div key={idx} className={styles.desc}>
                    {elem}
                  </div>
                </>
              ))}
              {nft.uri && (
                <p className={styles.description}>
                  Check out the{' '}
                  <Link
                    href={`https://gateway.pinata.cloud/ipfs/${nft.uri}` ?? ''}
                  >
                    <a target='_blank' rel='noopener noreferrer'>
                      metadata
                    </a>
                  </Link>
                  .
                </p>
              )}
              <Group direction='column' sx={{ gap: '32px', padding: '32px 0' }}>
                <Group sx={{ height: '32px' }}>
                  <Text
                    size='xl'
                    weight={700}
                    sx={{
                      lineHeight: 1,
                    }}
                  >
                    Sale Options
                  </Text>
                  {!connectedAddress && (
                    <Button
                      variant='light'
                      color='red'
                      size='sm'
                      uppercase
                      radius='xl'
                      onClick={() => showWallet(true)}
                      compact
                    >
                      Wallet not connected
                    </Button>
                  )}
                  {connectedAddress && nft.owner == connectedAddress && (
                    <Button
                      variant='light'
                      color='green'
                      size='sm'
                      uppercase
                      radius='xl'
                      translate='no'
                      compact
                    >
                      You own this NFT
                    </Button>
                  )}
                </Group>
                <Group sx={{ width: '100%', gap: '16px' }}>
                  <Button
                    radius='xl'
                    style={{ flex: 1 }}
                    disabled={
                      nft.sale && connectedAddress
                        ? nft.owner == connectedAddress
                        : (connectedAddress?.length ?? 1) > 0
                    }
                    uppercase
                    onClick={handleBuy}
                  >
                    Place Buy Order
                  </Button>
                  <Button
                    radius='xl'
                    style={{ flex: 1 }}
                    disabled={
                      connectedAddress ? nft.owner != connectedAddress : true
                    }
                    color='yellow'
                    uppercase
                    onClick={handleList}
                  >
                    List For Sale
                  </Button>
                </Group>
                {data && data?.length > 0 ? (
                  <TableNFTSales {...{ data }} />
                ) : (
                  <Group
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      padding: '32px 0',
                      color: '#aaa',
                    }}
                  >
                    <Text
                      size='md'
                      weight={500}
                      sx={{ lineHeight: 1, textTransform: 'uppercase' }}
                    >
                      No Sale History Found
                    </Text>
                  </Group>
                )}
              </Group>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default NFTPage
