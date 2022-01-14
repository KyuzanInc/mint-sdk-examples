import React, { useEffect } from 'react'
import { getAccountInfoActionCreator } from '../../../redux/accountInfo'
import { useAppDispatch, useAppSelector } from '../../../redux/getStore'
import { Presentation } from './presentation'

type Props = {
  //
}

export const Container: React.VFC<Props> = () => {
  const dispatch = useAppDispatch()
  const accounts = useAppSelector(
    (state) => state.app.accountInfo.data.accountInfoMap
  )

  const item = useAppSelector((state) => {
    return state.app.item.data
  })

  useEffect(() => {
    item?.bids.forEach((h) => {
      if (typeof accounts[h.bidder] === 'undefined') {
        dispatch(
          getAccountInfoActionCreator({
            walletAddress: h.bidder,
          }) as any
        )
      }
    })
  }, [item?.bids, accounts])
  if (
    item?.paymentMethodData.paymentMethod !==
    'ethereum-contract-erc721-shop-auction'
  ) {
    return null
  }

  return (
    <Presentation
      loading={false}
      history={
        item
          ? item?.bids.map((h) => {
              const accountInfo = accounts[h.bidder]
              if (typeof accountInfo === 'undefined') {
                return h
              } else {
                return {
                  ...h,
                  avatarImgUrl: accountInfo['avatarImgUrl'],
                }
              }
            })
          : []
      }
    />
  )
}
