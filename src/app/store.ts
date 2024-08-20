import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import counterReducer from '../features/counter/counterSlice'
import jsonFormsEditReducer from '../features/wizard/WizardSlice'
import templateSlice, { restoreTemplates } from '../features/wizard/TemplateSlice'
import storage from 'redux-persist/lib/storage'
import { formsDataReducer, initialFormState, restoreForms } from '../features/wizard/FormDataSlice'
import { credentialsReducer } from '../features/wizard/credentialsSlice' // defaults to localStorage for web
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    jsonFormsEdit: jsonFormsEditReducer,
    credentials: credentialsReducer,
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

export const appVersion = process.env.REACT_APP_VERSION || process.env.REACT_APP_COMMIT || new Date().toISOString()

type StoreBackup = { appVersion: string; store: { template: RootState['template']; formsData: RootState['formsData'] } }
export const downloadBackup: () => string = () => {
  const template = store.getState().template
  const formsData = store.getState().formsData
  const appVersion = process.env.REACT_APP_VERSION || process.env.REACT_APP_COMMIT || new Date().toISOString()
  const backup: StoreBackup = {
    appVersion,
    store: {
      template,
      formsData,
    },
  }
  const blob = new Blob([JSON.stringify(backup)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  return url
}

export const uploadBackup = (backup: StoreBackup) => {
  console.log(
    `uploading backup from App Version: ${backup.appVersion} to current instance of version ${appVersion}`,
    backup
  )
  store.dispatch(restoreTemplates(backup.store.template))
  store.dispatch(restoreForms(backup.store.formsData))
}

export const resetStore = () => {
  store.dispatch(restoreTemplates({ templates: [] }))
  store.dispatch(restoreForms(initialFormState))
}
