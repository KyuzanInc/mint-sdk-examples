import { MintSDK } from '@kyuzan/mint-sdk-js'

let sdk: MintSDK | undefined = undefined
export const getSdk = () => {
  if (typeof sdk === 'undefined') {
    sdk = new MintSDK(
      process.env.NEXT_PUBLIC_MINT_SDK_KEY as string,
      {
        selectWalletModal: {
          cacheProvider: false,
        },
        providers: {
          torus: {
            options: {
              showTorusButton: true,
            },
          },
        },
      },
      {
        backendUrl: process.env.NEXT_PUBLIC_MINT_BACKEND_URL as string,
      }
    )
  }

  return sdk
}
