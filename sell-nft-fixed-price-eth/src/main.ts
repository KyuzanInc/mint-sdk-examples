import './style.css'
import { MintSDK, NetworkId } from '@kyuzan/mint-sdk-js'

// --- configs
const ACCESS_TOKEN = 'Set your Mint Keys'
// ---

const sdk = new MintSDK(ACCESS_TOKEN)

const updateUI = async () => {
  // Get Listings
  const items = await sdk.getItems({
    perPage: 100,
    page: 1,
    paymentMethod: 'ethereum-contract-erc721-shop-fixed-price',
    saleStatus: 'beforeEnd',
    onlyAvailableStock: true,
  })
  const listingsUI = document.querySelector<HTMLDivElement>('#listings')!
  listingsUI.innerHTML = ``
  for await (const item of items) {
    const el = document.createElement('div')
    el.innerHTML = `
        <div>
          Previews:
          ${item.previews.map((v) => `<img width="100" src="${v.url}" />`)}
        </div>
        <div>
        <p>
          ItemName: ${item.name}
        </p>
        <p>
          ItemMetaData: ${
            item.metadata &&
            Object.entries(item.metadata)
              .map((kv) => `${kv[0]}:${kv[1]}`)
              .join(',')
          }
        </p>
        </div>
      `
    const buyButton = document.createElement('button')
    buyButton.textContent = `Buy ${item.name} (This process takes a few minutes)`
    buyButton.addEventListener('click', async () => {
      try {
        const tx = await sdk.sendTxBuyItem(item.id)
        alert(`the tx link is ${getTransactionLink(tx.hash, 4)}`)
      } catch (err) {
        alert(err)
      }
    })
    el.appendChild(buyButton)
    listingsUI.appendChild(el)
  }

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
      updateUI()
    })
  }
}

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

const getTransactionLink = (hash: string, networkId: NetworkId) => {
  if (networkId === 1) {
    return `https://etherscan.io/tx/${hash}`
  }

  if (networkId === 4) {
    return `https://rinkeby.etherscan.io/tx/${hash}`
  }

  if (networkId === 137) {
    return `https://explorer-mainnet.maticvigil.com/tx/${hash}`
  }

  if (networkId === 80001) {
    return `https://explorer-mumbai.maticvigil.com/tx/${hash}`
  }

  return ''
}

updateUI()
