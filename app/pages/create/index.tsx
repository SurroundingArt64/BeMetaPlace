import React from 'react'
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
import { useForm } from '@mantine/form'
import NFT, { NFTTypes } from '../../components/NFT'

const Create = () => {
  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      wallet: '0x0000000000000000000000000000000000000000',
      image: '',
      video: '',
      value: '',
      currency: '',
      termsOfService: false,
    },
  })

  const [preview, setPreview] = React.useState<NFTTypes>({
    owner: '',
    item: {
      image: '',
      title: '',
      value: '',
      currency: '',
      address: '',
    },
  })

  return (
    <div className={classes.root}>
      <h1>Create Your NFT</h1>
      <div className={classes.forms}>
        <div className={classes.preview}>
          <NFT nft={preview} disabled />
        </div>
        <Box sx={{ maxWidth: 1000, minWidth: 400 }} mx='auto'>
          <form
            onSubmit={form.onSubmit((values) => {
              console.log(values)
            })}
            onChange={() => {
              setPreview({
                owner: form.getInputProps('wallet').value,
                item: {
                  image: form.getInputProps('image').value,
                  video: form.getInputProps('video').value,
                  title: form.getInputProps('title').value,
                  value: form.getInputProps('value').value,
                  currency: form.getInputProps('currency').value,
                  address: form.getInputProps('wallet').value,
                  description: form.getInputProps('description').value,
                },
              })
            }}
          >
            <TextInput
              required
              label='Title'
              placeholder='Funky Title here!'
              {...form.getInputProps('title')}
            />
            <Textarea
              label='Description'
              placeholder='Tell us about this piece!'
              {...form.getInputProps('description')}
            />
            <TextInput
              required
              disabled
              label='Wallet Address'
              placeholder='0x0000000000000000000000000000000000000000'
              {...form.getInputProps('wallet')}
            />
            <TextInput
              required
              label='Image link'
              placeholder='https://example.com/image.png'
              {...form.getInputProps('image')}
            />
            <TextInput
              label='Video link'
              placeholder='https://example.com/video.mp4'
              {...form.getInputProps('video')}
            />
            <NumberInput
              required
              label='Value'
              placeholder='0'
              precision={3}
              min={0}
              {...form.getInputProps('value')}
            />
            <Select
              required
              label='Currency'
              defaultValue={'ETH'}
              data={['ETH', 'MATIC', 'BSC']}
              {...form.getInputProps('currency')}
            />
            <Group position='right' mt='lg'>
              <Button type='submit'>Submit and Mint!</Button>
            </Group>
          </form>
        </Box>
      </div>
    </div>
  )
}

export default Create
