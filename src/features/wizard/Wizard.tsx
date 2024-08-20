import React, { useCallback, useEffect, useState } from 'react'
import { JsonFormsCore } from '@jsonforms/core'
import { materialCells, materialRenderers } from '@jsonforms/material-renderers'
import { useAppDispatch, useAppSelector } from '../../app/hooks/reduxHooks'
import { selectEditMode, selectJsonSchema, selectUiSchema } from './WizardSlice'
import { Box } from '@mui/system'
import MainAppBar from '../home/AppBar'
import { JsonForms } from '@jsonforms/react'
import VerticalLayoutWithDropZoneRenderer, {
  verticalLayoutTester,
} from '../../renderer/VerticalLayoutWithDropZoneRenderer'
import { horizontalLayoutTester } from '../../renderer/HorizontalLayoutWithDropZoneRenderer'
import HorizontalLayoutWithDropZoneRenderer from '../../renderer/HorizontalLayoutWithDropZoneRenderer'
import RightDrawer from '../home/RightDrawer'
import LeftDrawer from '../home/LeftDrawer'
import { Backdrop, CircularProgress, TextField } from '@mui/material'
import { model } from '../../utils/openai'
import Button from '@mui/material/Button'
import { selectCurrentForm, selectFormData, setAvatar, setData, setTitle } from './FormDataSlice'

import { useAI } from '../../app/hooks/aiContext'
import { OpenAI } from 'openai'

import { parseAIGeneratedJSON } from '../../utils/parseAIGeneratedJSON'

const renderers = [
  ...materialRenderers,
  {
    tester: verticalLayoutTester,
    renderer: VerticalLayoutWithDropZoneRenderer,
  },
  {
    tester: horizontalLayoutTester,
    renderer: HorizontalLayoutWithDropZoneRenderer,
  },
]

function Wizard() {
  const data = useAppSelector(selectFormData)
  const { avatar } = useAppSelector(selectCurrentForm)
  const [inProgress, setInProgress] = useState(false)
  const jsonSchema = useAppSelector(selectJsonSchema)
  const dispatch = useAppDispatch()
  const handleFormChange = useCallback(
    (state: Pick<JsonFormsCore, 'data' | 'errors'>) => {
      dispatch(setData(state.data))
    },
    [dispatch]
  )
  const [error, setError] = useState<string | undefined>()
  const [additionalHints, setAdditionalHints] = useState<string>('')
  const uiSchema = useAppSelector(selectUiSchema)
  const editMode = useAppSelector(selectEditMode)
  const [imageURL, setImageURL] = useState('')
  const { openAIInstance } = useAI()

  useEffect(() => {
    if (avatar && avatar.length > 0) {
      setImageURL(avatar)
    }
  }, [setImageURL, avatar])

  const getTitleOfData = useCallback(
    async (d: any) => {
      let client: OpenAI | null = openAIInstance
      if (!client) return
      console.log('getTitleOfData', d)
      const response = await client.chat.completions.create({
        model: model,
        messages: [
          {
            role: 'user',
            content: `give a good summarizing title of the following data: \n ${JSON.stringify(d, null, 2)}`,
          },
        ],
        max_tokens: 300,
      })
      console.log(response)
      // Append AI message.
      const res = response.choices[0].message.content
      typeof res === 'string' && dispatch(setTitle(res.replace('"', '')))
    },
    [dispatch, openAIInstance, setTitle]
  )

  const fillData = useCallback(async () => {
    let client: OpenAI | null = openAIInstance
    if (!client) return
    setInProgress(true)
    const response = await client.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Try to analyze the image for information. Do not improvise but only include data that can be derived from the image. Try to fit the information to the fields of the following JSON-schema and deliver the ready to use JSON without any extra information or markup. ${
                additionalHints ? `Also follow additional demands - ${additionalHints}. ` : ''
              } Produced result must comply to the given JSON-Schema: \n ${JSON.stringify(jsonSchema, null, 2)}`,
            },
            {
              type: 'image_url',
              image_url: {
                url: imageURL,
              },
            },
          ],
        },
      ],
      max_tokens: 4096,
    })
    console.log(response)
    // Append AI message.
    const res = response.choices[0].message.content
    const d = parseAIGeneratedJSON(res)
    if (d) {
      dispatch(setData(d))
      dispatch(setAvatar(imageURL))
      await getTitleOfData(d)
    } else {
      setError('Could not parse JSON')
    }
    setInProgress(false)
    //setResponse(res)
  }, [jsonSchema, dispatch, imageURL, getTitleOfData, setInProgress, openAIInstance, additionalHints])
  return (
    <Box component={'main'} sx={{ display: 'flex', flexGrow: 1, p: 3, mt: 8 }}>
      <MainAppBar></MainAppBar>
      <LeftDrawer></LeftDrawer>
      <Box>
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={inProgress}>
          <CircularProgress color="inherit" />
        </Backdrop>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <TextField value={imageURL} onChange={(e) => setImageURL(e.target.value)} label={'Bild URL'} />
        <TextField
          value={additionalHints}
          onChange={(e) => setAdditionalHints(e.target.value)}
          label={'weitere Hinweise'}
        />
        <Button onClick={fillData} disabled={!openAIInstance}>
          analysiere Bild und befülle Formular
        </Button>
        <JsonForms
          data={data}
          renderers={renderers}
          cells={materialCells}
          onChange={handleFormChange}
          schema={jsonSchema}
          uischema={uiSchema}
          readonly={editMode}
        />
      </Box>
      <RightDrawer></RightDrawer>
    </Box>
  )
}

export default Wizard
