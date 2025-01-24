import type React from "react"
import { useState } from "react"
import { IconButton, Menu, MenuItem } from "@mui/material"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import { useNavigate } from "react-router-dom"

interface WorkItemMenuProps {
  bookId: number
}

const WorkItemMenu: React.FC<WorkItemMenuProps> = ({ bookId }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const navigate = useNavigate()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleUpdate = () => {
    navigate(`/book/${bookId}`)
    handleClose()
  }

  const handleDelete = () => {
    // Implement delete functionality
    console.log(`Delete book with id: ${bookId}`)
    handleClose()
  }

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleUpdate}>Cập nhật</MenuItem>
        <MenuItem onClick={handleDelete}>Xóa</MenuItem>
      </Menu>
    </>
  )
}

export default WorkItemMenu

