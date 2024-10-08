import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { persistor, store } from './app/store'
import App from './App'
import { HashRouter } from 'react-router-dom'
import './index.css'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import NiceModal from '@ebay/nice-modal-react'
import { IntlProvider } from 'react-intl'
import { TouchBackend } from 'react-dnd-touch-backend'
import reportWebVitals from './reportWebVitals'
import { PersistGate } from 'redux-persist/integration/react'
import { AIProvider } from './app/hooks/aiContext'
const container = document.getElementById('root')!
const root = createRoot(container)
console.log('APP running in touch mode: ' + isTouchDevice())
const backend = isTouchDevice() ? TouchBackend : HTML5Backend
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <ThemeProvider theme={theme}>
          <AIProvider>
            <DndProvider backend={backend}>
              <IntlProvider messages={{}} locale="de" defaultLocale="en">
                <NiceModal.Provider>
                  <HashRouter>
                    <App />
                  </HashRouter>
                </NiceModal.Provider>
              </IntlProvider>
            </DndProvider>
          </AIProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
)

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
reportWebVitals(console.log)
