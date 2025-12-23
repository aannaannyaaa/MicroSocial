export interface User {
    _id: string;
    email: string;
    name: string;
    username: string;
    bio?: string;
    avatar?: string;
    followersCount: number;
    followingCount: number;
    postsCount: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Post {
    _id: string;
    content: string;
    image?: string;
    author: User;
    likes: string[];
    likesCount: number;
    comments: Comment[];
    commentsCount: number;
    createdAt: string;
    updatedAt: string;
    isLiked?: boolean;
  }
  
  export interface Comment {
    _id: string;
    content: string;
    author: User;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Like {
    _id: string;
    user: string;
    post: string;
    createdAt: string;
  }
  
  export interface AuthResponse {
    success: boolean;
    message: string;
    data?: {
      token: string;
      user: User;
    };
    error?: string;
  }
  
  export interface FeedResponse {
    success: boolean;
    data: Post[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }
  
  export interface PostResponse {
    success: boolean;
    data: Post;
  }
  
  export interface LikeResponse {
    success: boolean;
    data: Like;
    message: string;
  }
  
  export interface ErrorResponse {
    success: boolean;
    error: string;
    message: string;
  }
  
  export interface ImagePickerResult {
    uri: string;
    width: number;
    height: number;
    type: string;
  }
  