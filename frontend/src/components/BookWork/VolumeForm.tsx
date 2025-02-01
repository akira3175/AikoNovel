import type React from "react"
import { useState } from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box } from "@mui/material"
import ImageUpload from "../common/ImageUpload"

interface VolumeFormProps {
  open: boolean
  onClose: () => void
  onSave: (title: string, imageUrl: string) => void
  initialTitle?: string
  initialImage?: string
}

const VolumeForm: React.FC<VolumeFormProps> = ({ open, onClose, onSave, initialTitle = "", initialImage = "" }) => {
  const [title, setTitle] = useState(initialTitle)
  const [imageUrl, setImageUrl] = useState(initialImage)

  const handleSave = () => {
    onSave(title, imageUrl)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialTitle ? "Chỉnh sửa tập" : "Thêm tập mới"}</DialogTitle>
      <DialogContent>
        <Box my={2}>
          <TextField fullWidth label="Tiêu đề tập" value={title} onChange={(e) => setTitle(e.target.value)} />
        </Box>
        <Box my={2}>
          <ImageUpload initialImage={imageUrl} onImageUpload={setImageUrl} isEditing={true} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default VolumeForm

