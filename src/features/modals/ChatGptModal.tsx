import React, { useCallback, useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'

import NiceModal, { useModal } from '@ebay/nice-modal-react'

import { FormattedMessage } from 'react-intl'
import { TransitionProps } from '@mui/material/transitions'
import { model } from '../../utils/openai'
import { Backdrop, CircularProgress, Grid, Tab, TextField } from '@mui/material'
import { useAppDispatch } from '../../app/hooks/reduxHooks'
import { addTemplate } from '../wizard/TemplateSlice'
import { generateDefaultUISchema } from '@jsonforms/core'
import { updateScopeOfUISchemaElement } from '../../utils/uiSchemaHelpers'
import { DraggableComponent } from '../wizard/WizardSlice'
import Box from '@mui/material/Box'
import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab'
import DropTargetFormsPreview from '../dragAndDrop/DropTargetFormsPreview'
import Vocal from '@untemps/react-vocal'
import { AndroidRounded } from '@mui/icons-material'
import { useAI } from '../../app/hooks/aiContext'

interface ConfirmModalProps {
  onConfirm?: () => void
  onReject?: () => void
  confirmButtonTextID?: string
  cancelButtonTextID?: string
  modalBodyTextID?: string
  modalHeaderTextID?: string
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

const ChatGptModal = NiceModal.create<ConfirmModalProps>(({ onConfirm = () => null, onReject = () => null }) => {
  const modal = useModal()
  const [response, setResponse] = useState('')
  const [formTitle, setFormTitle] = useState('AI-generated form')
  const [message, setMessage] = useState('')
  const [newElement, setNewElement] = useState<DraggableComponent | undefined>(undefined)
  const dispatch = useAppDispatch()
  const [activeTab, setActiveTab] = useState('2')
  const [loading, setLoading] = useState(false)
  const { openAIInstance } = useAI()
  const onVocalResult = useCallback(
    (result) => {
      setMessage((msg) => `${msg} ${result}`)
    },
    [setMessage]
  )

  useEffect(() => {
    try {
      let jsonSchema = JSON.parse(response)
      const element = {
        name: formTitle,
        jsonSchemaElement: jsonSchema,
        uiSchema: {
          type: 'Group',
          //@ts-ignore
          label: formTitle,
          elements: [generateDefaultUISchema(jsonSchema)],
        },
      }
      setNewElement(element)
    } catch (e) {
      console.error(e)
    }
  }, [response, formTitle])

  const talkToAI = useCallback(
    async (text) => {
      // Insert message at first element.
      let client = openAIInstance
      if (!client) return

      setLoading(true)
      const response = await client.chat.completions.create({
        model: model,
        messages: [
          {
            role: 'user',
            content: `For a form generate a JSONSchema that meets the following requirements: ${text} \n Only output the parsable JSON Schema - even without the typical markdown code block. Keys und properties should always be in english but labels/titles should be in the language of the requirements text. Add additional fields, that can be derived from your domain knowledge, even if not explicitly asked for.`,
          },
        ],
        max_tokens: 4000,
      })
      console.log(response)
      // Append AI message.
      const res = response.choices[0].message.content
      res && setResponse(res)
      if (!res) return
      let formTitle: string | null = null
      try {
        const schema = JSON.parse(res)
        if (typeof schema.title === 'string') {
          formTitle = schema.title
        }
      } catch (e) {
        console.warn('Could not parse JSON Schema title', e)
      }
      if (!formTitle) {
        const titleResponse = await client.chat.completions.create({
          model: model,
          messages: [
            { role: 'user', content: `A short headline or title that summarizes the following form: ${text}` },
          ],
          max_tokens: 50,
        })
        formTitle = titleResponse.choices[0].message.content
      }

      formTitle && setFormTitle(formTitle)
      setLoading(false)
    },
    [setResponse, setFormTitle, setLoading, openAIInstance]
  )
  const onSubmit = useCallback(
    (event) => {
      talkToAI(message)
    },
    [talkToAI, message, setLoading]
  )

  const handleAgree = useCallback(() => {
    if (newElement)
      dispatch(
        addTemplate({
          element: newElement,
        })
      )
    modal.hide()
    onConfirm()
  }, [modal, onConfirm, newElement, dispatch])
  const handleDisagree = () => {
    modal.hide()
    onReject()
  }
  const handleChange = useCallback(
    (event, newValue) => {
      setActiveTab(newValue)
    },
    [setActiveTab]
  )
  return (
    <Dialog
      TransitionComponent={Transition}
      open={modal.visible}
      onClose={() => modal.hide()}
      fullWidth
      TransitionProps={{
        onExited: () => modal.remove(),
      }}
    >
      <DialogTitle id="alert-dialog-slide-title">
        <FormattedMessage
          description="Chat GPT form generator"
          defaultMessage="Your form should be about:"
          id="ChatGPTModal_title"
        ></FormattedMessage>
      </DialogTitle>
      <DialogContent>
        <Grid container direction={'column'}>
          <Grid item>
            <TextField multiline fullWidth value={message} onChange={(e) => setMessage(e.target.value)} />
            <Vocal
              lang={'de-DE'}
              onResult={onVocalResult}
              style={{ width: 16, position: 'absolute', right: 10, top: -2 }}
            />
          </Grid>
          <LoadingButton loading={loading} onClick={onSubmit}>
            Submit
          </LoadingButton>
          <TabContext value={activeTab}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="Form" value="1" />
                <Tab label="Preview" value="2" disabled={!newElement} />
              </TabList>
            </Box>
            <TabPanel value="1" sx={{ p: 0 }}>
              <TextField
                multiline
                fullWidth
                label={formTitle}
                value={response}
                onChange={(e) => setResponse(e.target.value)}
              />
            </TabPanel>
            <TabPanel value="2" sx={{ p: 0 }}>
              {newElement && <DropTargetFormsPreview metadata={newElement} topLevelUISchema />}
            </TabPanel>
          </TabContext>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAgree} color="primary">
          <FormattedMessage description="confirm modal header" defaultMessage="agree" id="agree"></FormattedMessage>
        </Button>
        <Button onClick={handleDisagree} color="primary">
          <FormattedMessage description="cancel modal header" defaultMessage="cancel" id="cancel"></FormattedMessage>
        </Button>
      </DialogActions>
    </Dialog>
  )
})

export function ConfirmButton({
  onConfirm = () => null,
  onReject = () => null,
  children,
  ...props
}: ConfirmModalProps & { children: React.ReactNode }) {
  const { openAIInstance } = useAI()
  return (
    <Button
      startIcon={<AndroidRounded />}
      variant={'contained'}
      disabled={!openAIInstance}
      onClick={() =>
        NiceModal.show(ChatGptModal, {
          onConfirm,
          onReject,
        })
      }
      {...props}
    >
      {children}
    </Button>
  )
}

export default ChatGptModal
