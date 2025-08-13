
import { SuiGraphQLClient } from '@mysten/sui/graphql';
import { graphql } from '@mysten/sui/graphql/schemas/latest';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { ArrowRight, Coins, FuelIcon as Gas, Wallet } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"



export default async function SuiComponent() {
  // Define a type for the coin data to prevent implicit 'any' types
  type CoinNode = {
    coinBalance: string;
    address: string;
  };
  interface QueryResult {
    data?: {
      address?: {
        address?: string | null;
        balance?: {
          totalBalance?: string | null;
        } | null;
        coins?: {
          pageInfo?: {
            hasNextPage?: boolean;
            endCursor?: string | null;
          };
          nodes?: {
            coinBalance?: string | null;
            address?: string;
          }[];
        } | null;
      } | null;
    };
  }

  const gqlClient = new SuiGraphQLClient({
    url: 'https://sui-testnet.mystenlabs.com/graphql',
  });
  const chainIdentifierQuery = graphql(`
    query {
      epoch {
        referenceGasPrice
      }
    }
  `);

  async function getChainIdentifier() {
    const result = await gqlClient.query({
      query: chainIdentifierQuery,
    });
    console.log(result)

    // Format the reference gas price with commas
    const referenceGasPrice = result.data?.epoch?.referenceGasPrice;
    return referenceGasPrice ? referenceGasPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : null;
  }

  const coinIdentifierQuery = graphql(`
    query getCoins($owner: SuiAddress!, $first: Int, $cursor: String, $type: String = "0x2::sui::SUI") {
      address(address: $owner) {
        address
        coins(first: $first, after: $cursor, type: $type) {
          nodes {
            coinBalance
            contents {
              type {
                repr
              }
            }
            address
            contents {
              data
            }
            balance(type: $type) {
              coinType {
                repr
              }
              coinObjectCount
              totalBalance
            }
          }
        }
      }
    }`
  );

  const coinIdentifierQuery2 = graphql(`
    query getCoinsWithPagination($owner: SuiAddress!, $first: Int, $cursor: String, $type: String = "0x2::sui::SUI") {
      address(address: $owner) {
        address
        balance(type: $type) {
          totalBalance
        }
        coins(first: $first, after: $cursor, type: $type) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            coinBalance
            address
          }
        }
      }
    }`
  );

  const coinIdentifierQuery3 = graphql(`
    query getCoinsWithPagination($owner: SuiAddress!, $type: String = "0x2::sui::SUI") {
      address(address: $owner) {
        address
        balance(type: $type) {
          totalBalance
        }
      }
    }`
  );

  async function getCoinIdentifier() {
    const result = await gqlClient.query({
      query: coinIdentifierQuery2,
      variables: {
        owner: "0x25e6a21d3c032479b67448c44f817217791da22d12f4539264df2c884ac4301e",
        type: "0x0588cff9a50e0eaf4cd50d337c1a36570bc1517793fd3303e1513e8ad4d2aa96::usdt::USDT",
        first: 3,
      }
    });
    console.log(result)
    return result.data?.address?.coins?.nodes;
  }

  async function getCoinIdentifier2() {
    let allCoins: CoinNode[] = [];
    let hasNextPage = true;
    let cursor: string | null = null;
    while (hasNextPage) {
      const result: QueryResult = await gqlClient.query({
        query: coinIdentifierQuery2,
        variables: {
          owner: "0x25e6a21d3c032479b67448c44f817217791da22d12f4539264df2c884ac4301e",
          type: "0x0588cff9a50e0eaf4cd50d337c1a36570bc1517793fd3303e1513e8ad4d2aa96::usdt::USDT",
          first: 50,
          cursor: cursor,
        }
      });
      if (result.data?.address?.coins?.nodes) {
        allCoins = allCoins.concat(
          (result.data?.address?.coins?.nodes ?? []).map((node) => ({
            coinBalance: node.coinBalance ?? "",
            address: node.address ?? "",
          }))
        );
        allCoins = allCoins.concat(
          ["<br>"]
        );
      }
      hasNextPage = result.data?.address?.coins?.pageInfo?.hasNextPage || false;
      cursor = result.data?.address?.coins?.pageInfo?.endCursor?.toString() || null;
    }
    return allCoins;
  }

  async function getCoinIdentifier3() {
    const result = await gqlClient.query({
      query: coinIdentifierQuery3,
      variables: {
        owner: "0x25e6a21d3c032479b67448c44f817217791da22d12f4539264df2c884ac4301e",
        type: "0x0588cff9a50e0eaf4cd50d337c1a36570bc1517793fd3303e1513e8ad4d2aa96::usdt::USDT",
        first: 50,
      }
    });
    console.log(result)

    // Format the total balance with commas
    const totalBalance = result.data?.address?.balance?.totalBalance;
    return totalBalance ? totalBalance.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : null;
  }
  ///////////

  const rpcUrl = getFullnodeUrl("testnet");

  const client = new SuiClient({ url: rpcUrl });

  async function getNetworkStatus() {
    const currentEpoch = await client.getLatestSuiSystemState();
    console.log(currentEpoch)
    return currentEpoch;
  }


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

  return (
    <>
      <div>
        {/*JSON.stringify((await getChainIdentifier()))*/}
      </div>
      <div>
        {/*JSON.stringify((await getCoinIdentifier()))*/}
      </div>
      <div>
        {/*JSON.stringify((await getNetworkStatus()))*/}
      </div>
      <button>
        fs
      </button>
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
              <code className="bg-muted p-2 rounded-md text-sm">{JSON.stringify((await getChainIdentifier()), null, 0)}</code>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Liquidity Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5" />
              Liquidity Information
            </CardTitle>
            <CardDescription>Current liquidity pool details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <div className="text-sm font-medium">Liquidity Input:</div>
              <br></br>
              <code className="bg-muted p-2 rounded-md text-sm">{JSON.stringify((await getCoinIdentifier3()), null, 0)}</code>
              <br></br>
            </div>
          </CardContent>
        </Card>
      </div>
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
              <code className="bg-muted p-2 rounded-md text-sm">{JSON.stringify((await getCoinIdentifier2()), null, 0)}</code>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}