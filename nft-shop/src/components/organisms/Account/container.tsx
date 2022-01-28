import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getContractERC721sActionCreator } from '../../../redux/contractERC721s'
import { useAppSelector } from '../../../redux/getStore'
import { Presentation } from './presentation'

export const Container: React.VFC = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const walletAddress = router.query.walletAddress as string

  const tokens = useAppSelector(
    (state) => state.app.accountTokens.data.tokens[walletAddress]
  )
  const tokensLoading = useAppSelector(
    (state) => state.app.accountTokens.meta.loading[walletAddress]
  )

  const accountInfoLoading = useAppSelector(
    (state) => state.app.accountInfo.meta.loading
  )
  const accountInfo = useAppSelector(
    (state) => state.app.accountInfo.data.accountInfoMap[walletAddress]
  )

  const contractERC721s = useAppSelector((state) => {
    return state.app.contractERC721s.data
  })

  useEffect(() => {
    if (!tokensLoading) {
      tokens.forEach((token) => {
        dispatch(
          getContractERC721sActionCreator({
            contractERC721Id: token.contractERC721Id,
          }) as any
        )
      })
    }
  }, [tokens, tokensLoading])

  return (
    <Presentation
      waitingOwnTokens={
        typeof tokensLoading === 'undefined' ? true : tokensLoading
      }
      contractERC721s={contractERC721s}
      userWalletAddress={walletAddress}
      ownTokens={tokens}
      accountDisplayName={accountInfo?.displayName || undefined}
      accountBio={accountInfo?.bio || undefined}
      accountProfileUrl={accountInfo?.avatarImgUrl || undefined}
      accountInstagramAccountName={
        accountInfo?.instagramAccountName || undefined
      }
      accountTwitterAccountName={accountInfo?.twitterAccountName || undefined}
      accountSiteUrl={accountInfo?.homepageUrl || undefined}
      accountLoading={accountInfoLoading}
    />
  )
}
