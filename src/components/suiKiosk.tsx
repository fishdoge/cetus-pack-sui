
import CetusClmmSDK, {ClmmPoolUtil, d, SdkOptions, TickMath} from '@cetusprotocol/cetus-sui-clmm-sdk'
import BN from "bn.js";
import { SuiGraphQLClient } from '@mysten/sui/graphql';
import { graphql } from '@mysten/sui/graphql/schemas/latest';
import { KioskClient, Network } from '@mysten/kiosk';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { clmmTestnet } from '@/config/sdkConfig'
import { ArrowRight, Coins, FuelIcon as Gas, Wallet } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"



export default async function SuiComponent() {


  const initialize_price = 0.3
  const coin_a_decimals = 6
  const coin_b_decimals = 6

  const TestnetSDK = new CetusClmmSDK(clmmTestnet)

  TestnetSDK.senderAddress = process.env.WALLET_ADDRESS ?? '';

  const initialize_sqrt_price = TickMath.priceToSqrtPriceX64(d(initialize_price), coin_a_decimals, coin_b_decimals).toString()
  const tick_spacing = 2
  const current_tick_index = TickMath.sqrtPriceX64ToTickIndex(new BN(initialize_sqrt_price))

  const lowerTick = TickMath.getPrevInitializableTickIndex(new BN(current_tick_index).toNumber(), new BN(tick_spacing).toNumber())
  const upperTick = TickMath.getNextInitializableTickIndex(new BN(current_tick_index).toNumber(), new BN(tick_spacing).toNumber())
  const coin_type_a = `${TestnetSDK.sdkOptions.faucet?.package_id}::usdt::USDT`
  const coin_type_b = `${TestnetSDK.sdkOptions.faucet?.package_id}::usdc::USDC`
  //const coin_type_a = '0x2::sui::SUI'
  //const coin_type_b = '0x2::sui::SUI'

  //console.log(initialize_sqrt_price)
  //console.log(current_tick_index)

  const fix_coin_amount = new BN(50)
  const fix_amount_a = true
  const slippage = 0.05

  const liquidityInput = ClmmPoolUtil.estLiquidityAndcoinAmountFromOneAmounts(
      lowerTick,
      upperTick,
      fix_coin_amount,
      fix_amount_a,
      true,
      slippage,
      new BN(initialize_sqrt_price)
  )

  const amount_a = fix_amount_a ? fix_coin_amount.toNumber() : liquidityInput.tokenMaxA.toNumber()
  const amount_b = fix_amount_a ? liquidityInput.tokenMaxB.toNumber() : fix_coin_amount.toNumber()

  const pool = TestnetSDK.Pool.getPool('0x83c101a55563b037f4cd25e5b326b26ae6537dc8048004c1408079f7578dd160'/*'0xd4573bdd25c629127d54c5671d72a0754ef47767e6c01758d6dc651f57951e7d'*/)
  console.log(pool)

  /*const creatPoolTransactionPayload = await TestnetSDK.Pool.creatPoolTransactionPayload({
    tick_spacing: tick_spacing,
    initialize_sqrt_price: initialize_sqrt_price,
    uri: '',
    coinTypeA: coin_type_a,
    coinTypeB: coin_type_b,
    amount_a: amount_a,
    amount_b: amount_b,
    slippage,
    fix_amount_a: fix_amount_a,
    tick_lower: lowerTick,
    tick_upper: upperTick,
  })
  console.log(creatPoolTransactionPayload);
  creatPoolTransactionPayload.setGasBudget(100000000);
  //console.log(creatPoolTransactionPayload);

  const transferTxn = await TestnetSDK.fullClient.sendTransaction(
      Ed25519Keypair.deriveKeypair(process.env.PASS_PHRASE ?? ''),
      creatPoolTransactionPayload
  )
  console.log(transferTxn);*/


  const gqlClient = new SuiGraphQLClient({
    url: 'https://sui-mainnet.mystenlabs.com/graphql',
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
    return result;
  }
  ///////////

  const rpcUrl = getFullnodeUrl("testnet");

  const client = new SuiClient({ url: rpcUrl });

  async function getNetworkStatus() {
      const currentEpoch = await client.getLatestSuiSystemState();
      console.log(currentEpoch)
  }

  // Now we can use it to create a kiosk Client.
  const kioskClient = new KioskClient({
    client,
    network: Network.TESTNET,
  });

  // resource https://www.youtube.com/watch?v=yNA6aeNtJR4&t=2s
  const id = `0x62e2a8d935ce4cefff18ed173d3ae7f1a45b92762388ebe4e1faead76d341763`;

  // You can perform actions, like querying the owned kiosks for an address.
  const tempKiosk = await kioskClient.getKiosk({
    id,
    options: {
        withKioskFields: true, // this flag also returns the `kiosk` object in the response, which includes the base setup
        withListingPrices: true, // This flag enables / disables the fetching of the listing prices.
    }
  });


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
        {JSON.stringify(liquidityInput)}
      </div>
      <div>
        {JSON.stringify(amount_a)}
      </div>
      <div>
        {JSON.stringify(amount_b)}
      </div>
      <div>
        {JSON.stringify(coin_type_a)}
      </div>
      <div>
        {JSON.stringify(coin_type_b)}
      </div>
      <div>
        {JSON.stringify((await getChainIdentifier()).data?.epoch?.referenceGasPrice)}
      </div>
      <div>
        {/*JSON.stringify((await getNetworkStatus()))*/}
      </div>
      <div>
        {/*JSON.stringify((await tempKiosk))*/}
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
              <code className="bg-muted p-2 rounded-md text-sm">{JSON.stringify((await tempKiosk), null, 0)}</code>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}