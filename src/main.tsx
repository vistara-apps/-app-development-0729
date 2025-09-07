import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AppProvider } from './contexts/AppContext'
import { validateEnvironment } from './config/environment'

// Validate environment variables on startup
validateEnvironment();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={getDefaultConfig({
      appName: "Diginer",
      projectId: "9f4bd472c01ba49282b42e5e1874c2af",
      chains: [mainnet, polygon, optimism, arbitrum, base],
    })}>
      <QueryClientProvider client={new QueryClient()}>
        <RainbowKitProvider>
          <AppProvider>
            <App />
          </AppProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
)
