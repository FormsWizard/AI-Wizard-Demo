import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DraggableComponent } from './WizardSlice'
import { RootState } from '../../app/store'

export type TemplateState = {
  templates: DraggableComponent[]
}

const initialState: TemplateState = {
  templates: [],
}

export const selectTemplates = (state: RootState) => state.template.templates
export const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {
    restoreTemplates: (state: TemplateState, action: PayloadAction<{ templates: DraggableComponent[] }>) => {
      const { templates } = action.payload
      state.templates = templates
    },
    addTemplate: (state: TemplateState, action: PayloadAction<{ element: DraggableComponent }>) => {
      const { element } = action.payload
      // @ts-ignore
      state.templates = [...state.templates, element]
    },
    removeTemplate: (state: TemplateState, action: PayloadAction<{ element: DraggableComponent }>) => {
      const { element } = action.payload
      // @ts-ignore
      state.templates = state.templates.filter((template) => template.name !== element.name)
    },
  },
})

export const { addTemplate, removeTemplate, restoreTemplates } = templateSlice.actions

export default templateSlice.reducer
