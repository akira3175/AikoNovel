import type React from "react"
import { useState } from "react"
import {
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Box,
  Divider,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import AddIcon from "@mui/icons-material/Add"
import VolumeForm from "./VolumeForm"

interface TableOfContentsProps {
  bookId: string | undefined
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
  justifyContent: "space-between",
}))

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderBottomLeftRadius: "8px",
  borderBottomRightRadius: "8px",
}))

interface Volume {
  id: number
  title: string
  imageUrl: string
  chapters: { id: number; title: string; date: string }[]
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ bookId }) => {
  const [volumes, setVolumes] = useState<Volume[]>([
    {
      id: 1,
      title: "Tập 1",
      imageUrl: "/placeholder.svg",
      chapters: [
        { id: 1, title: "Chương 1: Khởi đầu", date: "01/01/2023" },
        { id: 2, title: "Chương 2: Cuộc phiêu lưu", date: "05/01/2023" },
      ],
    },
    {
      id: 2,
      title: "Tập 2",
      imageUrl: "/placeholder.svg",
      chapters: [{ id: 3, title: "Chương 1: Hành trình mới", date: "10/01/2023" }],
    },
  ])
  const [expandedVolume, setExpandedVolume] = useState<number | null>(null)
  const [newChapterTitle, setNewChapterTitle] = useState("")
  const [addingChapter, setAddingChapter] = useState<number | null>(null)
  const [volumeFormOpen, setVolumeFormOpen] = useState(false)
  const [editingVolume, setEditingVolume] = useState<Volume | null>(null)

  const handleVolumeToggle = (volumeId: number) => {
    setExpandedVolume(expandedVolume === volumeId ? null : volumeId)
  }

  const handleAddVolume = (title: string, imageUrl: string) => {
    setVolumes([...volumes, { id: volumes.length + 1, title, imageUrl, chapters: [] }])
  }

  const handleEditVolume = (volume: Volume) => {
    setEditingVolume(volume)
    setVolumeFormOpen(true)
  }

  const handleUpdateVolume = (title: string, imageUrl: string) => {
    if (editingVolume) {
      setVolumes(volumes.map((v) => (v.id === editingVolume.id ? { ...v, title, imageUrl } : v)))
    }
    setEditingVolume(null)
  }

  const handleDeleteVolume = (volumeId: number) => {
    setVolumes(volumes.filter((v) => v.id !== volumeId))
  }

  const handleAddChapter = (volumeId: number) => {
    if (newChapterTitle.trim()) {
      setVolumes(
        volumes.map((volume) =>
          volume.id === volumeId
            ? {
                ...volume,
                chapters: [
                  ...volume.chapters,
                  {
                    id: volume.chapters.length + 1,
                    title: newChapterTitle,
                    date: new Date().toLocaleDateString(),
                  },
                ],
              }
            : volume,
        ),
      )
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
      {volumes.map((volume) => (
        <StyledAccordion key={volume.id} expanded={expandedVolume === volume.id}>
          <StyledAccordionSummary expandIcon={<ExpandMoreIcon />} onClick={() => handleVolumeToggle(volume.id)}>
            <Typography variant="h6">{volume.title}</Typography>
            <Box>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation()
                  handleEditVolume(volume)
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteVolume(volume.id)
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <VolumeImage src={volume.imageUrl || "/placeholder.svg"} alt={volume.title} />
              </Grid>
              <Grid item xs={12} md={9}>
                <List>
                  {volume.chapters.map((chapter) => (
                    <ListItem key={chapter.id}>
                      <ListItemText primary={chapter.title} secondary={`Ngày đăng: ${chapter.date}`} />
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
      ))}
      <VolumeForm
        open={volumeFormOpen}
        onClose={() => {
          setVolumeFormOpen(false)
          setEditingVolume(null)
        }}
        onSave={editingVolume ? handleUpdateVolume : handleAddVolume}
        initialTitle={editingVolume?.title}
        initialImage={editingVolume?.imageUrl}
      />
    </StyledBox>
  )
}

export default TableOfContents

