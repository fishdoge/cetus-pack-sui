"use client"

import '@mysten/dapp-kit/dist/index.css';
import { Navbar } from "@/app/navbar";
import { ConnectWallet } from "@/components/connectWallet"
import SuiComponent from "@/components/suiComponent"


// eslint-disable-next-line @next/next/no-async-client-component
export default function Home() {

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="border-b py-4">
          <SuiComponent/>
        </div>
        {/*<ConnectWallet />*/}
      </main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">Design by, Fishdoge Lab 2025</footer>
    </div>
  );
}