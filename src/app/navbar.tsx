"use client"
import Link from "next/link"
import { Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ConnectButton} from '@mysten/dapp-kit';

const navigation = [
    { name: 'Home', href: '/' },
    // { name: 'Data Analysis', href: '/analysis' },
    { name: 'Page1',href: '/page1'},
    // { name: 'Pump', href: '/pump' },
    { name: 'Page2',href:'/page2'}
]

export function Navbar() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
        <div className="flex flex-1 items-center gap-2">
            <Link href="/" className="flex items-center gap-2 font-semibold">
            <Home className="h-5 w-5" />
            <span>SUI SDK test demo</span>
            </Link>
        </div>

       {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-8 ml-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-lg transition-colors hover:text-blue-400 `}
              >
                {item.name}
              </Link>
            ))}
        </div>

        <div className="flex items-center gap-4">
            <Select defaultValue="testnet">
            <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Select network" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="testnet">testnet</SelectItem>
                <SelectItem value="mainnet">mainnet</SelectItem>
            </SelectContent>
            </Select>
            <ConnectButton>
                <Button variant="outline">Connect Wallet</Button>
            </ConnectButton>

        </div>
    </header>
  )
}

