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

const Navbar = (props: TextInputProps) => {
  const theme = useMantineTheme()
  const [opened, toggleOpened] = useBooleanToggle(false)
  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div className={classes.logo}>
          be<span>meta</span>place
        </div>
        <TextInput
          icon={<Search size={18} />}
          radius='xl'
          size='sm'
          rightSection={
            <ActionIcon size={24} radius='xl' color='yellow' variant='filled'>
              {theme.dir === 'ltr' ? (
                <ArrowRight size={12} />
              ) : (
                <ArrowLeft size={12} />
              )}
            </ActionIcon>
          }
          placeholder='Search...'
          rightSectionWidth={38}
          className={classes.search}
          {...props}
        />
        <ul>
          <li>Marketplace</li>
          <li>Wallet</li>
          <li>Contact</li>
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
