export interface User {
  id: string;
  name: string;
  title: string;
  avatar: string;
  verified?: boolean;
}

export interface Story {
  id: string;
  user: User;
  isOwn?: boolean;
}

export interface Post {
  id: string;
  user: User;
  timestamp: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  isReel?: boolean;
  videoIcon?: string;
  videoUri?: any;
  views?: number;
}
