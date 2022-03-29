import { useBooleanToggle } from '@mantine/hooks'
import { useRouter } from 'next/router'
import React from 'react'
import { useWeb3 } from '../hooks/useWeb3'
import Footer from './Footer'
import Navbar from './Navbar'
import Wallet from './wallet/Wallet'

const Layout: React.FC = ({ children }) => {
  const [opened, toggleOpened] = useBooleanToggle(false)
  const { showWallet, wallet, connectedAddress } = useWeb3()
  const [awaitRedirect, setAwaitRedirect] = React.useState<string>()
  const { push } = useRouter()
  React.useEffect(() => {
    if (awaitRedirect && connectedAddress) {
      push(awaitRedirect)
      setAwaitRedirect(undefined)
    }
  }, [awaitRedirect, connectedAddress])
  return (
    <>
      <Navbar
        {...{
          connectedAddress: connectedAddress as string,
          showWallet,
          setAwaitRedirect,
          toggleOpened,
          opened,
        }}
      />
      {wallet && (
        <Wallet
          outerClick={() => {
            showWallet(false)
          }}
        ></Wallet>
      )}
      <div style={{ height: '80px' }} />
      {children}
      <Footer />
    </>
  )
}

export default Layout
