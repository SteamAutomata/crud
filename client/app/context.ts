import { createContext } from 'react'

export interface SessionContext {
  id: string
  role: string
  name: string
  avatar: string
}

export const SessionContext = createContext<SessionContext | undefined>(undefined)
