import { UploadFile } from '@mui/icons-material'
import { Button } from '@mui/material'
import { uploadBackup } from '../../app/store'

export const UploadBackupButton = ({ children }: { children: string | undefined }) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = (event.target as any).files?.[0]
    if (!file) {
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result
      if (!content) {
        return
      }
      const json = JSON.parse(content.toString())
      //we should check via ajv for correctness
      uploadBackup(json)
    }
    reader.readAsText(file)
  }
  return (
    <Button component="label" startIcon={<UploadFile />} sx={{ marginRight: '1rem' }}>
      {children || 'Upload Backup'}
      <input type="file" accept="application/json" hidden onChange={handleFileUpload} />
    </Button>
  )
}
