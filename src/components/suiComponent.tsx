
import CetusClmmSDK, {ClmmPoolUtil, d, SdkOptions, TickMath} from '@cetusprotocol/cetus-sui-clmm-sdk'
import BN from "bn.js";
import { Secp256k1Keypair} from '@mysten/sui/keypairs/secp256k1'
import { Ed25519Keypair} from '@mysten/sui/keypairs/ed25519'
import { SuiGraphQLClient } from '@mysten/sui/graphql';
import { graphql } from '@mysten/sui/graphql/schemas/latest';
import { KioskClient, Network } from '@mysten/kiosk';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';


export default async function SuiComponent() {
  const SDKConfig = {
    clmmConfig: {
      pools_id: '0xc090b101978bd6370def2666b7a31d7d07704f84e833e108a969eda86150e8cf',
      global_config_id: '0x6f4149091a5aea0e818e7243a13adcfb403842d670b9a2089de058512620687a',
      global_vault_id: '0xf3114a74d54cbe56b3e68f9306661c043ede8c6615f0351b0c3a93ce895e1699',
      admin_cap_id: '0xa456f86a53fc31e1243f065738ff1fc93f5a62cc080ff894a0fb3747556a799b',
    },
    cetusConfig: {
      coin_list_id: '0x257eb2ba592a5480bba0a97d05338fab17cc3283f8df6998a0e12e4ab9b84478',
      launchpad_pools_id: '0xdc3a7bd66a6dcff73c77c866e87d73826e446e9171f34e1c1b656377314f94da',
      clmm_pools_id: '0x26c85500f5dd2983bf35123918a144de24e18936d0b234ef2b49fbb2d3d6307d',
      admin_cap_id: '0x1a496f6c67668eb2c27c99e07e1d61754715c1acf86dac45020c886ac601edb8',
      global_config_id: '0xe1f3db327e75f7ec30585fa52241edf66f7e359ef550b533f89aa1528dd1be52',
      coin_list_handle: '0x3204350fc603609c91675e07b8f9ac0999b9607d83845086321fca7f469de235',
      launchpad_pools_handle: '0xae67ff87c34aceea4d28107f9c6c62e297a111e9f8e70b9abbc2f4c9f5ec20fd',
      clmm_pools_handle: '0xd28736923703342b4752f5ed8c2f2a5c0cb2336c30e1fed42b387234ce8408ec',
    },
  }
  const clmmTestnet: SdkOptions = {
    // fullRpcUrl: 'https://testnet.artifact.systems/sui',
    fullRpcUrl: 'https://sui-testnet-endpoint.blockvision.org',
    simulationAccount: {
      address: '0x25e6a21d3c032479b67448c44f817217791da22d12f4539264df2c884ac4301e',
    },
    faucet: {
      package_id: '0x0588cff9a50e0eaf4cd50d337c1a36570bc1517793fd3303e1513e8ad4d2aa96',
      published_at: '0x0588cff9a50e0eaf4cd50d337c1a36570bc1517793fd3303e1513e8ad4d2aa96',
    },
    cetus_config: {
      package_id: '0xf5ff7d5ba73b581bca6b4b9fa0049cd320360abd154b809f8700a8fd3cfaf7ca',
      published_at: '0xf5ff7d5ba73b581bca6b4b9fa0049cd320360abd154b809f8700a8fd3cfaf7ca',
      config: SDKConfig.cetusConfig,
    },

    clmm_pool: {
      package_id: '0x0868b71c0cba55bf0faf6c40df8c179c67a4d0ba0e79965b68b3d72d7dfbf666',
      published_at: '0x0868b71c0cba55bf0faf6c40df8c179c67a4d0ba0e79965b68b3d72d7dfbf666',
      config: SDKConfig.clmmConfig,
    },
    integrate: {
      package_id: '0x8627c5cdcd8b63bc3daa09a6ab7ed81a829a90cafce6003ae13372d611fbb1a9',
      published_at: '0xd55d88490e28ef68d83d2fe7862909dfcef6e43a2f50403f3a461c4678e274f1',
    },
    deepbook: {
      package_id: '0x000000000000000000000000000000000000000000000000000000000000dee9',
      published_at: '0x000000000000000000000000000000000000000000000000000000000000dee9',
    },
    deepbook_endpoint_v2: {
      package_id: '0x56d90d0c055edb534b11e7548270bb458fd47c69b77bf40c14d5eb00e6e6cf64',
      published_at: '0x56d90d0c055edb534b11e7548270bb458fd47c69b77bf40c14d5eb00e6e6cf64',
    },
    aggregatorUrl: 'https://api-sui.devcetus.com/router',
    swapCountUrl: 'https://api-sui.devcetus.com/v2/sui/pools_info',
  }

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
        {JSON.stringify((await tempKiosk))}
      </div>
      <button>
        fs
      </button>
    </>
  );
}