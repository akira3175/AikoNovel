import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Box, Typography, List, ListItem, ListItemText, Paper } from "@mui/material"
import { styled } from "@mui/material/styles"
import axios from "axios"
import ListItemLink from "../ui/ListItemLink"

const API_URL = process.env.REACT_APP_API_URL

interface Group {
  id: number
  groupname: string
}

const GroupsContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: "100%",
}))

const StyledListItem = styled(ListItem)(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}))

const Groups: React.FC<{ username: string }> = ({ username }) => {
  const [groups, setGroups] = useState<Group[]>([])

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(`${API_URL}/user/${username}/groups/`)
        setGroups(response.data)
      } catch (error) {
        console.error("Error fetching groups:", error)
      }
    }
    fetchGroups()
  }, [username])

  return (
    <GroupsContainer elevation={3}>
      <Typography variant="h6" gutterBottom>
        Nhóm đã tham gia
      </Typography>
      <List dense>
        {groups.map((group) => (
           <ListItemLink to={`/group/${group.id}`} key={group.id}>
           <ListItemText primary={group.groupname} />
         </ListItemLink>
        ))}
      </List>
    </GroupsContainer>
  )
}

export default Groups

