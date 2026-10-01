import { GamePreset, BoardTheme, CardSlot, StudioBoardConfig } from '../types';

export interface GroupDefinition {
  id: string;
  name: string;
  characters: string[];
}

// 12 Groups with Exact Requested Choices:
// 1. 킹파티: 킹, 그레이, 자당환, 칼리, 레몬
// 2. 갓로즈파티: 갓로즈, 레이드, 주마
// 3. 레이시해적단: 레이시, 카밀, 팔로스, 펠리
// 4. 쌍둥이파티: 안미수, 에이비, 에이미
// 5. 귀천맹: 폭스, 레이나, 자당루, 자당린
// 6. 월란파티: 월란, 호킨스, 바이밍, 러비
// 7. 기타참가자: 웨이드, 앤트, 경미, 실버, 신진요
// 8. 비참가자: 레이전, 레이팅, 자당가주, 레그, 필리스, 스타재단회장, 성공성왕, 라이
// 9. 츄이파티: 다니엘, 츄이, 링, 자당진
// 10. 대회관계자: 레퍼리, D천사, X천사, Z천사
// 11. 원초천사: P천사, T천사, G천사, A천사, E천사
// 12. 신: 재결신사, 블랙, 창세신

export const AOTU_GROUPS_DATA: GroupDefinition[] = [
  {
    id: 'group_king',
    name: '킹파티',
    characters: ['킹', '그레이', '자당환', '칼리', '레몬']
  },
  {
    id: 'group_godrose',
    name: '갓로즈파티',
    characters: ['갓로즈', '레이드', '주마']
  },
  {
    id: 'group_ray',
    name: '레이시해적단',
    characters: ['레이시', '카밀', '팔로스', '펠리']
  },
  {
    id: 'group_twins',
    name: '쌍둥이파티',
    characters: ['안미수', '에이비', '에이미']
  },
  {
    id: 'group_gwicheon',
    name: '귀천맹',
    characters: ['폭스', '레이나', '자당루', '자당린']
  },
  {
    id: 'group_wolan',
    name: '월란파티',
    characters: ['월란', '호킨스', '바이밍', '라비']
  },
  {
    id: 'group_other_part',
    name: '기타참가자',
    characters: [
      '웨이드',
      '앤트',
      '경미',
      '실버',
      '신진요',
      '쇼나르',
      '안젤라',
      '레디&멜리'
    ]
  },
  {
    id: 'group_non_part',
    name: '비참가자',
    characters: [
      '레이전',
      '레이팅',
      '자당가주',
      '레그',
      '필리스',
      '스타재단회장',
      '성공성왕',
      '라이',
      '광족친왕',
      '펠리아 오버로드',
      '제들리',
      '로브레이',
      '세브라스'
    ]
  },
  {
    id: 'group_chuyi',
    name: '츄이파티',
    characters: ['다니엘', '츄이', '링', '자당진']
  },
  {
    id: 'group_officials',
    name: '대회관계자',
    characters: ['레퍼리', 'D천사', 'X천사', 'Z천사', 'V천사']
  },
  {
    id: 'group_prime_angel',
    name: '원초천사',
    characters: ['천사P', '천사T', '천사G', '천사A', '천사E']
  },
  {
    id: 'group_god',
    name: '신',
    characters: ['재결신사', '블랙', '창세신']
  }
];

export const AOTU_GROUPS: GamePreset[] = AOTU_GROUPS_DATA.map((g) => ({
  id: g.id,
  name: g.name,
  englishName: g.name,
  genre: '',
  themeColor: '#000000',
  defaultBadge: g.name,
  characters: g.characters.map((cName, idx) => ({
    id: `${g.id}_${idx}`,
    gameId: g.id,
    name: cName,
    role: '',
    title: '',
    quote: '',
    imageUrl: '',
    colorAccent: '#000000'
  }))
}));

