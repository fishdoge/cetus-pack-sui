
import { SuiGraphQLClient } from '@mysten/sui/graphql';
import { graphql } from '@mysten/sui/graphql/schemas/latest';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';



export default async function SuiComponent() {

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
        {JSON.stringify((await getChainIdentifier()).data?.epoch?.referenceGasPrice)}
      </div>
      <div>
        {/*JSON.stringify((await getNetworkStatus()))*/}
      </div>
      <button>
        fs
      </button>
    </>
  );
}