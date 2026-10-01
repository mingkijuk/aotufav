export type ThemeId = 'custom' | 'space' | 'nebula' | 'sakura' | 'fantasy' | 'arcade' | 'minimal' | 'noir';
export type AspectRatio = '16:9' | '1:1' | '9:16' | '4:3';
export type CardShape = 'rounded' | 'sharp' | 'card-frame';

export interface CharacterItem {
  id: string;
  name: string;
  imageUrl: string;
}

export interface CharacterPreset {
  id: string;
  gameId: string;
  name: string;
  role: string;
  title: string;
  element?: string;
  quote: string;
  imageUrl: string;
  colorAccent: string;
  badge?: string;
}

export interface GamePreset {
  id: string;
  name: string;
  englishName: string;
  genre: string;
  themeColor: string;
  defaultBadge: string;
  characters: CharacterPreset[];
}

export interface CardSlot {
  id: string;
  gameId: string;
  gameName: string;
  categoryLabel: string;
  characterName: string;
  characterTitle: string;
  quote: string;
  imageUrl: string;
  imageZoom: number; // 0.8 ~ 2.5
  imagePanX: number; // -100 ~ 100
  imagePanY: number; // -100 ~ 100
  badge: string;
  rating: number; // 1 ~ 5
  accentColor: string;
  isOnePick?: boolean; // 선택사항: 12명 중 '원픽 최애' 지정
}

export interface BoardTheme {
  id: ThemeId;
  name: string;
  description: string;
  bgGradient: string;
  cardBg: string;
  cardBorder: string;
  textColor: string;
  mutedTextColor: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  fontFamily: string;
}

export interface StudioBoardConfig {
  title: string;
  subtitle: string;
  author: string;
  topFavorites?: string[]; // 최대 3명의 전체 통합 최애 캐릭터
  spoilerFree?: boolean;   // 스포 최소화 모드 (3그룹 숨김 및 3x3 저장)
  themeId: ThemeId;
  customBgColor: string;      // custom background color or gradient start
  customCardBgColor: string;  // custom card background color
  customAccentColor: string;  // custom accent highlight color
  aspectRatio: AspectRatio;
  gridColumns: number; // 2, 3, 4, 5
  showQuotes: boolean;
  showBadges: boolean;
  showRatings: boolean;
  showGameTitles: boolean;
  cardShape: CardShape;
  watermark: string;
}
