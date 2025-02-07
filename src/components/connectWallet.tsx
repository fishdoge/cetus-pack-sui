import { Button } from "@/components/ui/button"

export function ConnectWallet() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Connect your wallet to manage SUI sdk</h1>
      <p className="text-muted-foreground">Create your kiosk to manage your kiosk and purchase from other kiosks.</p>
      <Button className="mt-4">Connect Wallet</Button>
    </div>
  )
}

