import React from 'react'
import classes from './Navbar.module.scss'
import {
  TextInput,
  TextInputProps,
  ActionIcon,
  useMantineTheme,
  Burger,
} from '@mantine/core'
import { Search, ArrowRight, ArrowLeft } from 'tabler-icons-react'
import { useBooleanToggle } from '@mantine/hooks'
import Link from 'next/link'

const Navbar = (props: TextInputProps) => {
  const theme = useMantineTheme()
  const [opened, toggleOpened] = useBooleanToggle(false)
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
          {...props}
        />
        <ul>
          <li data-type='create'>
            <Link href='/create'>Create</Link>
          </li>
          <li>
            <Link href='/'>Marketplace</Link>
          </li>
          <li>Wallet</li>
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
