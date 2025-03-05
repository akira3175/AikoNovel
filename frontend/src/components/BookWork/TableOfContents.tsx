"use client"

import type React from "react"
import { useState } from "react"
import {
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Box,
  Divider,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  ListItemSecondaryAction,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import AddIcon from "@mui/icons-material/Add"
import VolumeForm from "./VolumeForm"
import { createVolume } from "../../services/book"
import type { BookDetails, Volume } from "../../types/book"

interface TableOfContentsProps {
  bookId: string | undefined
  book: BookDetails | null
  onVolumeAdded: (volume: Volume) => void
}

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}))

const VolumeImage = styled("img")({
  width: "100%",
  height: "auto",
  objectFit: "cover",
  borderRadius: "8px",
})

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  boxShadow: "none",
  "&:before": {
    display: "none",
  },
  "&.Mui-expanded": {
    margin: 0,
  },
}))

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  borderRadius: "8px",
  "&.Mui-expanded": {
    minHeight: "48px",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  justifyContent: "space-between", // Align title left, buttons right
}))

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderBottomLeftRadius: "8px",
  borderBottomRightRadius: "8px",
}))

const TableOfContents: React.FC<TableOfContentsProps> = ({ bookId, book, onVolumeAdded }) => {
  const [expandedVolume, setExpandedVolume] = useState<number | null>(null)
  const [newChapterTitle, setNewChapterTitle] = useState("")
  const [addingChapter, setAddingChapter] = useState<number | null>(null)
  const [volumeFormOpen, setVolumeFormOpen] = useState(false)
  const [editingVolume, setEditingVolume] = useState<Volume | null>(null)

  const volumes = book?.volumes || []

  const handleVolumeToggle = (volumeId: number) => {
    setExpandedVolume(expandedVolume === volumeId ? null : volumeId)
  }

  const handleAddVolume = async (title: string, imageUrl: string) => {
    if (!bookId) return

    try {
      const newVolume = await createVolume(Number.parseInt(bookId), title, imageUrl)
      onVolumeAdded(newVolume)
    } catch (error) {
      console.error("Failed to create volume:", error)
      // You might want to show an error notification here
    }
  }

  const handleEditVolume = (volume: Volume) => {
    setEditingVolume(volume)
    setVolumeFormOpen(true)
  }

  const handleUpdateVolume = (title: string, imageUrl: string) => {
    if (editingVolume) {
      try {
        // Here you would call an API to update the volume
        // For now, we'll just update the local state
        // This would need to be implemented with an API call and state update in the parent
      } catch (error) {
        console.error("Failed to update volume:", error)
      }
    }
    setEditingVolume(null)
  }

  const handleDeleteVolume = (volumeId: number) => {
    // Here you would call an API to delete the volume
    // This would need to be implemented with an API call and state update in the parent
  }

  const handleAddChapter = (volumeId: number) => {
    if (newChapterTitle.trim()) {
      // This would need to be implemented with an API call and state update in the parent
      setNewChapterTitle("")
      setAddingChapter(null)
    }
  }

  return (
    <StyledBox>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" component="h2">
          Mục lục
        </Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setVolumeFormOpen(true)}>
          Thêm tập mới
        </Button>
      </Box>
      <Divider sx={{ mb: 3 }} />
      {volumes.length === 0 ? (
        <Typography variant="body1" align="center" py={4}>
          Chưa có tập nào. Hãy thêm tập mới để bắt đầu.
        </Typography>
      ) : (
        volumes.map((volume) => (
          <StyledAccordion
            key={volume.id}
            expanded={expandedVolume === volume.id}
            onChange={() => handleVolumeToggle(volume.id)}
          >
            <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">{volume.title}</Typography>
              <Stack direction="row" spacing={1}>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEditVolume(volume)
                  }}
                  edge="end"
                  aria-label="edit"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteVolume(volume.id)
                  }}
                  edge="end"
                  aria-label="delete"
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </StyledAccordionSummary>
            <StyledAccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <VolumeImage src={volume.img || "/placeholder.svg"} alt={volume.title} />
                </Grid>
                <Grid item xs={12} md={8}>
                  {volume.chapters && volume.chapters.length > 0 ? (
                    <List>
                      {volume.chapters.map((chapter) => (
                        <ListItem key={chapter.id}>
                          <ListItemText primary={chapter.title} secondary={`Ngày đăng: ${chapter.date_upload}`} />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="edit">
                              <EditIcon />
                            </IconButton>
                            <IconButton edge="end" aria-label="delete">
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="textSecondary" py={2}>
                      Chưa có chương nào trong tập này.
                    </Typography>
                  )}
                  {addingChapter === volume.id ? (
                    <Box display="flex" alignItems="center" mt={2}>
                      <TextField
                        value={newChapterTitle}
                        onChange={(e) => setNewChapterTitle(e.target.value)}
                        placeholder="Nhập tên chương mới"
                        fullWidth
                        variant="outlined"
                        size="small"
                      />
                      <Button
                        onClick={() => handleAddChapter(volume.id)}
                        variant="contained"
                        color="primary"
                        sx={{ ml: 1 }}
                      >
                        Thêm
                      </Button>
                      <Button onClick={() => setAddingChapter(null)} variant="outlined" sx={{ ml: 1 }}>
                        Hủy
                      </Button>
                    </Box>
                  ) : (
                    <Button
                      startIcon={<AddIcon />}
                      onClick={() => setAddingChapter(volume.id)}
                      fullWidth
                      variant="outlined"
                      sx={{ mt: 2 }}
                    >
                      Thêm chương mới
                    </Button>
                  )}
                </Grid>
              </Grid>
            </StyledAccordionDetails>
          </StyledAccordion>
        ))
      )}
      <VolumeForm
        open={volumeFormOpen}
        onClose={() => {
          setVolumeFormOpen(false)
          setEditingVolume(null)
        }}
        onSave={editingVolume ? handleUpdateVolume : handleAddVolume}
        initialTitle={editingVolume?.title}
        initialImage={editingVolume?.img}
      />
    </StyledBox>
  )
}

export default TableOfContents

