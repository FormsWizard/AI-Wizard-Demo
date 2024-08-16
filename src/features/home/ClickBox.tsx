import { Avatar, Button, Card, CardActionArea, CardContent, CardHeader, CardMedia, Typography } from '@mui/material'
import React, { useCallback } from 'react'
import { useAppDispatch } from '../../app/hooks/reduxHooks'
import { loadForm } from '../wizard/FormDataSlice'
import { red } from '@mui/material/colors'

type ClickBoxProps = {
  id: string
  title: string
  avatar?: string
}
export const ClickBox = ({ id, title, avatar }: ClickBoxProps) => {
  const dispatch = useAppDispatch()
  const handleLoad = useCallback(() => {
    dispatch(loadForm({ id }))
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
      <CardActionArea>
        <Button onClick={handleLoad}>load Form</Button>
      </CardActionArea>
    </Card>
  )
}
