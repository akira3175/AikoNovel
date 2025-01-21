import type React from "react"
import { useState, useEffect } from "react"
import { Link } from 'react-router-dom';
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material"
import { styled } from "@mui/material/styles"
import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL

interface Group {
  id: number
  groupname: string
}

const GroupsContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  width: "100%",
  maxWidth: "600px",
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
    <GroupsContainer>
      <Typography variant="h6" gutterBottom>
        Nhóm đã tham gia
      </Typography>
      <List>
        {groups.map((group) => (
          <ListItem key={group.id} component={Link} to={`/group/${group.id}`}>
            <ListItemText primary={group.groupname} />
          </ListItem>
        ))}
      </List>
    </GroupsContainer>
  )
}

export default Groups

