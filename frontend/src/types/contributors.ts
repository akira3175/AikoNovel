export interface Author {
    id: number
    pen_name: string
    username: string
}
  
export interface Team {
    id: number
    name: string
    description: string
    members: TeamMember[]
    type: string | null
}
  
export interface TeamMember {
    user: string
    role: Role
    team: number
}
  
export interface Role {
    id: number
    name: string
    description: string
}