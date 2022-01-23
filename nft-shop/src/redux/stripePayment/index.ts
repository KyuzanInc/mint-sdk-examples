import { Stripe } from '@kyuzan/mint-sdk-js'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getSdk } from '../../sdk'

export type StripePaymentState = {
  data: {
    paymentIntentClientSecret: string
    stripe: Stripe | null
  } | null
}

export const initialStripePaymentState: StripePaymentState = {
  data: null
}

// AsyncAction
export const createStripePaymentIntentCreator = createAsyncThunk<
  { paymentIntentClientSecret: string, stripe: Stripe | null },
  { itemId: string; inJapan: boolean, toAddress: string },
  {
    rejectValue: string
  }
>('app/stripePayment/createStripePayment', async ({ itemId, inJapan, toAddress }, thunkApi) => {
  try {
    return await getSdk().createStripePaymentIntent({itemId,toAddress, residence: inJapan ? 'jp' : 'unknown'})
  } catch (err) {
    console.log(err)
    return thunkApi.rejectWithValue('取引に失敗しました')
  }
})

// slice

export const stripePaymentSlice = createSlice({
  name: 'stripePayment',
  initialState: initialStripePaymentState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      createStripePaymentIntentCreator.fulfilled,
      (state, { payload }) => {
        if (payload.stripe !== null){
          state.data = payload
        }
      }
    )
  }
})
