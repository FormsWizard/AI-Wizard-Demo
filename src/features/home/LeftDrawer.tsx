import * as React from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'

import Toolbar from '@mui/material/Toolbar'

import DragBox from './DragBox'
import {DraggableComponent, selectJsonSchema, selectOriginalPrompt, selectUiSchema} from '../wizard/WizardSlice'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Button, Tab } from '@mui/material'
import { useCallback } from 'react'
import { ConfirmButton } from '../modals/ChatGptModal'
import { selectTemplates } from '../wizard/TemplateSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks/reduxHooks'
import { ClickBox } from './ClickBox'
import { listFormData, newForm } from '../wizard/FormDataSlice'
import { CreateRounded } from '@mui/icons-material'

const drawerWidth = 340

export const basicDraggableComponents: DraggableComponent[] = [
  {
    name: 'Textfeld',
    jsonSchemaElement: {
      type: 'string',
    },
  },
  {
    name: 'Datumsfeld',
    jsonSchemaElement: {
      type: 'string',
      format: 'date',
    },
  },
  {
    name: 'Checkbox',
    jsonSchemaElement: {
      type: 'boolean',
    },
  },
  {
    name: 'Mehrzeiliges Textfeld',
    jsonSchemaElement: {
      type: 'string',
    },
    uiSchema: {
      type: 'Control',
      options: {
        multi: true,
      },
    },
  },
  {
    name: 'Auswahlfeld',
    jsonSchemaElement: {
      type: 'string',
      enum: ['DE', 'IT', 'JP', 'US', 'RU', 'Other'],
    },
  },
  {
    name: 'Zahleneingabe',
    jsonSchemaElement: {
      type: 'number',
    },
  },
  {
    name: 'E-Mail',
    jsonSchemaElement: {
      type: 'string',
      format: 'email',
    },
  },
]

export const advancedDraggableComponents: DraggableComponent[] = [
  {
    name: 'person',
    jsonSchemaElement: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          enum: ['Mr', 'Mrs', 'Ms', 'Dr', 'Prof'],
        },
        givenName: {
          type: 'string',
        },
        familyName: {
          type: 'string',
        },
        birthDate: {
          type: 'string',
          format: 'date',
        },
        nationality: {
          type: 'string',
          enum: ['DE', 'IT', 'JP', 'US', 'RU', 'Other'],
        },
      },
    },
    uiSchema: {
      type: 'Group',
      //@ts-ignore
      label: 'Person',
      elements: [
        {
          type: 'HorizontalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/title',
            },
            {
              type: 'Control',
              scope: '#/properties/givenName',
            },
            {
              type: 'Control',
              scope: '#/properties/familyName',
            },
          ],
        },
        {
          type: 'HorizontalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/birthDate',
            },
            {
              type: 'Control',
              scope: '#/properties/nationality',
            },
          ],
        },
      ],
    },
  },
]

export const NewEntryButton = () => {
  const dispatch = useAppDispatch()
  const jsonSchema = useAppSelector(selectJsonSchema)
  const uiSchema = useAppSelector(selectUiSchema)
  const originalPrompt = useAppSelector(selectOriginalPrompt)
  const handleNewEntry = useCallback(() => {
    dispatch(newForm({ jsonSchema, uiSchema, originalPrompt }))
  }, [dispatch, jsonSchema, uiSchema, originalPrompt])
  return (
    <Button startIcon={<CreateRounded />} variant={'contained'} onClick={handleNewEntry}>
      New Entry
    </Button>
  )
}

export default function LeftDrawer() {
  const [activeTab, setActiveTab] = React.useState('1')
  const templates = useAppSelector(selectTemplates)
  const formDataList = useAppSelector(listFormData)
  const handleChange = useCallback(
    (event, newValue) => {
      setActiveTab(newValue)
    },
    [setActiveTab]
  )
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <TabContext value={activeTab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Templates" value="1" />
            <Tab label="Tools" value="2" />
            <Tab label="Data" value="3" />
          </TabList>
        </Box>
        <TabPanel value="2" sx={{ p: 0 }}>
          <Box
            sx={{
              overflow: 'auto',
              '& > div': {
                margin: 1,
              },
            }}
          >
            {basicDraggableComponents.map((component, index) => {
              return (
                <DragBox name={component.name} key={component.name} componentMeta={component} disableActions></DragBox>
              )
            })}
          </Box>
        </TabPanel>
        <TabPanel value="1" sx={{ p: 0 }}>
          <ConfirmButton>KI gestützte Formulargenerierung</ConfirmButton>
          {advancedDraggableComponents.map((component, index) => {
            return <DragBox name={component.name} key={component.name} componentMeta={component}></DragBox>
          })}
          {templates.map((component, index) => {
            return <DragBox name={component.name} key={component.name} componentMeta={component} originalPrompt={component.originalPrompt}></DragBox>
          })}
        </TabPanel>
        <TabPanel value={'3'} sx={{ p: 0 }}>
          <NewEntryButton></NewEntryButton>
          {formDataList.map(({ id, title, avatar, originalPrompt }) => {
            return <ClickBox key={id} title={title} avatar={avatar} id={id} originalPrompt={originalPrompt}></ClickBox>
          })}
        </TabPanel>
      </TabContext>
    </Drawer>
  )
}
