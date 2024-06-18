'use client'
import { ThorinGlobalStyles, lightTheme } from '@ensdomains/thorin'
import '@rainbow-me/rainbowkit/styles.css'
import { AppProps } from 'next/app'
import React from 'react'
import { ThemeProvider } from 'styled-components'
import { http, createConfig, WagmiProvider } from 'wagmi'
import { optimism, polygon, polygonMumbai, optimismSepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import {
  RainbowKitProvider,
  connectorsForWallets,
} from '@rainbow-me/rainbowkit'
import {
  coinbaseWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'

import { Layout } from '@/components/Layout'
import { useIsMounted } from '@/hooks/useIsMounted'
const client = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  const isMounted = useIsMounted()
  const connectors = connectorsForWallets(
    [
      {
        groupName: 'Recommended',
        wallets: [coinbaseWallet],
      },
      {
        groupName: 'Other Wallets',
        wallets: [metaMaskWallet, rainbowWallet, walletConnectWallet],
      },
    ],
    {
      appName: '[]yohaku',
      projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
    }
  )
  const wagmiConfig = createConfig({
    connectors,
    chains: [
      optimism,
      ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true'
        ? [polygonMumbai, optimismSepolia]
        : []),
    ],
    transports: {
      [polygon.id]: http(
        `https://polygon-mainnet.infura.io/v3/${process.env
          .NEXT_PUBLIC_INFURA_API_KEY!}`
      ),
      [optimism.id]: http(
        `https://optimism-mainnet.infura.io/v3/${process.env
          .NEXT_PUBLIC_INFURA_API_KEY!}`
      ),
      [polygonMumbai.id]: http(
        `https://polygon-mumbai.infura.io/v3/${process.env
          .NEXT_PUBLIC_INFURA_API_KEY!}`
      ),
      [optimismSepolia.id]: http(
        `https://optimism-sepolia.infura.io/v3/${process.env
          .NEXT_PUBLIC_INFURA_API_KEY!}`
      ),
    },
    ssr: true,
  })
  return (
    <ThemeProvider theme={lightTheme}>
      <ThorinGlobalStyles />
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={client}>
          <RainbowKitProvider modalSize="compact">
            <Layout>{isMounted && <Component {...pageProps} />}</Layout>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  )
}
