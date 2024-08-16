import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { useDrag } from 'react-dnd'
import { Button, Card, CardActionArea, CardActions, CardContent, Typography } from '@mui/material'
import { DraggableComponent, replaceSchema } from '../wizard/WizardSlice'
import { useAppDispatch } from '../../app/hooks/reduxHooks'

type DragBoxProps = {
  name: string
  img?: string
  componentMeta: DraggableComponent
}
const DragBox = ({ name = 'Eingabefeld', img = '', componentMeta }: DragBoxProps) => {
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
  }, [dispatch, componentMeta])

  return (
    <Card ref={dragRef}>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {name}
          </Typography>
        </CardContent>
        <CardActionArea>
          <Button onClick={handleReplace}>replace current</Button>
        </CardActionArea>
      </CardActionArea>
    </Card>
  )
}

export default DragBox
