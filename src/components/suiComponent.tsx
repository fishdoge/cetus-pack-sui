
import { KioskClient, Network } from '@mysten/kiosk';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { liquidityInput,amount_a,amount_b,coin_type_a,coin_type_b } from '@/config/sdkConfig'
import { Button } from "@/components/ui/button"
import { ArrowRight, Coins, FuelIcon as Gas, Wallet } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCurrentWallet} from '@mysten/dapp-kit';


export default function SuiComponent() {

  const { currentWallet, connectionStatus } = useCurrentWallet();


  const rpcUrl = getFullnodeUrl("testnet");

  const client = new SuiClient({ url: rpcUrl });

  // async function getNetworkStatus() {
  //     const currentEpoch = await client.getLatestSuiSystemState();
  //     console.log(currentEpoch)
  // }

  // Now we can use it to create a kiosk Client.
  const kioskClient = new KioskClient({
    client,
    network: Network.TESTNET,
  });

  // resource https://www.youtube.com/watch?v=yNA6aeNtJR4&t=2s
  const id = `0x62e2a8d935ce4cefff18ed173d3ae7f1a45b92762388ebe4e1faead76d341763`;

  // You can perform actions, like querying the owned kiosks for an address.
  // const tempKiosk = await kioskClient.getKiosk({
  //   id,
  //   options: {
  //       withKioskFields: true, // this flag also returns the `kiosk` object in the response, which includes the base setup
  //       withListingPrices: true, // This flag enables / disables the fetching of the listing prices.
  //   }
  // });


  /*async function mintFren(address: string) {
    const { kioskOwnerCaps } = await kioskClient.getOwnedKiosks({ address });

    // Choose the first kiosk for simplicity. We could have extra logic here (e.g. let the user choose, pick a personal one, etc).
    const cap = kioskOwnerCaps[0];

    const tx = new Transaction();
    const kioskTx = new KioskTransaction({ transaction: tx, kioskClient, cap });

    // We're mixing the logic here. If the cap is undefined, we create a new kiosk.
    if (!cap) kioskTx.create();

    // Let's mint a capy here into the kiosk (either a new or an existing one).
    tx.moveCall({
      target: `${packageId}::suifrens::mint_app::mint`,
      arguments: [kioskTx.getKiosk(), kioskTx.getKioskCap()],
      typeArguments: [capyType],
    });

    // If we don't have a cap, that means we create a new kiosk for the user in this flow.
    if (!cap) kioskTx.shareAndTransferCap(address);

    kioskTx.finalize();

    // sign and execute transaction.
    await signAndExecuteTransaction({ tx: tx });
  }*/

    console.log("liquidityInput");

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-8">Sui Network Dashboard</h1>
      {connectionStatus === 'connected' ? (
				<div>
					<div>
						Accounts:
						<ul>
							{currentWallet.accounts.map((account) => (
								<li key={account.address}>- {account.address}</li>
							))}
						</ul>
					</div>
				</div>
			) : (
				<div>Connection status: {connectionStatus}</div>
			)}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Liquidity Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              Liquidity Information
            </CardTitle>
            <CardDescription>Current liquidity pool details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <div className="text-sm font-medium">Liquidity Input:</div>
              <code className="bg-muted p-2 rounded-md text-sm">{JSON.stringify(liquidityInput, null, 2)}</code>
            </div>
          </CardContent>
        </Card>

        {/* Token Amounts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Token Amounts
            </CardTitle>
            <CardDescription>Current token balances</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div>
                <div className="text-sm font-medium mb-1">Amount A:</div>
                <code className="bg-muted p-2 rounded-md text-sm block">{JSON.stringify(amount_a)}</code>
              </div>
              <div>
                <div className="text-sm font-medium mb-1">Amount B:</div>
                <code className="bg-muted p-2 rounded-md text-sm block">{JSON.stringify(amount_b)}</code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coin Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5" />
              Coin Types
            </CardTitle>
            <CardDescription>Token specifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div>
                <div className="text-sm font-medium mb-1">Coin Type A:</div>
                <code className="bg-muted p-2 rounded-md text-sm block">{JSON.stringify(coin_type_a)}</code>
              </div>
              <div>
                <div className="text-sm font-medium mb-1">Coin Type B:</div>
                <code className="bg-muted p-2 rounded-md text-sm block">{JSON.stringify(coin_type_b)}</code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Network Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gas className="h-5 w-5" />
              Network Status
            </CardTitle>

          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <div className="text-sm font-medium">Enter Address</div>
              <div className="bg-muted p-2 rounded-md">
                {/* We'll use a placeholder here since this is async data */}
                <span className="text-sm">0x....</span>
              </div>
            </div>
            <Button className="w-full">
                push
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}