import React, { FormEvent, useEffect } from 'react'
import classes from './Create.module.scss'

import {
    TextInput,
    Button,
    Group,
    Box,
    Textarea,
    NumberInput,
    Select,
} from '@mantine/core'
import NFT, { NFTTypes } from '../../components/NFT'
import { useWeb3 } from '../../hooks/useWeb3'
import { getContract, getContractAddress } from '../../hooks/useContract'
import { useNotifications } from '@mantine/notifications'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'

const Create = () => {
    const currencies = [
        { name: 'BMP', value: getContractAddress(80001, 'BMP') },
    ]
    const { connectedAddress, showWallet, chainId } = useWeb3()
    const router = useRouter()
    const notifications = useNotifications()

    const [preview, setPreview] = React.useState<NFTTypes>({
        owner: '',
        uri: '',
        item: {
            chainId: chainId.toString(),
            image: '',
            title: '',
            tokenId: '',
            value: '',
            currency: '',
            address: '',
        },
    })

    useEffect(() => {
        if (connectedAddress) {
            const run = async () => {
                const NFTAddress = getContractAddress(chainId, 'NFT')
                setPreview((p) => ({
                    ...p,
                    owner: connectedAddress,
                    item: {
                        ...p.item,
                        address: NFTAddress,
                    },
                }))
                ;(window as any).PrimarySale = await getContract('NFTSale')
            }
            run()
        } else {
            showWallet(true)
        }
    }, [connectedAddress, chainId])

    const handleUpdate = (
        _key: keyof typeof preview['item'],
        { target: { value } }: { target: { value?: any } }
    ) => {
        setPreview((p) => ({
            ...p,
            item: {
                ...p.item,
                [_key]: value,
                tokenId: (
                    Math.floor(Math.random() * (100_000_000 - 0 + 1)) + 0
                ).toString(),
            },
        }))
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        console.log(preview)

        const res = await fetch('/api/pin', {
            method: 'POST',
            body: JSON.stringify({
                name: preview.item.title,
                image: preview.item.image,
                description: preview.item.description ?? '',
                ...(preview.item.video
                    ? { animation_url: preview.item.video }
                    : {}),
            }),
        })
        const data: { uri: string; success: Boolean } = await res.json()
        if (data.success) {
            const PrimarySale = await getContract('NFTSale')

            if (PrimarySale) {
                const price = ethers.utils
                    .parseEther(preview.item.value.toString() ?? '1000')
                    .toString()
                const gas = await PrimarySale.estimateGas.create(
                    'ipfs://' + data.uri,
                    currencies[0].value,
                    3600 * 30,
                    price
                )
                const tx = await PrimarySale.create(
                    'ipfs://' + data.uri,
                    currencies[0].value,
                    3600 * 30,
                    price,
                    {
                        gasLimit: gas.toNumber() + 100_000,
                    }
                )
                await tx.wait()
            }
        }
        const NFT = await getContract('NFT')
        if (NFT) {
            const tokenId = (await NFT.totalSupply()).toString()
            const sdata: NFTTypes = {
                owner: connectedAddress as string,
                uri: 'ipfs://' + data.uri,
                item: {
                    chainId: chainId.toString(),
                    image: preview.item.image,
                    title: preview.item.title,
                    tokenId: tokenId,
                    value: preview.item.value,
                    currency: currencies[0].name,
                    address: getContractAddress(chainId, 'NFT'),
                },
            }
            const resp = await fetch('/api/nft', {
                method: 'POST',
                body: JSON.stringify(sdata),
            })
            const rdata: { message: NFTTypes; success: Boolean } =
                await resp.json()
            if (true) {
                console.log(data)
            }
            if (data.success) {
                router.push(
                    '/nft/[address]/[tokenId]',
                    `/nft/${preview.item.address}/${tokenId}`
                )
            } else {
                notifications.showNotification({
                    title: 'Error',
                    message: rdata.message,
                    color: 'red',
                })
            }
        }
    }

    return (
        <div className={classes.root}>
            <h1>Create Your NFT</h1>
            <div className={classes.forms}>
                <div className={classes.preview}>
                    <NFT nft={preview} disabled />
                </div>
                <Box sx={{ maxWidth: 1000, minWidth: 400 }} mx="auto">
                    <form onSubmit={handleSubmit}>
                        <TextInput
                            required
                            label="Title"
                            onChange={(e) => {
                                handleUpdate('title', e)
                            }}
                            value={preview.item.title}
                            placeholder="Funky Title here!"
                        />
                        <Textarea
                            label="Description"
                            placeholder="Tell us about this piece!"
                            onChange={(e) => {
                                handleUpdate('description', e)
                            }}
                            value={preview.item.description}
                        />
                        <TextInput
                            required
                            disabled
                            label="Wallet Address"
                            value={preview.owner}
                        />
                        <TextInput
                            required
                            label="Image link"
                            placeholder="https://example.com/image.png"
                            onChange={(e) => {
                                handleUpdate('image', e)
                            }}
                            value={preview.item.image}
                        />
                        <TextInput
                            label="Video link"
                            placeholder="https://example.com/video.mp4"
                            onChange={(e) => {
                                handleUpdate('video', e)
                            }}
                            value={preview.item.video}
                        />
                        <NumberInput
                            required
                            label="Value"
                            placeholder="0"
                            precision={3}
                            min={0}
                            onChange={(e) => {
                                handleUpdate('value', { target: { value: e } })
                            }}
                            value={preview.item.value as any}
                        />
                        <Select
                            required
                            label="Currency"
                            defaultValue={currencies[0].name}
                            data={currencies.map((curr) => curr.name)}
                            onChange={(e) => {
                                handleUpdate('currency', {
                                    target: { value: e },
                                })
                            }}
                            value={preview.item.currency}
                        />
                        <Group position="right" mt="lg">
                            <Button type="submit" uppercase>
                                Submit and Mint!
                            </Button>
                        </Group>
                    </form>
                </Box>
            </div>
        </div>
    )
}

export default Create
