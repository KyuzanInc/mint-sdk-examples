import './style.css'
import { MintSDK, NetworkId } from '@kyuzan/mint-sdk-js'

// --- configs
const ACCESS_TOKEN = 'Set your Mint Keys'
// ---

const sdk = new MintSDK(ACCESS_TOKEN)

const updateUI = async () => {
  // Get Owned NFTs
  const loginButton = document.querySelector<HTMLDivElement>('#loginButton')!
  if (await sdk.isWalletConnect()) {
    loginButton.style.visibility = 'hidden'
    const connectedWallet = await sdk.getWalletInfo()
    const { address } = connectedWallet
    const ownedNFTs = await sdk.getTokensByAddress({
      walletAddress: address,
      perPage: 100,
      page: 1,
    })
    const myNFTsUI = document.querySelector<HTMLDivElement>('#myNFTs')!
    for await (const nft of ownedNFTs) {
      const el = document.createElement('div')
      const contract = await sdk.getContractERC721ById({
        contractId: nft.contractERC721Id,
      })
      el.innerHTML = `
        🖼
        ContractAddress: ${contract.address}
        TokenId: ${nft.tokenId}
        TokenURI: ${nft.tokenURI}
        OpenSeaLink: <a href="${getOpenSeaLink({
          networkId: contract.networkId,
          contractAddress: contract.address,
          tokenId: nft.tokenId,
        })}" target="_blank">View NFT on OpenSea</a>
      `
      myNFTsUI.appendChild(el)
    }
  } else {
    loginButton.style.visibility = 'visible'
    loginButton?.addEventListener('click', async () => {
      await sdk.connectWallet()
    })
  }
}

sdk.onConnect(() => {
  updateUI()
})

updateUI()

// utils
const getOpenSeaLink = ({
  networkId,
  contractAddress,
  tokenId,
}: {
  networkId: NetworkId
  contractAddress: string
  tokenId: number
}) => {
  if (networkId === 1) {
    return `https://opensea.io/assets/${contractAddress}/${tokenId}`
  }

  if (networkId === 4) {
    return `https://testnets.opensea.io/assets/${contractAddress}/${tokenId}`
  }

  if (networkId === 137) {
    return `https://opensea.io/assets/matic/${contractAddress}/${tokenId}`
  }

  if (networkId === 80001) {
    return `https://testnets.opensea.io/assets/matic/${contractAddress}/${tokenId}`
  }

  return ''
}
