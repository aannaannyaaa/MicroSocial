import { apiClient } from './api';
import { Post, FeedResponse, PostResponse, LikeResponse } from '../types';

export const postsService = {
  // Feed - paginated posts
  async getFeed(page: number = 1, limit: number = 10): Promise<FeedResponse> {
    const response = await apiClient.get<FeedResponse>('/posts/feed', {
      params: { page, limit },
    });
    return response.data;
  },

  // Single post by ID
  async getPostById(postId: string): Promise<PostResponse> {
    const response = await apiClient.get<PostResponse>(`/posts/${postId}`);
    return response.data;
  },

  // Create text post (text-only)
  async createPost(content: string): Promise<PostResponse> {
    const response = await apiClient.post<PostResponse>('/posts', {
      content: content.trim(),
    });
    return response.data;
  },

  // Update post content
  async updatePost(postId: string, content: string): Promise<PostResponse> {
    const response = await apiClient.put<PostResponse>(`/posts/${postId}`, {
      content: content.trim(),
    });
    return response.data;
  },

  // Delete post
  async deletePost(postId: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete<{ success: boolean }>(`/posts/${postId}`);
    return response.data;
  },

  // Like/unlike posts
  async likePost(postId: string): Promise<LikeResponse> {
    const response = await apiClient.post<LikeResponse>('/likes', { post: postId });
    return response.data;
  },

  async unlikePost(postId: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete<{ success: boolean }>(`/likes/${postId}`);
    return response.data;
  },

  // User posts
  async getUserPosts(userId: string, page: number = 1): Promise<FeedResponse> {
    const response = await apiClient.get<FeedResponse>(`/posts/user/${userId}`, {
      params: { page, limit: 10 },
    });
    return response.data;
  },
};
