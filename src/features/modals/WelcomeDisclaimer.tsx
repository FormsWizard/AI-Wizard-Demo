import NiceModal, { useModal } from '@ebay/nice-modal-react'
import DialogTitle from '@mui/material/DialogTitle'
import { FormattedMessage } from 'react-intl'
import React, { useCallback, useState } from 'react'
import { Dialog, DialogContent, Grid, TextField, Typography, Button } from '@mui/material'
import { onCredentialChange, selectApiKey, selectOrganization } from '../wizard/credentialsSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks/reduxHooks'
import DialogActions from '@mui/material/DialogActions'
import { OpenAI } from 'openai'
import { DownloadBackupButton } from '../wizard/DownloadBackupButton'
import { UploadBackupButton } from '../wizard/UploadBackupButton'
import { resetStore } from '../../app/store'

type WelcomeDisclaimerProps = {
  onConfirm?: (openAIInstance: OpenAI) => void
  onReject?: () => void
}

export const WelcomeDisclaimer = NiceModal.create<WelcomeDisclaimerProps>(({ onConfirm, onReject }) => {
  const modal = useModal()
  const organization = useAppSelector(selectOrganization)
  const apiKey = useAppSelector(selectApiKey)
  const [organizationTemp, setOrganizationTemp] = useState(organization)
  const [apiKeyTemp, setApiKeyTemp] = useState(apiKey)
  const dispatch = useAppDispatch()
  const handleConfirm = useCallback(() => {
    dispatch(
      onCredentialChange({
        apiKey: apiKeyTemp,
        organization: organizationTemp,
      })
    )
    onConfirm(
      new OpenAI({
        dangerouslyAllowBrowser: true,
        organization: organizationTemp,
        apiKey: apiKeyTemp,
      })
    )
    modal.hide()
  }, [apiKeyTemp, organizationTemp, dispatch])
  return (
    <Dialog open={modal.visible} onClose={() => modal.hide()} fullWidth>
      <DialogTitle>
        <FormattedMessage
          id={'welcome_key_modal_header'}
          description="Forms Wizard AI Showcase"
          defaultMessage="Form Wizard Disclaimer"
        ></FormattedMessage>
      </DialogTitle>
      <DialogContent>
        <Grid container direction={'column'}>
          <Typography variant={'body1'}>
            Daten dieser Demo-Anwendung werden grundsätzlich nur lokal im Local-Storage des Browsers gespeichert und
            können aus dem aktuellen Browser von Ihnen <DownloadBackupButton>heruntergeladen</DownloadBackupButton>,{' '}
            <UploadBackupButton>wiederhergestellt</UploadBackupButton> oder{' '}
            <Button onClick={() => resetStore()}>gelöscht</Button> werden. Wenn Sie die Anwendung jedoch mit OpenAI
            verwenden möchten, müssen Sie Ihre{' '}
            <a href={'https://platform.openai.com/settings/organization/general'} target={'_blank'} rel="noreferrer">
              OpenAI-Organisation
            </a>{' '}
            und Ihren{' '}
            <a href={'https://platform.openai.com/settings/profile?tab=api-keys'} target={'_blank'} rel="noreferrer">
              OpenAI-API-Schlüssel
            </a>{' '}
            eingeben. Bei KI gestützten Anfragen, werden dann Daten an OpenAI gesendet. Die Daten, die an OpenAI
            gesendet werden, können sie im Netzwerk-Tab der Entwicklerwerkzeuge (Strg+Shift+I) einsehen. Ihre
            eingegebenen Daten bleiben grundsätzlich auf Ihrem Gerät und werden nicht an Dritte weitergegeben. Da dies
            eine Demo-Anwendung ist, können wir jedoch keine Garantie für die Sicherheit Ihrer Daten übernehmen.
          </Typography>
          <TextField
            label="Organization"
            variant="outlined"
            fullWidth
            value={organizationTemp}
            onChange={(e) => setOrganizationTemp(e.target.value)}
          />
          <TextField
            label="API Key"
            variant="outlined"
            fullWidth
            type="password"
            value={apiKeyTemp}
            onChange={(e) => setApiKeyTemp(e.target.value)}
          />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirm} color="primary">
          <FormattedMessage description="confirm modal header" defaultMessage="agree" id="agree"></FormattedMessage>
        </Button>
        <Button
          onClick={() => {
            modal.hide()
            onReject()
          }}
          color="primary"
        >
          <FormattedMessage description="cancel modal header" defaultMessage="cancel" id="cancel"></FormattedMessage>
        </Button>
      </DialogActions>
    </Dialog>
  )
})
