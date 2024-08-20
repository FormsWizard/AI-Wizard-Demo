import React, { useCallback } from 'react'
import { useDrag } from 'react-dnd'
import { Button, Card, CardActionArea, CardContent, Typography } from '@mui/material'
import { DraggableComponent, replaceSchema, replaceUISchema } from '../wizard/WizardSlice'
import { useAppDispatch } from '../../app/hooks/reduxHooks'
import { newForm } from '../wizard/FormDataSlice'
import { removeTemplate } from '../wizard/TemplateSlice'
import {ConfirmButton} from "../modals/ChatGptModal";

type DragBoxProps = {
  name: string
  img?: string
  componentMeta: DraggableComponent
  disableActions?: boolean,
  originalPrompt?: string
}
const DragBox = ({ name = 'Eingabefeld', img = '', componentMeta, disableActions, originalPrompt}: DragBoxProps) => {
  const dispatch = useAppDispatch()
  const [, dragRef] = useDrag(
    () => ({
      type: 'DRAGBOX',
      item: { componentMeta },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.5 : 1,
      }),
      end: (item, monitor) => {
        const didDrop = monitor.didDrop()
        if (didDrop) {
        }
      },
    }),
    []
  )

  const handleReplace = useCallback(() => {
    dispatch(replaceSchema(componentMeta.jsonSchemaElement))
    dispatch(replaceUISchema(componentMeta.uiSchema))
    dispatch(newForm({ jsonSchema: componentMeta.jsonSchemaElement, uiSchema: componentMeta.uiSchema, originalPrompt: componentMeta.originalPrompt }))
  }, [dispatch, componentMeta])

  const handleRemove = useCallback(() => {
    dispatch(removeTemplate({ element: componentMeta }))
  }, [dispatch, componentMeta])

  return (
    <Card ref={dragRef}>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {name}
          </Typography>
        </CardContent>
        {!disableActions && (
          <CardActionArea>
            <Button onClick={handleReplace}>Formular ersetzen</Button>
            <Button onClick={handleRemove}>Template entfernen</Button>
            {originalPrompt && <ConfirmButton defaultPrompt={originalPrompt}>KI text bearbeiten</ConfirmButton> }
          </CardActionArea>
        )}
      </CardActionArea>
    </Card>
  )
}

export default DragBox
