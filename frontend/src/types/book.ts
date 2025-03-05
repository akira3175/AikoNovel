import { Author, Team } from "./contributors"

export interface BookDetails {
    id: number
    authors: Author[]
    categories: Category[]
    teams: Team[]
    title: string | null
    description: string | null
    another_name: string | null
    img: string | null
    artist: string | null
    note: string | null
    quantity_volome: number
    date_upload: string
    date_update: string
    is_deleted: boolean
    status: number
    volumes: Volume[]
}
  
export interface Category {
    id: number
    name: string
    description: string
}
  
export interface BookStatus {
    id: number
    name: string
    code: string
    description: string
}
  
export interface UpdateBookData {
    title?: string
    description?: string
    another_name?: string
    img?: string
    authors?: number[]
    artist?: string
    status?: number
    teams?: number[]
    note?: string
    quantity_volome?: number
    categories?: number[]
}

export interface Volume {
    id: number;
    title: string;
    date_upload: string;
    chapters: Chapter[];
    book?: number
    img?: string
}

export interface Chapter {
    id: number;
    title: string;
    content?: string;
    date_upload: string;
}