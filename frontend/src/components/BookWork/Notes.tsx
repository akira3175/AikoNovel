import type React from "react"
import { useState } from "react"
import { TextField, Button, Box } from "@mui/material"

interface NotesProps {
  bookId: string | undefined
}

const Notes: React.FC<NotesProps> = ({ bookId }) => {
  const [note, setNote] = useState("")

  const handleSaveNote = () => {
    // Implement save note functionality
    console.log("Saving note for book:", bookId)
  }

  return (
    <Box>
      <TextField
        fullWidth
        multiline
        rows={10}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Nhập ghi chú của bạn ở đây..."
        variant="outlined"
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleSaveNote}>
        Lưu ghi chú
      </Button>
    </Box>
  )
}

export default Notes

