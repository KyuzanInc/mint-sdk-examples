import './style.css'
import { MintSDK, NetworkId } from '@kyuzan/mint-sdk-js'

// --- configs
const ACCESS_TOKEN = 'Set your Mint Keys'
// ---

const sdk = new MintSDK(ACCESS_TOKEN)

const updateUI = async () => {
  const searchButton = document.querySelector<HTMLDivElement>('#searchButton')!

  searchButton.addEventListener('click', async () => {
    const contractAddressInput = document.querySelector<HTMLInputElement>('#contractAddressInput')!
    const contractAddress = contractAddressInput.value?.trim()
    const tokenList = document.querySelector<HTMLDivElement>('#tokenList')!
    tokenList.innerHTML = ''

    if (!contractAddress) {
      return
    }

    const tokens = await sdk.getTokenERC721s(contractAddress)

    if (!tokens.length) {
      return
    }

    const contract = await sdk.getContractERC721ById({
      contractId: tokens[0].contractERC721Id,
    })

    tokens.forEach(token => {
      const el = document.createElement('div')
      el.innerHTML = `
        🖼
        ContractAddress: ${contract.address}
        TokenId: ${token.tokenId}
        TokenURI: ${token.tokenURI}
        OpenSeaLink: <a href="${getOpenSeaLink({
          networkId: contract.networkId,
          contractAddress: contract.address,
          tokenId: token.tokenId,
        })}" target="_blank">View NFT on OpenSea</a>
      `
      tokenList.appendChild(el)
    })
  })
}

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
