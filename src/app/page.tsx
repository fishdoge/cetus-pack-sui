"use client"

import { createNetworkConfig, SuiClientProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@mysten/dapp-kit/dist/index.css';

import { Navbar } from "@/app/navbar";
import { ConnectWallet } from "@/components/connectWallet"
import SuiComponent from "@/components/suiComponent"

import dynamic from 'next/dynamic';

const WalletProvider = dynamic(() => import('@mysten/dapp-kit').then(mod => mod.WalletProvider), {
	ssr: false,
});

const { networkConfig } = createNetworkConfig({
	localnet: { url: getFullnodeUrl('localnet') },
	mainnet: { url: getFullnodeUrl('mainnet') },
	devnet:{url: 'https://fullnode.devnet.sui.io:443' }
});

const queryClient = new QueryClient();

// eslint-disable-next-line @next/next/no-async-client-component
export default function Home() {

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="mainnet">
        <WalletProvider>
          <RouteWeb/>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

function RouteWeb(){
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="border-b py-4">
          {/* <SuiComponent/> */}
        </div>
        <ConnectWallet />
      </main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">Design by, Fishdoge Lab 2025</footer>
    </div>
  );
}