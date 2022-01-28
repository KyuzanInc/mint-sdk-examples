import styled from '@emotion/styled'
import React, { FormEventHandler, useState } from 'react'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { PrimaryButton } from '../../atoms/PrimaryButton'
import { color, font, media } from '../../../style'

type Props = {
  clientSecret: string
  walletAddress: string
  onSuccess: () => void
}

// ref: https://stripe.com/docs/payments/payment-element/migration?html-or-react=react

const CardForm: React.VFC<Props> = (arg) => {
  const stripe = useStripe()
  const elements = useElements()
  const [errorMessage, setErrorMessage] = useState<undefined | string>(
    undefined
  )
  const [submitting, setSubmitting] = useState<boolean>(false)
  const options = {
    style: {
      base: {
        color: color.primary,
      },
      invalid: {
        color: color.utils.error,
      },
    },
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    if (!stripe || !elements) {
      return
    }
    setSubmitting(true)
    const result = await stripe.confirmCardPayment(arg.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
        billing_details: {
          name: arg.walletAddress,
        },
      },
    })

    if (result.error) {
      setErrorMessage(result.error.message)
    } else {
      if (result.paymentIntent.status === 'requires_capture') {
        setSubmitting(false)
        arg.onSuccess()
      }
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <label>
        カード情報
        <CardElement options={options} />
      </label>
      <SubmitButton
        label={'支払いを行う'}
        type="submit"
        disabled={!stripe}
        isLoading={submitting}
      />
      {errorMessage && (
        <ErrorMessage>
          {errorMessage} 再読み込みしてお試しください。
        </ErrorMessage>
      )}
    </Form>
  )
}

export default CardForm

const Form = styled.form`
  width: 100%;

  /* stripe */
  input,
  .StripeElement {
    display: block;
    margin: 10px 0 20px 0;
    max-width: 500px;
    padding: 10px 14px;
    font-size: 1em;
    font-family: 'Source Code Pro', monospace;
    box-shadow: rgba(50, 50, 93, 0.14902) 0px 1px 3px,
      rgba(0, 0, 0, 0.0196078) 0px 1px 0px;
    border: 0;
    outline: 0;
    border-radius: 4px;
    background: white;
  }

  input::placeholder {
    color: #aab7c4;
  }

  input:focus,
  .StripeElement--focus {
    box-shadow: rgba(50, 50, 93, 0.109804) 0px 4px 6px,
      rgba(0, 0, 0, 0.0784314) 0px 1px 3px;
    -webkit-transition: all 150ms ease;
    transition: all 150ms ease;
  }

  .StripeElement.IdealBankElement,
  .StripeElement.FpxBankElement,
  .StripeElement.PaymentRequestButton {
    padding: 0;
  }

  .StripeElement.PaymentRequestButton {
    height: 40px;
  }
`

const SubmitButton = styled(PrimaryButton)`
  width: 100%;
`

const ErrorMessage = styled.p`
  color: ${color.utils.error};
  ${font.mont.label}
  margin-top: 8px;
  ${media.sp`
    ${font.mont.label}
  `}
`

// export default function CheckoutForm({ clientSecret }) {
//     const stripe = useStripe()
//     const elements = useElements()
//     const [message, setMessage] = useState(null)
//     const [isLoading, setIsLoading] = useState(false)

//     useEffect(() => {
//         if (!stripe) {
//             return
//         }

//         if (!clientSecret) {
//             return
//         }

//         stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
//             switch (paymentIntent.status) {
//                 case "succeeded":
//                     setMessage("Payment succeeded!")
//                     break
//                 case "processing":
//                     setMessage("Your payment is processing.")
//                     break
//                 case "requires_payment_method":
//                     setMessage("Your payment was not successful, please try again.")
//                     break
//                 default:
//                     setMessage("Something went wrong.")
//                     break
//             }
//         })
//     }, [stripe, clientSecret])

//     const handleSubmit = async (e) => {
//         e.preventDefault()

//         if (!stripe || !elements) {
//             // Stripe.js has not yet loaded.
//             // Make sure to disable form submission until Stripe.js has loaded.
//             return
//         }

//         setIsLoading(true)

//         const { error } = await stripe.confirmPayment(elements)
//         // TODO:

//         // This point will only be reached if there is an immediate error when
//         // confirming the payment. Otherwise, your customer will be redirected to
//         // your `return_url`. For some payment methods like iDEAL, your customer will
//         // be redirected to an intermediate site first to authorize the payment, then
//         // redirected to the `return_url`.
//         if (error.type === "card_error" || error.type === "validation_error") {
//             setMessage(error.message)
//         } else {
//             setMessage("An unexpected error occured.")
//         }

//         setIsLoading(false)
//     }

//     return (
//         <form id="payment-form" onSubmit={handleSubmit}>
//             <PaymentElement id="payment-element" />
//             <button disabled={isLoading || !stripe || !elements} id="submit">
//                 <span id="button-text">
//                     {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
//                 </span>
//             </button>
//             {/* Show any error or success messages */}
//             {message && <div id="payment-message">{message}</div>}
//         </form>
//     )
// }
