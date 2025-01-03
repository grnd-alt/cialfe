export type Post = {
  ID: string,
  Username: string,
  Content: string,
  Filepath: string,
  CreatedAt: string,
}

export type Comment = {
  ID: string,
  PostID: string,
  UserID: string,
  Content: string,
  CreatedAt: string,
  UpdatedAt: string,
}

export type PostData = {
  Post: Post,
  Comments: Comment[],
}
