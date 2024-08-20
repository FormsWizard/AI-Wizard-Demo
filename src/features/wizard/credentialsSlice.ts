import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'

export type Credentials = {
  apiKey: string
  organization: string
}

export type CredentialsReducer = {
  credentials: Credentials
}

const initialCredentials: Credentials = {
  apiKey: '',
  organization: '',
}

export const selectApiKey = (state: RootState) => state.credentials.credentials.apiKey

export const selectOrganization = (state: RootState) => state.credentials.credentials.organization

export const credentialsSlice = createSlice({
  name: 'credentials',
  initialState: {
    credentials: initialCredentials,
  } as CredentialsReducer,
  reducers: {
    onCredentialChange: (state: CredentialsReducer, action: PayloadAction<Credentials>) => {
      state.credentials = action.payload
    },
  },
})

export const { onCredentialChange } = credentialsSlice.actions
export const credentialsReducer = credentialsSlice.reducer
