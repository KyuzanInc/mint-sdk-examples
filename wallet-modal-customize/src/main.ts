import './style.css'
import { MintSDK } from '@kyuzan/mint-sdk-js'

// --- configs
const ACCESS_TOKEN = 'Set your Mint SDK Keys'
// ---

const sdk = new MintSDK(ACCESS_TOKEN, {
  selectWalletModal: {
    cacheProvider: false,
    theme: {
      background: '#22ff0f',
      main: 'fff',
      secondary: '000',
      border: '#ff0000',
      hover: '#ff22ff',
    },
  },
  providers: {
    // TORUS
    torus: {
      display: {
        name: '[[Torus]]',
        description: 'This is shown at wallet select modal',
      },
      options: {
        showTorusButton: true,
        whiteLabel: {
          theme: {
            isDark: false,
            colors: {
              torusBrand1: '#282c34',
            },
          },
          logoDark:
            'https://assets.website-files.com/6049dda9cd045bae2533bfe9/608814a85a17a508dbd0e413_Mint.svg', // Dark logo for light background
          logoLight:
            'https://assets.website-files.com/6049dda9cd045bae2533bfe9/608814a85a17a508dbd0e413_Mint.svg', // Light logo for dark background
          topupHide: false,
          featuredBillboardHide: true,
          disclaimerHide: true,
          defaultLanguage: 'en',
        },
      },
    },
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
    const openWalletButton = document.createElement('div')
    openWalletButton.innerHTML = `<p>open</p>`
    openWalletButton.addEventListener('click', () => {
      sdk.openWallet()
    })
    walletInfoUI.appendChild(openWalletButton)
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

sdk.onChainChange(() => {
  updateUI()
})

updateUI()
