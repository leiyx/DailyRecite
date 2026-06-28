export interface Post {
  id: number;
  date: string; // 'YYYY-MM-DD'
  title: string;
  article: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  username: string;
  created_at: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
