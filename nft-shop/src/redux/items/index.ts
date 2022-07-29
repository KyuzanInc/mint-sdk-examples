import { Item } from '@kyuzan/mint-sdk-js'
import { PaginationMetadata } from '@kyuzan/mint-sdk-js/lib/apiClient'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getSdk } from '../../sdk'

export type ItemsState = {
  data: {
    live: {
      data: Item[]
      meta: PaginationMetadata | null
    }
    ended: {
      data: Item[]
      meta: PaginationMetadata | null
    }
  }
  meta: {
    waitingItemAction: boolean
    initialized: boolean
    error: string | undefined
  }
}

export const initialItemsState: ItemsState = {
  data: {
    live: {
      data: [],
      meta: null
    },
    ended: {
      data: [],
      meta: null
    },
  },
  meta: {
    waitingItemAction: false,
    error: undefined,
    initialized: false,
  },
}

// AsyncAction

export const getItemsActionCreator = createAsyncThunk<
  {
    live: {
      data: Item[]
      meta: PaginationMetadata | null
    }
    ended: {
      data: Item[]
      meta: PaginationMetadata | null
    }
  },
  void,
  {
    rejectValue: string
  }
>('app/items/get', async (_, thunkApi) => {
  try {
    if (process.env.USE_SDK_GET_ITEM_V2 === "true") {
      return {
        live: await getSdk().getItemsV2({
          page: 1,
          perPage: 100,
          saleStatus: 'onSale',
        }),
        ended: await getSdk().getItemsV2({
          page: 1,
          perPage: 100,
          saleStatus: 'end',
        }),
      }
    }

    return {
      live: {
        data: await getSdk().getItems({
          page: 1,
          perPage: 100,
        }),
        meta: null,
      },
      ended: {
        data: await getSdk().getItems({
          page: 1,
          perPage: 100,
          saleStatus: 'afterEnd'
        }),
        meta: null,
      },
    }
  } catch (err) {
    console.error(err)
    return thunkApi.rejectWithValue('Itemを取得できませんでした')
  }
})

// slice

export const itemsSlice = createSlice({
  name: 'items',
  initialState: initialItemsState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getItemsActionCreator.pending, (state) => {
      state.meta.waitingItemAction = true
    })
    builder.addCase(getItemsActionCreator.fulfilled, (state, { payload }) => {
      state.data = {
        live: payload.live,
        ended: payload.ended,
      }
      state.meta.waitingItemAction = false
    })
    builder.addCase(getItemsActionCreator.rejected, (state, { payload }) => {
      state.meta.error = payload
      state.meta.waitingItemAction = false
    })
  },
})
