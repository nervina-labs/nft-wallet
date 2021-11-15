export interface Notifications {
  ['Notification::Announcement']: Banner[]
  ['Notification::Banner']: Announcement[]
  ['Notification::Activity']: Activity[]
  ['Notification::News']: News[]
  ['Notification::Interview']: Interview[]
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

export interface Activity {
  id: number
  content: string
  link: string
  content_type: string
}

export interface News {
  id: number
  content: string
  link: string
  content_type: string
}

export interface Interview {
  id: number
  content: string
  link: string
  content_type: string
}
