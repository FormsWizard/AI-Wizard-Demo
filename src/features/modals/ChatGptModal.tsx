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
import openaiInstance, { model } from '../../utils/openai'
import { Grid, Tab, TextField } from '@mui/material'
import { useAppDispatch } from '../../app/hooks/reduxHooks'
import { addTemplate } from '../wizard/TemplateSlice'
import { generateDefaultUISchema } from '@jsonforms/core'
import { updateScopeOfUISchemaElement } from '../../utils/uiSchemaHelpers'
import { DraggableComponent } from '../wizard/WizardSlice'
import Box from '@mui/material/Box'
import {LoadingButton, TabContext, TabList, TabPanel} from '@mui/lab'
import DropTargetFormsPreview from '../dragAndDrop/DropTargetFormsPreview'
import Vocal from '@untemps/react-vocal'


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

const ChatGptModal = NiceModal.create<ConfirmModalProps>(
  ({
    onConfirm = () => null,
    onReject = () => null,
    confirmButtonTextID,
    cancelButtonTextID,
    modalBodyTextID,
    modalHeaderTextID,
  }) => {
    const modal = useModal()
    const [response, setResponse] = useState('')
    const [formTitle, setFormTitle] = useState('AI-generated form')
    const [message, setMessage] = useState('')
    const [newElement, setNewElement] = useState<DraggableComponent | undefined>(undefined)
    const dispatch = useAppDispatch()
    const [activeTab, setActiveTab] = useState('2')
    const [loading, setLoading] = useState(false);
    const onVocalResult = useCallback( (result) => {
      setMessage(msg => `${msg} ${result}`)
    }, [setMessage])

    useEffect(() => {
      try {
        let jsonSchema = JSON.parse(response)
        const element = {
          name: formTitle,
          jsonSchemaElement: jsonSchema,
          uiSchema: updateScopeOfUISchemaElement('#', `#/properties/${formTitle}`, {
            type: 'Group',
            //@ts-ignore
            label: formTitle,
            elements: [generateDefaultUISchema(jsonSchema)],
          }),
        }
        setNewElement(element)
      } catch (e) {
        console.error(e)
      }
    }, [response, formTitle])

    const talkToAI = useCallback(
      async (text) => {
        // Insert message at first element.
        const response = await openaiInstance.createCompletion({
          model: model,
          prompt: `For a form generate a JSONSchema that meets the following requirements: ${text}`,
          max_tokens: 600,
        })
        console.log(response.data)
        // Append AI message.
        setResponse(response.data.choices[0].text)
        const titleResponse = await openaiInstance.createCompletion({
          model: model,
          prompt: `The headline or title that summarizes the following form: ${text}`,
          max_tokens: 50,
        })
        setFormTitle(titleResponse.data.choices[0].text)
        setLoading(false)
      },
      [setResponse, setFormTitle, setLoading]
    )
    const onSubmit = useCallback(
      (event) => {
        setLoading(true)
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
            id={modalHeaderTextID}
          ></FormattedMessage>
        </DialogTitle>
        <DialogContent>
          <Grid container direction={'column'}>
            <Grid item>
              <TextField multiline fullWidth value={message} onChange={(e) => setMessage(e.target.value)} />
              <Vocal
                  onResult={onVocalResult}
                  style={{ width: 16, position: 'absolute', right: 10, top: -2 }}
              />
            </Grid>
            <LoadingButton loading={loading} onClick={onSubmit}>Submit</LoadingButton>
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
                {newElement && <DropTargetFormsPreview metadata={newElement} />}
              </TabPanel>
            </TabContext>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDisagree} color="primary">
            <FormattedMessage
              description="confirm modal header"
              defaultMessage="cancel"
              id={cancelButtonTextID}
            ></FormattedMessage>
          </Button>
          <Button onClick={handleAgree} color="warning" variant="contained">
            <FormattedMessage
              description="confirm modal header"
              defaultMessage="continue"
              id={confirmButtonTextID}
            ></FormattedMessage>
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
)

export function ConfirmButton({
  onConfirm = () => null,
  onReject = () => null,
  confirmButtonTextID = 'confirmModal_confirmButton',
  cancelButtonTextID = 'confirmModal_cancelButton',
  modalBodyTextID = 'confirmModal_bodyText',
  modalHeaderTextID = 'confirmModal_headerText',
  children,
  ...props
}: ConfirmModalProps & { children: React.ReactNode }) {
  return (
    <Button
      onClick={() =>
        NiceModal.show(ChatGptModal, {
          onConfirm,
          onReject,
          confirmButtonTextID,
          cancelButtonTextID,
          modalBodyTextID,
          modalHeaderTextID,
        })
      }
      {...props}
    >
      {children}
    </Button>
  )
}

function confirmHandler({
  onConfirm,
  onReject,
  confirmButtonTextID = 'confirmModal_confirmButton',
  cancelButtonTextID = 'confirmModal_cancelButton',
  modalBodyTextID = 'confirmModal_bodyText',
  modalHeaderTextID = 'confirmModal_headerText',
}: ConfirmModalProps) {
  NiceModal.show(ChatGptModal, {
    onConfirm,
    onReject,
    confirmButtonTextID,
    cancelButtonTextID,
    modalBodyTextID,
    modalHeaderTextID,
  })
}

export default ChatGptModal
