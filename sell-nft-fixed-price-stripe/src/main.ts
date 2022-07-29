import './style.css'
import { Item, MintSDK } from '@kyuzan/mint-sdk-js'

// --- configs
const ACCESS_TOKEN = 'Set your own token'
const USE_SDK_GET_ITEM_V2 = false
// ---

const sdk = new MintSDK(ACCESS_TOKEN, {
  selectWalletModal: {
    cacheProvider: true,
  },
})

const updateUI = async () => {
  // Payment Process
  let items: Item[]
  let totalItems = 0
  if (USE_SDK_GET_ITEM_V2) {
    const [scheduled, onSale] = await Promise.all([sdk.getItemsV2({
      perPage: 100,
      page: 1,
      paymentMethod: 'credit-card-stripe-fixed-price',
      saleStatus: 'scheduled',
      onlyAvailableStock: true,
    }), sdk.getItemsV2({
      perPage: 100,
      page: 1,
      paymentMethod: 'credit-card-stripe-fixed-price',
      saleStatus: 'onSale',
      onlyAvailableStock: true,
    })])
    items = [...scheduled.data, ...onSale.data]
    totalItems = scheduled.meta.totalItems + onSale.meta.totalItems
  } else {
    items = await sdk.getItems({
      perPage: 100,
      page: 1,
      paymentMethod: 'credit-card-stripe-fixed-price',
      saleStatus: 'beforeEnd',
      onlyAvailableStock: true,
    })
  }

  const listingsUI = document.querySelector<HTMLDivElement>('#listings')!
  listingsUI.innerHTML = ``
  if (items.length !== 0) {
    const item = items[0]
    const el = document.createElement('div')
    el.innerHTML = `
        <div>Total item: ${totalItems ? totalItems : 'unknown'} </div>
        <div>
          Previews:
          ${item.previews.map((v) => `<img width="100" src="${v.url}" />`)}
        </div>
        <div>
        <p>
          ItemName: ${item.name}
        </p>
        <p>
          Price: ${item.price} ${
      item.paymentMethodData.paymentMethod ===
        'credit-card-stripe-fixed-price' && item.paymentMethodData.currency
    }
        </p>
      `
    if (!(await sdk.isWalletConnect())) {
      alert('Connect your wallet and try again')
      sdk.connectWallet()
      return
    }

    const { address } = await sdk.getWalletInfo()
    const buyButton = document.createElement('button')
    const payButton = document.querySelector('#submit') as HTMLButtonElement
    buyButton.textContent = `Buy ${item.name} (This process takes a few minutes) with ${address}`
    buyButton.addEventListener('click', async () => {
      buyButton.style.visibility = 'hidden'
      payButton!.style.visibility = 'visible'
      try {
        // ref: https://stripe.com/docs/payments/quickstart
        const { stripe, paymentIntentClientSecret } =
          await sdk.createStripePaymentIntent({
            itemId: item.id,
            toAddress: address,
            residence: 'unknown',
          })
        const elements = stripe!.elements({
          appearance: {
            theme: 'stripe',
          },
          clientSecret: paymentIntentClientSecret,
        })

        const paymentElement = elements.create('payment')
        paymentElement.mount('#payment-element')
        document
          .querySelector('#payment-form')!
          .addEventListener('submit', async (e) => {
            e.preventDefault()
            const { error } = await stripe!.confirmPayment({
              elements,
              confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: '',
              },
              redirect: 'if_required',
            })

            // This point will only be reached if there is an immediate error when
            // confirming the payment. Otherwise, your customer will be redirected to
            // your `return_url`. For some payment methods like iDEAL, your customer will
            // be redirected to an intermediate site first to authorize the payment, then
            // redirected to the `return_url`.
            if (error) {
              alert(error.message)
            } else {
              alert(
                'success!! Wait until the process is finished. Then try loading it again.',
              )
            }
          })
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
        OpenSeaLink: <a href="${MintSDK.getOpenSeaURL({
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

updateUI()

sdk.onConnect(() => {
  updateUI()
})
