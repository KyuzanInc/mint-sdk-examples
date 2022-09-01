import './style.css'
import * as x from '@kyuzan/mint-sdk-js'

const MINT_SDK_KEY = ''

const sdk = new x.MintSDK(MINT_SDK_KEY)

await sdk.connectWallet()

const getEventButton = document.querySelector<HTMLButtonElement>('#getEventButton')!
const eventInformation = document.querySelector<HTMLDivElement>('#eventInformation')!

  getEventButton.addEventListener('click', async () => {
    const walletId = document.querySelector<HTMLInputElement>('#otp')!
    await sdk.getWalletListByWalletId(walletId.value).then((result) => {
      eventInformation.innerHTML = ''
      const p = document.createElement('p')
      p.innerHTML = `<b>eventSetting: </b> ${JSON.stringify(result.eventSetting, null, 4)}, <br/> <b>walletListId:</b> ${result.id}, <br /> <b>walletListName:</b> ${result.walletListName}`
      eventInformation.appendChild(p)
    })
  })


const registerButton =
  document.querySelector<HTMLButtonElement>('#registerButton')!
registerButton.addEventListener('click', async () => {
    try {
      const otp = document.querySelector<HTMLInputElement>('#otpRegister')!
      const walletAddress = document.querySelector<HTMLInputElement>('#walletAddress')!
      await sdk.registerWalletToWalletList(otp.value, walletAddress.value)
      alert('success apply for mint')
    } catch (err) {
      alert(err)
      return
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
