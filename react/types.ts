export interface User {
  id: string; // Unique ID (e.g., ABC1234)
  name: string;
  email: string;
  avatarUrl: string;
  dailyGenerationsUsed: number;
  maxDailyGenerations: number;
  role?: string; // To distinguish ADMIN users
  faceShape?: string;
  personalColor?: string;
  height?: number;
  gender?: 'Male' | 'Female';
  bodyType?: string;
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

export type Gender = 'Male' | 'Female';

export interface UserProfile {
  photo: string | null;
  height: number;
  faceShape: string | null;
  personalColor: string | null;
  bodyType: string | null;
  gender: Gender;
}

export interface BodyTypeDefinition {
  id: string;
  name: string;
  kor: string;
  emoji: string;
  desc: string;
}

export interface ColorDefinition {
  id: string;
  name: string;
  hex: string;
  border?: boolean;
}

export interface StyleDefinition {
  id: string;
  name: string;
  koreanName: string;
  desc: string;
  imageSeed: string; // Using a seed for picsum to get consistent images
}

export interface PersonalColorTone {
  id: string;
  name: string;
  kor: string;
  color: string;
}

export interface PersonalColorSeason {
  id: string;
  name: string;
  icon: string;
  tones: PersonalColorTone[];
}
