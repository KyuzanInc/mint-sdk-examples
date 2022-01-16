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

const updateUI = async () => {
  const loginButton = document.querySelector<HTMLDivElement>('#loginButton')!
  const walletInfoUI = document.querySelector<HTMLDivElement>('#walletInfo')!

  if (await sdk.isWalletConnect()) {
    loginButton.style.visibility = 'hidden'
    const walletInfo = await sdk.getWalletInfo()
    const connectingNetworkId = await sdk.getConnectedNetworkId()
    walletInfoUI.innerHTML = `
        <p>Address: ${walletInfo.address}</p>
        <p>Balance: ${MintSDK.formatEther(walletInfo.balance)} ${
      walletInfo.unit
    } </p>
        <p>ConnectedNetworkId: ${connectingNetworkId}
    `
  } else {
    loginButton.style.visibility = 'visible'
    loginButton?.addEventListener('click', () => {
      sdk.connectWallet()
    })
  }
}

sdk.onConnect(() => {
  updateUI()
})

sdk.onDisconnect(() => {
  updateUI()
})

sdk.onAccountsChange(() => {
  updateUI()
})

updateUI()
