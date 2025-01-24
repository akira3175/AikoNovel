import type React from "react"
import { useState } from "react"
import { Button, Menu, MenuItem } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { styled } from "@mui/material/styles"

interface BookManagementDropdownProps {
  bookId: number
}

const StyledButton = styled(Button)(({ theme }) => ({
  minWidth: "120px",
  height: "40px",
}))

const BookManagementDropdown: React.FC<BookManagementDropdownProps> = ({ bookId }) => {
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
      <StyledButton variant="contained" color="primary" onClick={handleClick} size="large">
        Quản lý
      </StyledButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleUpdate}>Cập nhật</MenuItem>
        <MenuItem onClick={handleDelete}>Xóa</MenuItem>
      </Menu>
    </>
  )
}

export default BookManagementDropdown

