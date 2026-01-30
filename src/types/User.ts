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
