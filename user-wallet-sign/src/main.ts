import './style.css'
import { MintSDK } from '@kyuzan/mint-sdk-js'

// --- configs
const ACCESS_TOKEN = 'e09da806-cf69-4eee-942b-27b3e993e429'
const FORTMATIC_KEY = 'pk_test_7459BD51DE1FC406'
// ---

const sdk = new MintSDK(ACCESS_TOKEN, {
  fortmatic: {
    key: FORTMATIC_KEY,
  },
})

const authButton = document.querySelector<HTMLButtonElement>('#submit')!
authButton.addEventListener('click', async () => {
  if (!(await sdk.isWalletConnect())) {
    try {
      await sdk.connectWallet()
    } catch (_) {
      alert('connect wallet!')
    }
  }

  // create sign with data
  const walletAddress = await sdk.getWalletInfo()
  const { data, sig } = await sdk.signTypedData({
    domain: { name: 'Auth User' },
    types: { Body: [{ name: 'userWalletAddress', type: 'string' }] },
    value: { userWalletAddress: walletAddress.address },
  })

  // verify sign
  // this should be processed on server side
  const verifiedWalletAddress = await MintSDK.recoverySignData({
    sig,
    data,
  })
  const debugUI = document.querySelector<HTMLDivElement>('#debug')!
  debugUI.innerHTML = `
    ---- below should be processed on server side  ----
    <p>
      Verified WalletAddress: ${verifiedWalletAddress}
    </p>
    <p>
      Data: ${data}
    </p>
    <p>
      Signature: ${sig}
    </p>
  `
})
