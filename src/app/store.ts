import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import counterReducer from '../features/counter/counterSlice'
import jsonFormsEditReducer from '../features/wizard/WizardSlice'
import templateSlice from '../features/wizard/TemplateSlice'
import storage from 'redux-persist/lib/storage'
import { formsDataReducer } from '../features/wizard/FormDataSlice' // defaults to localStorage for web
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    jsonFormsEdit: jsonFormsEditReducer,
    template: persistReducer(
      {
        key: 'template',
        storage,
      },
      templateSlice
    ),
    formsData: persistReducer(
      {
        key: 'formsData',
        storage,
      },
      formsDataReducer
    ),
  },
})
export const persistor = persistStore(store)

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
