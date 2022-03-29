import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import { useState } from 'react'
import AppContext from '../components/wallet/AppContext'
import { NotificationsProvider } from '@mantine/notifications'
import { MantineProvider } from '@mantine/core'
import React from 'react'

function MyApp({ Component, pageProps }: AppProps) {
    const [connectedAddress, setConnectedAddress] = useState<string>()
    const [loader, setLoader] = useState<boolean>(true)
    const [wallet, showWallet] = useState<boolean>(false)

    const setLoaderWithTimeOut = ((value: boolean) => {
        setTimeout(() => setLoader(value), 500)
    }) as typeof setLoader

    return (
        <AppContext.Provider
            value={{
                connectedAddress: connectedAddress,
                setConnectedAddress,
                loader,
                setLoader: setLoaderWithTimeOut,
                wallet,
                showWallet,
            }}
        >
            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={{
                    colorScheme: 'light',
                    fontFamily: 'Roboto, sans-serif',
                }}
            >
                <NotificationsProvider
                    position="top-center"
                    style={{ marginTop: '80px' }}
                >
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </NotificationsProvider>
            </MantineProvider>
        </AppContext.Provider>
    )
}

export default MyApp
