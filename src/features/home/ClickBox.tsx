import { Avatar, Button, Card, CardActionArea, CardContent, CardHeader, CardMedia, Typography } from '@mui/material'
import React, { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks/reduxHooks'
import { listFormData, loadForm, removeForm } from '../wizard/FormDataSlice'
import { red } from '@mui/material/colors'
import { replaceSchema, replaceUISchema } from '../wizard/WizardSlice'
import { ConfirmButton } from '../modals/ChatGptModal'

type ClickBoxProps = {
  id: string
  title: string
  avatar?: string
  disableActions?: boolean
  originalPrompt?: string
}
export const ClickBox = ({ id, title, avatar, originalPrompt, disableActions }: ClickBoxProps) => {
  const dispatch = useAppDispatch()
  const formList = useAppSelector(listFormData)
  const handleLoad = useCallback(() => {
    dispatch(loadForm({ id }))
  }, [id])

  const handleLoadFormData = useCallback(() => {
    const { jsonSchema, uiSchema } = formList.find((f) => f.id === id) || { jsonSchema: {}, uiSchema: undefined }
    dispatch(replaceSchema(jsonSchema))
    dispatch(replaceUISchema(uiSchema))
    dispatch(loadForm({ id }))
  }, [id, formList])

  const handleRemove = useCallback(() => {
    dispatch(removeForm({ id: id }))
  }, [id])

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="data">
            {title[0]}
          </Avatar>
        }
        title={title}
      ></CardHeader>
      {avatar && <CardMedia component="img" height="194" image={avatar} />}

      {!disableActions && (
        <CardActionArea>
          <Button onClick={handleLoadFormData} variant={'contained'}>
            load Form & Data
          </Button>
          <Button onClick={handleLoad}>load only Data</Button>
          <Button onClick={handleRemove}>Eintrag entfernen</Button>
          {originalPrompt && <ConfirmButton defaultPrompt={originalPrompt}>KI text bearbeiten</ConfirmButton>}
        </CardActionArea>
      )}
    </Card>
  )
}
