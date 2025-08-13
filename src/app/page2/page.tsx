"use client"

import { createNetworkConfig, SuiClientProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@mysten/dapp-kit/dist/index.css';

import { Navbar } from "@/app/navbar";
import { ConnectWallet } from "@/components/connectWallet"
import SuiComponent from "@/components/suiKiosk"

// eslint-disable-next-line @next/next/no-async-client-component
export default function Home() {  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="border-b py-4">
          <SuiComponent/>
        </div>
      </main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">Design by, Fishdoge Lab 2025</footer>
    </div>
  );
}