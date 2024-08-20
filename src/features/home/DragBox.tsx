import React, { useCallback } from 'react'
import { useDrag } from 'react-dnd'
import { Button, Card, CardActionArea, CardContent, Typography } from '@mui/material'
import { DraggableComponent, replaceSchema, replaceUISchema } from '../wizard/WizardSlice'
import { useAppDispatch } from '../../app/hooks/reduxHooks'
import { newForm } from '../wizard/FormDataSlice'
import { removeTemplate } from '../wizard/TemplateSlice'

type DragBoxProps = {
  name: string
  img?: string
  componentMeta: DraggableComponent
  disableActions?: boolean
}
const DragBox = ({ name = 'Eingabefeld', img = '', componentMeta, disableActions }: DragBoxProps) => {
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
    dispatch(newForm({ jsonSchema: componentMeta.jsonSchemaElement, uiSchema: componentMeta.uiSchema }))
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
          </CardActionArea>
        )}
      </CardActionArea>
    </Card>
  )
}

export default DragBox
