import React from 'react'
import classes from './Navbar.module.scss'
import { TextInput, ActionIcon, useMantineTheme, Burger } from '@mantine/core'
import { Search, ArrowRight, ArrowLeft } from 'tabler-icons-react'
import Link from 'next/link'

interface NavbarProps {
  connectedAddress: string
  showWallet: React.Dispatch<React.SetStateAction<boolean>>
  setAwaitRedirect: React.Dispatch<React.SetStateAction<string | undefined>>
  toggleOpened: (value?: React.SetStateAction<boolean>) => void
  opened: boolean
}

const Navbar: React.FC<NavbarProps> = ({
  connectedAddress,
  showWallet,
  setAwaitRedirect,
  toggleOpened,
  opened,
}) => {
  const theme = useMantineTheme()
  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Link href='/'>
          <div className={classes.logo}>
            be<span>meta</span>place
          </div>
        </Link>
        <TextInput
          icon={<Search size={18} />}
          radius='xl'
          size='sm'
          rightSection={
            <ActionIcon size={24} radius='xl' color='yellow' variant='filled'>
              {theme.dir === 'ltr' ? (
                <ArrowRight size={12} color='black' />
              ) : (
                <ArrowLeft size={12} color='black' />
              )}
            </ActionIcon>
          }
          placeholder='Search...'
          rightSectionWidth={38}
          className={classes.search}
        />
        <ul>
          <li
            onClick={() => {
              if (!connectedAddress) {
                showWallet(true)
              }
              setAwaitRedirect('/create')
            }}
            data-type='create'
          >
            Create
          </li>

          <Link href='/'>
            <li>Marketplace</li>
          </Link>
          <li
            onClick={() => {
              if (!connectedAddress) showWallet(true)
            }}
          >
            {connectedAddress
              ? connectedAddress.slice(0, 5) +
                '...' +
                connectedAddress.slice(connectedAddress.length - 4)
              : 'Wallet'}
          </li>
        </ul>
        <Burger
          opened={opened}
          onClick={() => toggleOpened()}
          size='sm'
          color='white'
          className={classes.burger}
        />
      </div>
    </div>
  )
}

export default Navbar
