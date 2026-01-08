export interface User {
  id: string; // Unique ID (e.g., ABC1234)
  name: string;
  email: string;
  avatarUrl: string;
  dailyGenerationsUsed: number;
  maxDailyGenerations: number;
  role?: string; // To distinguish ADMIN users
}

export interface FeedItem {
  id: string;
  imageUrl: string;
  authorId: string;
  authorName: string; // Simplified for UI
  createdAt: string; // ISO date
  likes: number;
  isLiked: boolean;
  tags: string[];
  description?: string; // This is the original prompt
  trendInsight?: string; // This is the new field for the analysis text
}

export interface GenerationParams {
  gender: 'male' | 'female';
  height: number;
  bodyType: 'slim' | 'average' | 'chubby';
  style: string;
  colors: string[];
  prompt: string;
  userImage?: string; // base64
}

export interface TrendInsight {
  title: string;
  content: string;
  tags: string[];
}

export enum ViewState {
  HOME = 'home',
  FEED = 'feed',
  CREATE = 'create',
  MYPAGE = 'mypage',
  LOGIN = 'login',
  ADMIN = 'admin',
  WEBHOOK_TEST = 'webhook_test',
  SHOPPING = 'shopping'
}

export interface ShoppingItem {
  id: number | string;
  brand: string;
  name: string;
  price: string;
  tip: string;
  link: string;
  imageUrl?: string;
}
