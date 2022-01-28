import { ContractERC721 } from '@kyuzan/mint-sdk-js'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getSdk } from '../../sdk'

export type ContractERC721sState = {
  // key is contractERC721Id
  data: Record<string, ContractERC721>
  meta: {
    loading: Record<string, boolean>
    error: string | undefined
  }
}

export const initialContractERC721State: ContractERC721sState = {
  data: {},
  meta: {
    error: undefined,
    loading: {},
  },
}

// AsyncAction
export const getContractERC721sActionCreator = createAsyncThunk<
  ContractERC721,
  { contractERC721Id: string },
  {
    rejectValue: string
  }
>('app/accountInfo/get', async (arg, thunkApi) => {
  try {
    return await getSdk().getContractERC721ById({
      contractId: arg.contractERC721Id,
    })
  } catch (err) {
    console.error(err)
    return thunkApi.rejectWithValue(`情報を取得できませんでした`)
  }
})

// Slice
export const contractERC721sSlice = createSlice({
  name: 'contractERC721s',
  initialState: initialContractERC721State,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getContractERC721sActionCreator.pending,
      (state, payload) => {
        state.meta.loading[payload.meta.arg.contractERC721Id] = true
      }
    )
    builder.addCase(
      getContractERC721sActionCreator.rejected,
      (state, payload) => {
        state.meta.error = payload.error.message
        state.meta.loading[payload.meta.arg.contractERC721Id] = false
      }
    )

    builder.addCase(
      getContractERC721sActionCreator.fulfilled,
      (state, payload) => {
        state.meta.loading[payload.meta.arg.contractERC721Id] = false
        state.data[payload.meta.arg.contractERC721Id] = payload.payload
      }
    )
  },
})
