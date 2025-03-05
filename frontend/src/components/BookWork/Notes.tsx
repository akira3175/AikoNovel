"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { TextField, Box } from "@mui/material"

interface NotesProps {
  bookId: string | undefined
  onNoteChange: (note: string) => void
  initialNote?: string
}

const Notes: React.FC<NotesProps> = ({ bookId, onNoteChange, initialNote = "" }) => {
  const [note, setNote] = useState(initialNote)

  useEffect(() => {
    setNote(initialNote)
  }, [initialNote])

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNote = e.target.value
    setNote(newNote)
    onNoteChange(newNote)
  }

  return (
    <Box>
      <TextField
        fullWidth
        multiline
        rows={10}
        value={note}
        onChange={handleNoteChange}
        placeholder="Nhập ghi chú của bạn ở đây..."
        variant="outlined"
        margin="normal"
      />
    </Box>
  )
}

export default Notes