export const BOARD_THEMES: BoardTheme[] = [
  {
    id: 'minimal',
    name: '모노크롬 화이트',
    description: '심플한 화이트 & 블랙',
    bgGradient: 'from-white to-white',
    cardBg: '#ffffff',
    cardBorder: '#000000',
    textColor: '#000000',
    mutedTextColor: '#333333',
    accentColor: '#000000',
    badgeBg: '#000000',
    badgeText: '#ffffff',
    fontFamily: '"Plus Jakarta Sans", "Noto Sans KR", sans-serif'
  },
  {
    id: 'noir',
    name: '모노크롬 블랙',
    description: '블랙 & 화이트 라인',
    bgGradient: 'from-black to-black',
    cardBg: '#000000',
    cardBorder: '#ffffff',
    textColor: '#ffffff',
    mutedTextColor: '#888888',
    accentColor: '#ffffff',
    badgeBg: '#ffffff',
    badgeText: '#000000',
    fontFamily: '"Plus Jakarta Sans", "Noto Sans KR", sans-serif'
  },
  {
    id: 'space',
    name: '코스믹 우주',
    description: '신비로운 딥 스페이스 & 성운',
    bgGradient: 'from-[#070714] via-[#0d0f28] to-[#050510]',
    cardBg: '#0d0f24',
    cardBorder: '#6366f1',
    textColor: '#ffffff',
    mutedTextColor: '#94a3b8',
    accentColor: '#818cf8',
    badgeBg: '#818cf8',
    badgeText: '#ffffff',
    fontFamily: '"Plus Jakarta Sans", "Noto Sans KR", sans-serif'
  }
];

