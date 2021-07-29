export interface Notifications {
  banner: Banner[]
  announcement: Announcement[]
}

export interface Banner {
  id: number
  content: string
  link: string
  content_type: string
}

export interface Announcement {
  id: number
  content: string
  link: string
  content_type: string
}
