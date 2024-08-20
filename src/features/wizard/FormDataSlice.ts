import { JsonSchema } from '@jsonforms/core'
import { ScopableUISchemaElement } from '../../types'
import { RootState } from '../../app/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type FormContent = {
  id: string
  title: string
  avatar?: string
  jsonSchema: JsonSchema
  uiSchema: ScopableUISchemaElement | null | undefined
  formData: any
}

export type FormsContentReducer = {
  currentID: string
  formData: Record<string, FormContent>
}

const initialID = '0'

export const selectCurrentID = (state: RootState) => state.formsData.currentID

export const selectFormData = (state: RootState) => state.formsData.formData[state.formsData.currentID]?.formData

export const selectCurrentForm = (state: RootState) => state.formsData.formData[state.formsData.currentID]

export const listFormData = (state: RootState) => Object.values(state.formsData.formData)

export const initialFormState: FormsContentReducer = {
  currentID: initialID,
  formData: {
    [initialID]: {
      id: initialID,
      title: 'Showcase',
      jsonSchema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
        },
      },
      uiSchema: null,
      formData: {
        name: 'Showcase',
      },
    },
  },
}
export const formsContentSlice = createSlice({
  name: 'formsContent',
  initialState: initialFormState,
  reducers: {
    restoreForms: (state: FormsContentReducer, action: PayloadAction<FormsContentReducer>) => {
      state.formData = action.payload.formData
      state.currentID = action.payload.currentID
    },
    setData: (state: FormsContentReducer, action: PayloadAction<any>) => {
      state.formData[state.currentID].formData = action.payload
    },
    removeForm: (state: FormsContentReducer, action: PayloadAction<{ id: string }>) => {
      delete state.formData[action.payload.id]
      if (state.currentID === action.payload.id) {
        state.currentID = Object.keys(state.formData)[0]
      }
    },
    loadForm: (state: FormsContentReducer, action: PayloadAction<{ id: string }>) => {
      state.currentID = action.payload.id
    },
    setTitle: (state: FormsContentReducer, action: PayloadAction<string>) => {
      state.formData[state.currentID].title = action.payload
    },
    setAvatar: (state: FormsContentReducer, action: PayloadAction<string>) => {
      state.formData[state.currentID].avatar = action.payload
    },
    newForm: (state: FormsContentReducer, action: PayloadAction<{ jsonSchema: JsonSchema; uiSchema: any }>) => {
      const newID = new Date().getTime().toString()
      state.formData[newID] = {
        id: newID,
        title: 'New Form',
        jsonSchema: action.payload.jsonSchema,
        uiSchema: action.payload.uiSchema,
        formData: {},
      }
      state.currentID = newID
    },
  },
})

export const { newForm, setData, setAvatar, setTitle, loadForm, removeForm, restoreForms } = formsContentSlice.actions
export const formsDataReducer = formsContentSlice.reducer