export const CHARACTER_DEFAULT_IMAGES: Record<string, string> = {
  '킹': 'https://i.postimg.cc/pXzTL1xd/Kakao-Talk-20260930-021438333-01.jpg',
  '그레이': 'https://i.postimg.cc/qRWJk25J/Kakao-Talk-20260930-151233871-02.jpg',
  '자당환': 'https://i.postimg.cc/J7pHWXp2/Kakao-Talk-20260930-022950991-01.jpg',
  '칼리': 'https://i.postimg.cc/pdzBXwxj/Kakao-Talk-20261001-171740544.jpg',
  '레몬': 'https://i.postimg.cc/50nybcS2/Kakao-Talk-20260930-022950991-02.jpg',
  '갓로즈': 'https://i.postimg.cc/5tgWtTsb/Kakao-Talk-20260930-173603458-03.jpg',
  '레이드': 'https://i.postimg.cc/dtC10Qdg/Kakao-Talk-20260930-175808663.png',
  '주마': 'https://i.postimg.cc/NM0FG1kj/Kakao-Talk-20260930-175714020-01.jpg',
  '레이시': 'https://i.postimg.cc/8C1xxwTj/Kakao-Talk-20260930-174620024-01.jpg',
  '카밀': 'https://i.postimg.cc/3RdqtmNY/Kakao-Talk-20260930-145518135-01.jpg',
  '팔로스': 'https://i.postimg.cc/xCJsvQpS/Kakao-Talk-20260930-145518135-02.jpg',
  '펠리': 'https://i.postimg.cc/L8D0RNgr/Kakao-Talk-20260930-145452944-03.jpg',
  '안미수': 'https://i.postimg.cc/B6zyL0H4/Kakao-Talk-20260930-022950991-03.jpg',
  '폭스': 'https://i.postimg.cc/N0w8ffMH/Kakao-Talk-20260930-190504098.jpg',
  '레이나': 'https://i.postimg.cc/zv3KPyd4/Kakao-Talk-20260930-021438333-04.jpg',
  '신진요': 'https://i.postimg.cc/XJks0Bkw/Kakao-Talk-20260930-022950991-04.jpg',
  '자당루': 'https://i.postimg.cc/c4G3Z0c3/Kakao-Talk-20260930-212208881-01.jpg',
  '자당린': 'https://i.postimg.cc/Y2Y4dTwN/Kakao-Talk-20260930-212208881-02.jpg',
  '경미': 'https://i.postimg.cc/F157HHvF/Kakao-Talk-20260930-205244489-01.jpg',
  '앤트': 'https://i.postimg.cc/fbFgHVhM/Kakao-Talk-20260930-215208443-01.jpg',
  '웨이드': 'https://i.postimg.cc/Y0BDHT9V/Kakao-Talk-20260930-215208443-02.jpg',
  '실버': 'https://i.postimg.cc/2jnXwj9m/Kakao-Talk-20260930-215743973-01.jpg',
  '쇼나르': 'https://i.postimg.cc/9QQ8CdmV/Kakao-Talk-20260930-215743973-02.jpg',
  '안젤라': 'https://i.postimg.cc/1XKBZtbh/Kakao-Talk-20260930-220407873.jpg',
  '레디&멜리': 'https://i.postimg.cc/gkzFL6zC/Kakao-Talk-20260930-220836976.jpg',
  '광족친왕': 'https://i.postimg.cc/sgnVg45q/Kakao-Talk-20260930-220758661.jpg',
  '월란': 'https://i.postimg.cc/GhGjJBH3/Kakao-Talk-20260930-205244489-02.jpg',
  '호킨스': 'https://i.postimg.cc/8PxcSSgn/Kakao-Talk-20261001-003343593.jpg',
  '바이밍': 'https://i.postimg.cc/R05WczP6/Kakao-Talk-20261001-003310477-05.jpg',
  '라비': 'https://i.postimg.cc/597jszP3/Kakao-Talk-20261001-003310477-09.jpg',
  '다니엘': 'https://i.postimg.cc/dtsmyGhj/Kakao-Talk-20261001-003310477-02.jpg',
  '츄이': 'https://i.postimg.cc/8cKFWJ3Q/Kakao-Talk-20261001-003310477-04.jpg',
  '링': 'https://i.postimg.cc/MphQdBGn/Kakao-Talk-20261001-003310477-06.jpg',
  '자당진': 'https://i.postimg.cc/FzRz9FK3/Kakao-Talk-20261001-003310477-07.jpg',
  '에이미': 'https://i.postimg.cc/VkLdL60K/Kakao-Talk-20260930-212007815.jpg',
  '에이비': 'https://i.postimg.cc/s26PD7NR/Kakao-Talk-20260930-205244489-04.jpg',
  '레그': 'https://i.postimg.cc/DzpFgRLM/Kakao-Talk-20260930-174620024-03.jpg',
  '레이전': 'https://i.postimg.cc/bYVK1P0c/Kakao-Talk-20261001-024142079-01.jpg',
  '레이팅': 'https://i.postimg.cc/HxZP00yV/Kakao-Talk-20261001-024142079-02.jpg',
  '라이': 'https://i.postimg.cc/QCFYfBQ6/Kakao-Talk-20261001-024142079-03.jpg',
  '자당가주': 'https://i.postimg.cc/NFZJSgbL/Kakao-Talk-20261001-024810663.jpg',
  '필리스': 'https://i.postimg.cc/bN5fft3x/Kakao-Talk-20261001-164754382-03.jpg',
  '성공성왕': 'https://i.postimg.cc/PJF9HgzK/Kakao-Talk-20261001-164832558.jpg',
  '스타재단회장': 'https://i.postimg.cc/V6fVCfKG/Kakao-Talk-20261001-165355868.jpg',
  '펠리아 오버로드': 'https://i.postimg.cc/JnCPN1K2/Kakao-Talk-20261001-165405896.jpg',
  '펠리아': 'https://i.postimg.cc/JnCPN1K2/Kakao-Talk-20261001-165405896.jpg',
  '제들리': 'https://i.postimg.cc/Nfjb7C70/Kakao-Talk-20261001-170425923.png',
  '로브레이': 'https://i.postimg.cc/7hs3WD1X/Kakao-Talk-20261001-171435689.jpg',
  '세브라스': 'https://i.postimg.cc/NGpkM7hC/Kakao-Talk-20261001-172945138.jpg',
  '레퍼리': 'https://i.postimg.cc/wjtVntGN/Kakao-Talk-20261001-171331047-01.jpg',
  'D천사': 'https://i.postimg.cc/G3yDZHvr/Kakao-Talk-20260930-021438333-08.jpg',
  'X천사': 'https://i.postimg.cc/W11QHh5y/Kakao-Talk-20260930-021438333-09.jpg',
  'Z천사': 'https://i.postimg.cc/j56PWjtC/Kakao-Talk-20261001-003310477-03.jpg',
  'V천사': 'https://i.postimg.cc/g0VvP3qg/Kakao-Talk-20261001-004333342.jpg',
  '천사V': 'https://i.postimg.cc/g0VvP3qg/Kakao-Talk-20261001-004333342.jpg',
  '천사P': 'https://i.postimg.cc/KY834Smr/Kakao-Talk-20260930-175714020-02.jpg',
  'P천사': 'https://i.postimg.cc/KY834Smr/Kakao-Talk-20260930-175714020-02.jpg',
  '천사A': 'https://i.postimg.cc/qgV5wxm0/Kakao-Talk-20260930-174620024-02.jpg',
  'A천사': 'https://i.postimg.cc/qgV5wxm0/Kakao-Talk-20260930-174620024-02.jpg',
  '천사G': 'https://i.postimg.cc/9FW1Ydq7/Kakao-Talk-20260930-220810104.jpg',
  'G천사': 'https://i.postimg.cc/9FW1Ydq7/Kakao-Talk-20260930-220810104.jpg',
  '천사T': 'https://i.postimg.cc/j2g05wKK/Kakao-Talk-20261001-164754382-02.jpg',
  'T천사': 'https://i.postimg.cc/j2g05wKK/Kakao-Talk-20261001-164754382-02.jpg',
  '천사E': 'https://i.postimg.cc/FRN2VgH7/Kakao-Talk-20261001-164754382-05.jpg',
  'E천사': 'https://i.postimg.cc/FRN2VgH7/Kakao-Talk-20261001-164754382-05.jpg',
  '재결신사': 'https://i.postimg.cc/MG2kv8ks/Kakao-Talk-20261001-164754382-04.jpg',
  '블랙': 'https://i.postimg.cc/0NLFjZ9k/Kakao-Talk-20260930-021438333-05.jpg',
  '창세신': 'https://i.postimg.cc/K8dNbGXh/Kakao-Talk-20261001-171331047-02.jpg'
};

