import React from "react"
import { Typography, Button, List, ListItem, ListItemText, Divider } from "@mui/material"

interface TableOfContentsProps {
  bookId: string | undefined
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ bookId }) => {
  // This is a placeholder. You'll need to implement the actual logic to fetch and display volumes and chapters.
  return (
    <div>
      <Button variant="contained" color="primary">
        + Thêm tập mới
      </Button>
      <List>
        <ListItem>
          <ListItemText
            primary="Tập 1"
            secondary={
              <React.Fragment>
                <Button size="small">Thêm chương mới</Button>
                <Button size="small">Sửa</Button>
                <Button size="small">Xóa</Button>
              </React.Fragment>
            }
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText primary="Chương 1: Tiêu đề chương" secondary="Ngày đăng: 01/01/2023" />
        </ListItem>
      </List>
    </div>
  )
}

export default TableOfContents

