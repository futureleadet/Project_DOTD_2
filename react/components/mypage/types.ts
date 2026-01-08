export type TabType = 'generations' | 'liked' | 'brand-archive';

export interface MyPageProfileProps {
  id: string;
  nickname: string;
  gender: string;
  height: string;
  faceShape: string;
  bodyType: string;
  personalColor: string;
  profileImage: string;
  generationCount: number;
  dailyGenerationsUsed: number;
  maxDailyGenerations: number;
}
