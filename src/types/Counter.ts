import type { UserInCounter } from "./User"

export type Counter = {
  ID: number,
  Name: string,
  Icon: string,
  EntryCount: number,
  Users?: UserInCounter[]
  EventCreatedAt?: string
}
