import { Button } from '@mui/material'
import { Download } from '@mui/icons-material'
import { downloadBackup } from '../../app/store'
import React, { useMemo } from 'react'

export const DownloadBackupButton = ({ children }: { children: string | undefined }) => {
  const src = useMemo(() => downloadBackup(), [])
  const isoDate = useMemo(() => new Date().toISOString(), [])
  const appVersion = useMemo(() => process.env.REACT_APP_VERSION || '', [])
  return (
    <Button color="primary" href={src} startIcon={<Download />} download={`${isoDate}-formsWizard-${appVersion}.json`}>
      {children || 'Download Backup'}
    </Button>
  )
}
