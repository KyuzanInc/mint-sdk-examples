import './style.css'
import { MintSDK, ERC721_SALE_BETA__factory } from '@kyuzan/mint-sdk-js'
import * as ethers from 'ethers'

// --- configs
const ACCESS_TOKEN = 'Set your Mint SDK Keys'
const EXPECTED_NETWORK_ID = 4 // rinkeby
const CONTRACT_ADDRESS = '0x832e6e867e68F46636EbE20E38cD1Df711EECdFB' // use your own contract
// ---

const sdk = new MintSDK(ACCESS_TOKEN, {
  selectWalletModal: {
    cacheProvider: false,
  },
})

await sdk.connectWallet()

const provider = await sdk.getConnectedProvider()

const updateUI = async () => {
  const connectedNetwork = await sdk.getConnectedNetworkId()
  if (EXPECTED_NETWORK_ID !== connectedNetwork) {
    alert('Network is not wrong. Switch Network to Rinkeby')
  }

  const currentWallet = await sdk.getWalletInfo()

  const saleContract = ERC721_SALE_BETA__factory.connect(
    CONTRACT_ADDRESS,
    provider.getSigner(),
  )

  const walletInfoDOM = document.querySelector<HTMLDivElement>('#walletInfo')!
  walletInfoDOM.innerHTML = `walletAddress: ${currentWallet.address}`

  const priceDOM = document.querySelector<HTMLDivElement>('#price')!
  const priceWei = await saleContract.PRICE_PER_TOKEN()
  const priceEth = ethers.utils.formatEther(priceWei)
  priceDOM.innerHTML = `Price: ${priceEth}ETH`

  const maxSupplyDOM = document.querySelector<HTMLDivElement>('#maxSupply')!
  maxSupplyDOM.innerHTML = `MaxSupply: ${await (
    await saleContract.MAX_SUPPLY()
  ).toNumber()}`

  const totalSupplyDOM = document.querySelector<HTMLDivElement>('#totalSupply')!
  const totalSupply = await saleContract.totalSupply()
  totalSupplyDOM.innerHTML = `Already Minted Num: ${totalSupply}`

  const balanceOfDOM = document.querySelector<HTMLDivElement>('#balanceOf')!
  const balanceOf = await saleContract.balanceOf(currentWallet.address)
  balanceOfDOM.innerHTML = `This wallet has ${balanceOf}`

  const startAtDOM = document.querySelector<HTMLDivElement>('#startAt')!
  const startAtUnix = await (await saleContract.MINT_START_AT()).toNumber()
  startAtDOM.innerHTML = `Sale start at: ${new Date(startAtUnix * 1000)}`

  const buyButtonDOM = document.querySelector<HTMLButtonElement>('#buyButton')!
  buyButtonDOM.addEventListener('click', async () => {
    const tx = await saleContract.mint({ value: priceWei })
    await tx.wait()
    alert(
      `Success to buy. Check: https://testnets.opensea.io/${currentWallet.address}`,
    )
  })
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
