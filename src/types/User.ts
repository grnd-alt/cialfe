export type UserSearchResult = {
  UserID: string,
  Username: string,
};

export type User = {
  followingcount: number,
  followers: number,
  username: string
  isfollowing: boolean
}

export type UserInCounter = {
  AccessType: string,
  EntryCount: number,
  Username: string,
  UserID: string
}
