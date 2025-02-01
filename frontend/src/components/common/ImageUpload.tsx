import type React from "react"
import { useState } from "react"
import { Button, Box } from "@mui/material"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"

interface ImageUploadProps {
  initialImage: string
  onImageUpload: (imageUrl: string) => void
  isEditing: boolean
  width?: number
  height?: number
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  initialImage,
  onImageUpload,
  isEditing,
  width = 250,
  height = 355,
}) => {
  const [previewUrl, setPreviewUrl] = useState(initialImage)

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const imageUrl = reader.result as string
        setPreviewUrl(imageUrl)
        onImageUpload(imageUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Box
      sx={{
        width: `${width}px`,
        height: `${height}px`,
        border: "1px solid #ccc",
        borderRadius: "4px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {previewUrl ? (
        <img
          src={previewUrl || "/placeholder.svg"}
          alt="Preview"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f0f0f0",
          }}
        >
          <CloudUploadIcon sx={{ fontSize: 60, color: "grey.500" }} />
        </Box>
      )}
      <input
        accept="image/*"
        type="file"
        onChange={handleImageChange}
        style={{ display: "none" }}
        id="image-upload-input"
      />
      <label htmlFor="image-upload-input">
        <Button
          component="span"
          variant="contained"
          sx={{
            position: "absolute",
            bottom: 8,
            right: 8,
            zIndex: 1,
            backgroundColor: "#EEEEEE",
            color: "black",
            "&:hover": {
              backgroundColor: "#DDDDDD",
            },
            display: isEditing ? "flex" : "none",
          }}
        >
          Đăng ảnh
        </Button>
      </label>
    </Box>
  )
}

export default ImageUpload

