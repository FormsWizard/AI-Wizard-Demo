import React, { useCallback, useState } from 'react'
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
import { TextField } from '@mui/material'
import openAIInstance, { model } from '../../utils/openai'
import Button from '@mui/material/Button'
import { selectFormData, setAvatar, setData, setTitle } from './FormDataSlice'

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
  const jsonSchema = useAppSelector(selectJsonSchema)
  const dispatch = useAppDispatch()
  const handleFormChange = useCallback(
    (state: Pick<JsonFormsCore, 'data' | 'errors'>) => {
      dispatch(setData(state.data))
    },
    [dispatch]
  )
  const uiSchema = useAppSelector(selectUiSchema)
  const editMode = useAppSelector(selectEditMode)
  const [imageURL, setImageURL] = useState('')

  const getTitleOfData = useCallback(async (d: any) => {
    const client = openAIInstance
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
  }, [dispatch])

  const fillData = useCallback(async () => {
    const client = openAIInstance
    const response = await client.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'user',
          content: `Try to analyze the image ${imageURL} for information. Do not improvise but only include data that can be derived from the image. Try to fit the information to the fields of the following JSON-schema and deliver the ready to use JSON without any extra information or markup. Produced result must comply to the given JSON-Schema: \n ${JSON.stringify(
            jsonSchema,
            null,
            2
          )}`,
        },
      ],
      max_tokens: 3000,
    })
    console.log(response)
    // Append AI message.
    const res = response.choices[0].message.content
    try {
      const d = JSON.parse(res.replace('```json', '').replace('```', ''))
      dispatch(setData(d))
      dispatch(setAvatar(imageURL))
      setTimeout(() => getTitleOfData(d), 1000)
    } catch (e) {
      console.warn(e)
    }
    //setResponse(res)
  }, [jsonSchema, dispatch, imageURL, getTitleOfData])
  return (
    <Box component={'main'} sx={{ display: 'flex', flexGrow: 1, p: 3, mt: 8 }}>
      <MainAppBar></MainAppBar>
      <LeftDrawer></LeftDrawer>
      <Box>
        <TextField value={imageURL} onChange={(e) => setImageURL(e.target.value)} title={'Image URL'} />
        <Button onClick={fillData}>analysiere Bild und befülle Formular</Button>
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
