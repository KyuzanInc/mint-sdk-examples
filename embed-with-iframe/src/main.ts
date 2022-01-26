import './style.css'
import { MintSDK } from '@kyuzan/mint-sdk-js'

// --- configs
const ACCESS_TOKEN = 'Set your Mint SDK Keys'
// ---

const sdk = new MintSDK(ACCESS_TOKEN)

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
