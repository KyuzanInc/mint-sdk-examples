import styled from '@emotion/styled'
import React, { useState } from 'react'
import CheckoutForm  from './CheckForm'
import Image from 'next/image'
import { color, font,  media } from '../../../style'
import { PrimaryButton } from '../../atoms/PrimaryButton'
import { MediaContent } from '../../atoms/MediaContent'
import { StatusDetail } from '../Detail'
import { ToolTip } from '../../atoms/ToolTip'
import { useMedia } from '../../../util/useMedia'
import { PaymentMethod, Stripe } from '@kyuzan/mint-sdk-js'
import { CloseButton } from '../../atoms/CloseButton'
import { ModalWrap } from '../../atoms/ModalWrap'
import { Elements } from "@stripe/react-stripe-js";

type Props = {
  isOpen: boolean
  itemName: string
  itemTradeType: PaymentMethod
  endAt: Date
  price: number
  unit: string
  media: { url: string; mimeType: string } | undefined
  closeModal: () => void
  loading: boolean
  doBuy: (inJapan: boolean) => void
  isValidationError?: boolean
  errorText?: string
  stripePaymentInfo: null | {
    paymentIntentClientSecret: string
    stripe: Stripe | null
  }
}

export const SaleActionModalWithStripe: React.VFC<Props> = ({
  closeModal,
  isOpen,
  loading,
  unit,
  doBuy,
  media,
  endAt,
  price,
  isValidationError,
  itemName,
  itemTradeType,
  stripePaymentInfo,
}) => {
  const isMobile = useMedia().isMobile
  const [inJapan, setInJapan] = useState(false)
  const appearance = {
    theme: 'stripe',
  } as const

  return (
    <ModalWrap isOpen={isOpen}>
      <ModalContainer>
        <Content>
          <Left>
            <MediaContainer>
              <MediaContent media={media} height={254} />
            </MediaContainer>
            <InfoContainer>
              <ItemName>{itemName}</ItemName>
              <ModalStatusDetail
                endAt={endAt}
                price={price}
                unit={unit}
                tradeType={itemTradeType}
              ></ModalStatusDetail>
            </InfoContainer>
          </Left>
          <Right>
            <>
              <ContentTitle>購入を確定する</ContentTitle>
              <InputPriceContainer>
                <InputUnit>
                  {price} {unit}
                </InputUnit>
              </InputPriceContainer>
              <CheckInJapanContainer>
                <label>
                  <input
                    type={'checkbox'}
                    checked={inJapan}
                    onChange={(e) => setInJapan(e.target.checked)}
                  />{' '}
                  私は日本に在住しています
                  <ToolTip
                    description={
                      '入札される方が日本在住の場合、管理者が消費税をお支払いします'
                    }
                  >
                    <NotFoundIcon>
                      <Image
                        src={'/images/icons/help.svg'}
                        layout={'fixed'}
                        width={16}
                        height={16}
                      />
                    </NotFoundIcon>
                  </ToolTip>
                </label>
              </CheckInJapanContainer>
              <ContentButtonContainer>
                {stripePaymentInfo === null ? (
                  !isValidationError && (
                    <BidButton
                      label={loading ? '取引処理中です' : '購入'}
                      isLoading={loading}
                      onClick={() => doBuy(inJapan)}
                      type={'button'}
                    />
                  )
                ) : (
                  <Elements
                    options={{
                      clientSecret:
                        stripePaymentInfo.paymentIntentClientSecret!,
                      appearance,
                    }}
                    stripe={Promise.resolve(stripePaymentInfo.stripe)}
                  >
                    <CheckoutForm
                      clientSecret={
                        stripePaymentInfo.paymentIntentClientSecret!
                      }
                    />
                  </Elements>
                )}
                <NotFinishedContainer>
                  <ToolTip
                    description={
                      'ブロックチェーンの状況に応じて、数分かかることがあります。'
                    }
                  >
                    <NotFinishedIconText>
                      <NotFinishedIcon>
                        <Image
                          src={'/images/icons/help.svg'}
                          layout={'fixed'}
                          width={16}
                          height={16}
                        />
                      </NotFinishedIcon>
                      <NotFinnishedText>処理が終わらない</NotFinnishedText>
                    </NotFinishedIconText>
                  </ToolTip>
                </NotFinishedContainer>
              </ContentButtonContainer>
            </>
          </Right>
        </Content>
        <CloseButton onClick={closeModal} isMobile={isMobile} />
      </ModalContainer>
    </ModalWrap>
  )
}

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Content = styled.div`
  max-width: 840px;
  max-height: 480px;
  border-radius: 16px;
  overflow: hidden;
  background: ${color.white};
  display: flex;
  box-shadow: 0px 9px 16px rgba(0, 0, 0, 0.04),
    0px 2.01027px 3.57381px rgba(0, 0, 0, 0.0238443),
    0px 0.598509px 1.06402px rgba(0, 0, 0, 0.0161557);
  ${media.sp`
    flex-direction:column;
    min-width:320px;
    max-height: fit-content;
  `}
`

