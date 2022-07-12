import './style.css'
import { MintSDK } from '@kyuzan/mint-sdk-js'

const MINT_SDK_KEY = ''

const sdk = new MintSDK(MINT_SDK_KEY)

await sdk.connectWallet()
const currentWallet = await sdk.getWalletInfo()

const boughtItemStocks = await sdk.getBoughtItemStocksByWalletAddress({
  walletAddress: currentWallet.address,
  page: 1,
  perPage: 100,
})
const itemStocks = document.querySelector<HTMLDivElement>('#itemStocks')!
boughtItemStocks
  .filter((itemStock) => {
    return itemStock.item.type === 'with-physical-item'
  })
  .forEach((itemStock) => {
    const p = document.createElement('p')
    p.innerHTML = `itemStockId: ${itemStock.id}, itemName: ${itemStock.item.name}`
    itemStocks.appendChild(p)
  })

const registerButton =
  document.querySelector<HTMLButtonElement>('#registerButton')!
registerButton.addEventListener('click', async () => {
  const itemStockId = document.querySelector<HTMLInputElement>('#itemStockId')!
  if (itemStockId && itemStockId.value) {
    try {
      const firstName = document.querySelector<HTMLInputElement>('#firstName')!
      const lastName = document.querySelector<HTMLInputElement>('#lastName')!
      const country = document.querySelector<HTMLInputElement>('#country')!
      const email = document.querySelector<HTMLInputElement>('#email')!
      const postalCode =
        document.querySelector<HTMLInputElement>('#postalCode')!
      const city = document.querySelector<HTMLInputElement>('#city')!
      const state = document.querySelector<HTMLInputElement>('#state')!
      const address1 = document.querySelector<HTMLInputElement>('#address1')!
      const phoneNumber =
        document.querySelector<HTMLInputElement>('#phoneNumber')!
      const address2 = document.querySelector<HTMLInputElement>('#address2')!
      const address3 = document.querySelector<HTMLInputElement>('#address3')!

      await sdk.registerShippingInfo({
        itemStockId: itemStockId.value,
        firstName: firstName.value,
        lastName: lastName.value,
        country: country.value,
        email: email.value,
        postalCode: postalCode.value,
        city: city.value,
        state: state.value,
        address1: address1.value,
        phoneNumber: phoneNumber.value,
        address2: address2.value,
        address3: address3.value,
      })
      alert('success so please check Mint console')
    } catch (err) {
      alert(err)
      return
    }
  }
})

const fetchButton = document.querySelector<HTMLButtonElement>('#fetchButton')!
fetchButton.addEventListener('click', async () => {
  const itemStockId = document.querySelector<HTMLInputElement>('#itemStockId')!
  if (itemStockId && itemStockId.value) {
    try {
      const shippingStatus = await sdk.getShippingInfoStatus(itemStockId.value)
      if (!shippingStatus) {
        throw new Error('can not fetch shipping status : ', shippingStatus)
      }
      const shippingInfo = await sdk.getShippingInfo(itemStockId.value)
      if (!shippingInfo) {
        throw new Error('can not fetch shipping info : ', shippingInfo)
      }

      const firstName = document.querySelector<HTMLInputElement>('#firstName')!
      const lastName = document.querySelector<HTMLInputElement>('#lastName')!
      const country = document.querySelector<HTMLInputElement>('#country')!
      const email = document.querySelector<HTMLInputElement>('#email')!
      const postalCode =
        document.querySelector<HTMLInputElement>('#postalCode')!
      const city = document.querySelector<HTMLInputElement>('#city')!
      const state = document.querySelector<HTMLInputElement>('#state')!
      const address1 = document.querySelector<HTMLInputElement>('#address1')!
      const phoneNumber =
        document.querySelector<HTMLInputElement>('#phoneNumber')!
      const address2 = document.querySelector<HTMLInputElement>('#address2')!
      const address3 = document.querySelector<HTMLInputElement>('#address3')!

      firstName.value = shippingInfo.firstName
      lastName.value = shippingInfo.lastName
      country.value = shippingInfo.country
      email.value = shippingInfo.email
      postalCode.value = shippingInfo.postalCode
      city.value = shippingInfo.city
      state.value = shippingInfo.state
      address1.value = shippingInfo.address1
      phoneNumber.value = shippingInfo.phoneNumber
      address2.value = shippingInfo.address2 ?? ''
      address3.value = shippingInfo.address3 ?? ''
    } catch (err) {
      alert(err)
      return
    }
  }
})

const clearButton = document.querySelector<HTMLButtonElement>('#clearButton')!
clearButton.addEventListener('click', async () => {
  const itemStockId = document.querySelector<HTMLInputElement>('#itemStockId')!
  const status = document.querySelector<HTMLInputElement>('#status')!
  const firstName = document.querySelector<HTMLInputElement>('#firstName')!
  const lastName = document.querySelector<HTMLInputElement>('#lastName')!
  const country = document.querySelector<HTMLInputElement>('#country')!
  const email = document.querySelector<HTMLInputElement>('#email')!
  const postalCode = document.querySelector<HTMLInputElement>('#postalCode')!
  const city = document.querySelector<HTMLInputElement>('#city')!
  const state = document.querySelector<HTMLInputElement>('#state')!
  const address1 = document.querySelector<HTMLInputElement>('#address1')!
  const phoneNumber = document.querySelector<HTMLInputElement>('#phoneNumber')!
  const address2 = document.querySelector<HTMLInputElement>('#address2')!
  const address3 = document.querySelector<HTMLInputElement>('#address3')!
  itemStockId.value = ''
  status.value = ''
  firstName.value = ''
  lastName.value = ''
  country.value = ''
  email.value = ''
  postalCode.value = ''
  city.value = ''
  state.value = ''
  address1.value = ''
  phoneNumber.value = ''
  address2.value = ''
  address3.value = ''
})
