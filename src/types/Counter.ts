import type { User } from "./User"

export type Counter = {
  ID: number,
  Name: string,
  Icon: string,
  EntryCount: number,
  Users?: User[]
  EventCreatedAt?: string
}
