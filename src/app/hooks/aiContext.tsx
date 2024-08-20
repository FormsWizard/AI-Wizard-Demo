import { OpenAI } from 'openai'
import React, { useEffect } from 'react'
import { useAppSelector } from './reduxHooks'
import { selectApiKey, selectOrganization } from '../../features/wizard/credentialsSlice'
import NiceModal from '@ebay/nice-modal-react'
import { OpenAIKeyModal } from '../../features/modals/OpenAIKeyModal'

type AIContextType = {
  openAIInstance?: OpenAI
}

export const AIContext = React.createContext<AIContextType>({})

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const organizationStore = useAppSelector(selectOrganization)
  const apiKeyStore = useAppSelector(selectApiKey)
  const organization = process.env.REACT_APP_OPENAI_ORGANIZATION || organizationStore
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY || apiKeyStore
  const [openAIInstance, setOpenAIInstance] = React.useState<OpenAI | undefined>(undefined)
  useEffect(() => {
    if (organization && apiKey && organization !== '' && apiKey !== '') {
      setOpenAIInstance(
        new OpenAI({
          dangerouslyAllowBrowser: true,
          organization,
          apiKey,
        })
      )
    }
  }, [organization, apiKey, setOpenAIInstance])
  useEffect(() => {
    if (!openAIInstance) {
      NiceModal.show(OpenAIKeyModal, { onConfirm: (instance) => setOpenAIInstance(instance), onReject: () => {} })
    }
  }, [openAIInstance, setOpenAIInstance])
  return <AIContext.Provider value={{ openAIInstance }}>{children}</AIContext.Provider>
}

export const useAI = () => React.useContext(AIContext)
