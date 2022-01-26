import './style.css'
import { MintSDK } from '@kyuzan/mint-sdk-js'

// --- configs
const ACCESS_TOKEN = 'Set your Mint SDK Keys'
// ---

const sdk = new MintSDK(ACCESS_TOKEN, {
  selectWalletModal: {
    cacheProvider: true,
  },
})

const updateUI = async () => {
  const profileUI = document.querySelector<HTMLDivElement>('#profile')!

  if (await sdk.isWalletConnect()) {
    const connectedWallet = await sdk.getWalletInfo()
    const { address } = connectedWallet
    const info = await sdk.getAccountInfo({
      walletAddress: address,
    })

    if (info) {
      profileUI.innerHTML = `
        <img src="${info.avatarImageUrl}" style="width: 100px;"/>
        <p>name: ${info.profile.displayName}</p>
        <p>bio: ${info.profile.bio}</p>
      `
    } else {
      window.alert('No profile data. Plz set info via form')
    }
  } else {
    await sdk.connectWallet()
  }
}

const submitButton = document.querySelector<HTMLButtonElement>('#submit')!
submitButton.addEventListener('click', async (event) => {
  event.preventDefault()
  const avatar = document.querySelector<HTMLInputElement>('#avatar')!

  // upload img
  const selectedFile = avatar.files ? avatar.files[0] : null
  const res = selectedFile
    ? await sdk.uploadAccountInfoAvatar({ file: selectedFile })
    : ''

  // submit
  await sdk.updateAccountInfo({
    avatarImageId: res ? res.imgId : '',
    displayName: document.querySelector<HTMLInputElement>('#name')!.value,
    bio: document.querySelector<HTMLInputElement>('#bio')!.value,
    twitterAccountName: '',
    instagramAccountName: '',
    homepageUrl: '',
  })

  updateUI()
})

sdk.onConnect(() => {
  updateUI()
})

updateUI()