// Default custom zoom and pan per character (e.g. 15% centered zoom)
export const CHARACTER_DEFAULT_ZOOM: Record<string, { zoom: number; panX: number; panY: number }> = {
  '다니엘': { zoom: 1.15, panX: 0, panY: 0 },
  'Z천사': { zoom: 1.15, panX: 0, panY: 0 }
};

// Initial default slots for the 12 groups (Unselected by default)
export const INITIAL_DEFAULT_SLOTS: CardSlot[] = [
  {
    id: 'slot-1',
    gameId: 'group_king',
    gameName: '킹파티',
    categoryLabel: '',
    characterName: '',
    characterTitle: '',
    quote: '',
    imageUrl: '',
    imageZoom: 1.0,
    imagePanX: 0,
    imagePanY: 0,
    badge: '',
    rating: 5,
    accentColor: '#000000'
  },
  {
    id: 'slot-2',
    gameId: 'group_godrose',
    gameName: '갓로즈파티',
    categoryLabel: '',
    characterName: '',
    characterTitle: '',
    quote: '',
    imageUrl: '',
    imageZoom: 1.0,
    imagePanX: 0,
    imagePanY: 0,
    badge: '',
    rating: 5,
    accentColor: '#000000'
  },
  {
    id: 'slot-3',
    gameId: 'group_ray',
    gameName: '레이시해적단',
    categoryLabel: '',
    characterName: '',
    characterTitle: '',
    quote: '',
    imageUrl: '',
    imageZoom: 1.0,
    imagePanX: 0,
    imagePanY: 0,
    badge: '',
    rating: 5,
    accentColor: '#000000'
  },
  {
    id: 'slot-4',
    gameId: 'group_twins',
    gameName: '쌍둥이파티',
    categoryLabel: '',
    characterName: '',
    characterTitle: '',
    quote: '',
    imageUrl: '',
    imageZoom: 1.0,
    imagePanX: 0,
    imagePanY: 0,
    badge: '',
    rating: 5,
    accentColor: '#000000'
  },
  {
    id: 'slot-5',
    gameId: 'group_gwicheon',
    gameName: '귀천맹',
    categoryLabel: '',
    characterName: '',
    characterTitle: '',
    quote: '',
    imageUrl: '',
    imageZoom: 1.0,
    imagePanX: 0,
    imagePanY: 0,
    badge: '',
    rating: 5,
    accentColor: '#000000'
  },
  {
    id: 'slot-6',
    gameId: 'group_wolan',
    gameName: '월란파티',
    categoryLabel: '',
    characterName: '',
    characterTitle: '',
    quote: '',
    imageUrl: '',
    imageZoom: 1.0,
    imagePanX: 0,
    imagePanY: 0,
    badge: '',
    rating: 5,
    accentColor: '#000000'
  },
  {
    id: 'slot-7',
    gameId: 'group_other_part',
    gameName: '기타참가자',
    categoryLabel: '',
    characterName: '',
    characterTitle: '',
    quote: '',
    imageUrl: '',
    imageZoom: 1.0,
    imagePanX: 0,
    imagePanY: 0,
    badge: '',
    rating: 5,
    accentColor: '#000000'
  },
  {
    id: 'slot-8',
    gameId: 'group_non_part',
    gameName: '비참가자',
    categoryLabel: '',
    characterName: '',
    characterTitle: '',
    quote: '',
    imageUrl: '',
    imageZoom: 1.0,
    imagePanX: 0,
    imagePanY: 0,
    badge: '',
    rating: 5,
    accentColor: '#000000'
  },
  {
    id: 'slot-9',
    gameId: 'group_chuyi',
    gameName: '츄이파티',
    categoryLabel: '',
    characterName: '',
    characterTitle: '',
    quote: '',
    imageUrl: '',
    imageZoom: 1.0,
    imagePanX: 0,
    imagePanY: 0,
    badge: '',
    rating: 5,
    accentColor: '#000000'
  },
  {
    id: 'slot-10',
    gameId: 'group_officials',
    gameName: '대회관계자',
    categoryLabel: '',
    characterName: '',
    characterTitle: '',
    quote: '',
    imageUrl: '',
    imageZoom: 1.0,
    imagePanX: 0,
    imagePanY: 0,
    badge: '',
    rating: 5,
    accentColor: '#000000'
  },
  {
    id: 'slot-11',
    gameId: 'group_prime_angel',
    gameName: '원초천사',
    categoryLabel: '',
    characterName: '',
    characterTitle: '',
    quote: '',
    imageUrl: '',
    imageZoom: 1.0,
    imagePanX: 0,
    imagePanY: 0,
    badge: '',
    rating: 5,
    accentColor: '#000000'
  },
  {
    id: 'slot-12',
    gameId: 'group_god',
    gameName: '신',
    categoryLabel: '',
    characterName: '',
    characterTitle: '',
    quote: '',
    imageUrl: '',
    imageZoom: 1.0,
    imagePanX: 0,
    imagePanY: 0,
    badge: '',
    rating: 5,
    accentColor: '#000000'
  }
];

export const INITIAL_CONFIG: StudioBoardConfig = {
  title: '요철세계 파티별 최애표',
  subtitle: 'AOTU WORLD FAVORITES',
  author: '',
  topFavorites: [],
  spoilerFree: false,
  themeId: 'minimal',
  customBgColor: '#ffffff',
  customCardBgColor: '#ffffff',
  customAccentColor: '#000000',
  aspectRatio: '1:1',
  gridColumns: 3,
  showQuotes: false,
  showBadges: false,
  showRatings: false,
  showGameTitles: true,
  cardShape: 'sharp',
  watermark: '凹凸世界'
};

export interface AotuCharacterInfo {
  name: string;
  partyName: string;
  imageUrl: string;
}

export function getAllAotuCharacters(): AotuCharacterInfo[] {
  const seen = new Set<string>();
  const list: AotuCharacterInfo[] = [];

  for (const group of AOTU_GROUPS_DATA) {
    for (const charName of group.characters) {
      if (!seen.has(charName)) {
        seen.add(charName);
        list.push({
          name: charName,
          partyName: group.name,
          imageUrl: CHARACTER_DEFAULT_IMAGES[charName] || ''
        });
      }
    }
  }

  return list;
}
