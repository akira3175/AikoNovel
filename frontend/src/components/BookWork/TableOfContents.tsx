import React, { useState } from "react"
import {
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Collapse,
  TextField,
  Box,
  Divider,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"
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

const VolumeItem = styled(ListItem)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
}))

const ChapterItem = styled(ListItem)(({ theme }) => ({
  paddingLeft: theme.spacing(4),
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
      <Divider />
      <List>
        {volumes.map((volume) => (
          <React.Fragment key={volume.id}>
            <VolumeItem>
              <ListItemText
                primary={volume.title}
                secondary={
                  <img
                    src={volume.imageUrl || "/placeholder.svg"}
                    alt={volume.title}
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  />
                }
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="edit" onClick={() => handleEditVolume(volume)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteVolume(volume.id)}>
                  <DeleteIcon />
                </IconButton>
                <IconButton edge="end" aria-label="expand" onClick={() => handleVolumeToggle(volume.id)}>
                  {expandedVolume === volume.id ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </ListItemSecondaryAction>
            </VolumeItem>
            <Collapse in={expandedVolume === volume.id} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {volume.chapters.map((chapter) => (
                  <ChapterItem key={chapter.id}>
                    <ListItemText primary={chapter.title} secondary={`Ngày đăng: ${chapter.date}`} />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="edit">
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ChapterItem>
                ))}
                {addingChapter === volume.id ? (
                  <ChapterItem>
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
                      style={{ marginLeft: 8 }}
                    >
                      Thêm
                    </Button>
                    <Button onClick={() => setAddingChapter(null)} variant="outlined" style={{ marginLeft: 8 }}>
                      Hủy
                    </Button>
                  </ChapterItem>
                ) : (
                  <ChapterItem onClick={() => setAddingChapter(volume.id)}>
                    <ListItemText primary="Thêm chương mới" />
                    <AddIcon />
                  </ChapterItem>
                )}
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
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