const Left = styled.div`
  position: relative;
  flex-basis: 50%;
  background-color: ${color.background.bague};
  /* max-width: 600px; */
  ${media.sp`
    /* min-height: 320px; */
  `}
`

const MediaContainer = styled.div`
  margin: 0 auto;
  padding: 32px;
  width: 100%;
  height: 100%;
  img,
  video {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  ${media.sp`
    padding:0;
    width:100%;
    height:320px;
    img, video{
      width: 100%;
      height:100%;
      object-fit:cover;
    }
  `}
`

const InfoContainer = styled.div`
  position: absolute;
  left: 24px;
  right: 24px;
  bottom: 32px;
  top: auto;
  background-color: rgba(255, 255, 255, 0.82);
  /* backdrop-filter: blur(32px); */
  border-radius: 8px;
  padding: 16px;
  margin-top: 8px;
  box-shadow: 0px 9px 16px rgba(0, 0, 0, 0.06),
    0px 2.01027px 3.57381px rgba(0, 0, 0, 0.03),
    0px 0.598509px 1.06402px rgba(0, 0, 0, 0.0161557);
  ${media.sp`
    left:16px;
    right:16px;
    bottom:16px;
  `}
`

const ItemName = styled.p`
  ${font.mont.subtitle1}
  margin-bottom: 16px;
`
const ModalStatusDetail = styled(StatusDetail)`
  .value {
    ${font.mont.h4}
  }
`
const Right = styled.div`
  flex-basis: 50%;
  padding: 40px;
  /* width: 440px; */
  overflow: auto;
  ${media.sp`
    padding:16px 24px 32px;
  `}
`

const ContentTitle = styled.p`
  ${font.mont.h2};
  ${media.sp`
    ${font.mont.h3};
  `}
`

const InputPriceContainer = styled.div`
  width: 100%;
  margin: 32px 0 0 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  ${media.sp`
    margin:16px 0 0 0;
  `}
`

const InputUnit = styled.span`
  color: ${color.primary};
  ${font.mont.h2}
  margin-left: 4px;
  ${media.sp`
    ${font.mont.h3}
  `}
`

const ContentButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 32px 0 0 0;
`
const BidButton = styled(PrimaryButton)`
  width: 100%;
`

const NotFoundIcon = styled.span`
  margin-left: 4px;
  height: 16px;
  width: 16px;
`

const CheckInJapanContainer = styled.div`
  margin-top: 8px;
`

const NotFinishedContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
  width: 100%;
`

const NotFinishedIconText = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
`

const NotFinishedIcon = styled.div`
  margin-right: 4px;
  line-height: 1;
  height: 16px;
  width: 16px;
`

const NotFinnishedText = styled.div`
  color: ${color.content.middle};
  ${font.mont.caption};
  text-decoration: underline;
  line-height: 1;
`
