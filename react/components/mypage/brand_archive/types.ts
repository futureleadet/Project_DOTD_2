export type TabType = 'generations' | 'liked' | 'archive';

export interface PersonaData {
  headline: string;
  summary: string;
}

export interface WinningFitData {
  headline: string;
  analysis: string;
  keyword: string;
}

export interface MultiplierData {
  headline: string;
  item_name: string;
  value_prop: string;
}

export interface RedFlagData {
  headline: string;
  warning_item: string;
  reason: string;
}

export interface BrandData {
  name: string;
  target_item: string;
  reason: string;
  link: string;
}

export interface ReportData {
  persona: PersonaData;
  winning_fit: WinningFitData;
  multiplier: MultiplierData;
  red_flag: RedFlagData;
  brand_discovery: BrandData[];
}

export interface LockedData {
  status: 'locked';
  display_headline: string;
  message_body: string;
  progress_percentage: number;
}

export interface UnlockedData {
  status: 'unlocked';
  report: ReportData;
}

export type ArchiveState = LockedData | UnlockedData;