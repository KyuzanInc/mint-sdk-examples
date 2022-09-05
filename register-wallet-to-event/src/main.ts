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
      const otp = document.querySelector<HTMLInputElement>('#otp')!
      await sdk.registerWalletToWalletList(otp.value)
      alert('success apply for mint')
    } catch (err) {
      alert(err)
      return
    }
})

