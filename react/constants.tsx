import { BodyTypeDefinition, ColorDefinition, Gender, StyleDefinition, PersonalColorSeason, PersonalColorTone, FeedItem } from "./types";

export const MOCK_FEED_ITEMS: FeedItem[] = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000',
    authorId: 'ABC1234',
    authorName: 'Fashionista',
    createdAt: '2023-10-25T10:00:00Z',
    likes: 120,
    isLiked: false,
    tags: ['#Vintage', '#Street', '#OOTD'],
    description: 'A classic vintage look for the modern street.'
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000',
    authorId: 'XYZ9876',
    authorName: 'StyleGuru',
    createdAt: '2023-10-24T14:30:00Z',
    likes: 85,
    isLiked: true,
    tags: ['#Casual', '#Winter', '#Cozy'],
    description: 'Staying warm but stylish.'
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000',
    authorId: 'MOD4455',
    authorName: 'TrendSetter',
    createdAt: '2023-10-23T09:15:00Z',
    likes: 210,
    isLiked: false,
    tags: ['#Chic', '#Elegant', '#Black'],
    description: 'All black everything.'
  },
  {
    id: '4',
    imageUrl: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1000',
    authorId: 'DES1122',
    authorName: 'DesignDaily',
    createdAt: '2023-10-22T18:45:00Z',
    likes: 95,
    isLiked: false,
    tags: ['#Menswear', '#Suit', '#Formal'],
  }
];

export const BODY_TYPES: Record<Gender, BodyTypeDefinition[]> = {
  'Male': [
      { id: 'Inverted Triangle', name: 'Inverted Triangle', kor: '역삼각형', emoji: '🔻', desc: '어깨가 넓고 허리가 좁은' },
      { id: 'Rectangle', name: 'Rectangle', kor: '직사각형', emoji: '▮', desc: '어깨, 허리, 골반이 일자' },
      { id: 'Trapezoid', name: 'Trapezoid', kor: '사다리꼴', emoji: '⏢', desc: '균형 잡힌 이상적인 체형' },
      { id: 'Oval', name: 'Oval', kor: '타원형', emoji: '🟢', desc: '전체적으로 둥근 체형' }
  ],
  'Female': [
      { id: 'Hourglass', name: 'Hourglass', kor: '모래시계', emoji: '⏳', desc: '허리가 잘록한 곡선형' },
      { id: 'Pear', name: 'Pear', kor: '삼각형', emoji: '🍐', desc: '하체가 상체보다 발달' },
      { id: 'Apple', name: 'Apple', kor: '원형', emoji: '🍎', desc: '상체가 하체보다 발달' },
      { id: 'Rectangle', name: 'Rectangle', kor: '직사각형', emoji: '▮', desc: '볼륨감이 적은 일자형' }
  ]
};

export const MAIN_COLORS: ColorDefinition[] = [
  { id: 'white', name: 'White', hex: '#FFFFFF', border: true },
  { id: 'cream', name: 'Cream', hex: '#FDF5E6', border: true }, 
  { id: 'beige', name: 'Beige', hex: '#E5D0AC' },
  { id: 'grey', name: 'Grey', hex: '#9CA3AF' },
  { id: 'black', name: 'Black', hex: '#000000' },
  { id: 'navy', name: 'Navy', hex: '#1e3a8a' },
  { id: 'blue', name: 'Blue', hex: '#60A5FA' },
  { id: 'green', name: 'Green', hex: '#15803d' },
  { id: 'khaki', name: 'Khaki', hex: '#57534E' }, 
  { id: 'brown', name: 'Brown', hex: '#78350F' },
  { id: 'red', name: 'Red', hex: '#EF4444' },
  { id: 'orange', name: 'Orange', hex: '#F97316' },
  { id: 'yellow', name: 'Yellow', hex: '#FACC15' },
  { id: 'purple', name: 'Purple', hex: '#9333EA' },
  { id: 'pink', name: 'Pink', hex: '#F472B6' }
];

export const STYLES: StyleDefinition[] = [
  { id: 'm_ai_auto', name: 'AI AUTO', koreanName: '자동 추천', desc: '사용자의 이미지와 취향을 분석해<br/>가장 잘 어울리는 스타일을 제안합니다.', imageSeed: 'fashion' },
  { id: 'm_grunge', name: 'GRUNGE', koreanName: '그런지', desc: '낡은 듯한 텍스처와 루즈한 핏으로<br/>자유롭고 반항적인 무드를 연출합니다.', imageSeed: 'grunge' },
  { id: 'm_amekaji', name: 'AMEKAJI', koreanName: '아메카지', desc: '미국 워크웨어를 일본 감성으로 재해석한<br/>편안하고 실용적인 스타일입니다.', imageSeed: 'workwear' },
  { id: 'm_workwear', name: 'WORKWEAR', koreanName: '워크웨어', desc: '데님, 캔버스 등 거친 소재를 활용한<br/>남성적이고 투박한 멋을 강조합니다.', imageSeed: 'denim' },
  { id: 'm_military', name: 'MILITARY', koreanName: '밀리터리', desc: '야상, 카고 팬츠 등 군복에서 유래한<br/>아이템으로 실용적이고 강렬한 느낌을 줍니다.', imageSeed: 'camo' },
  { id: 'm_gorpcore', name: 'GORPCORE', koreanName: '고프코어', desc: '아웃도어 의류를 일상복과 매치하여<br/>힙하고 기능적인 스타일을 완성합니다.', imageSeed: 'hiking' },
  { id: 'm_street', name: 'STREET', koreanName: '스트릿', desc: '오버핏, 로고 플레이 등 자유분방한<br/>힙합 문화를 기반으로 한 트렌디한 룩입니다.', imageSeed: 'streetwear' },
  { id: 'm_casual', name: 'CASUAL', koreanName: '캐주얼', desc: '누구에게나 어울리는 편안하고 자연스러운,<br/>가장 기본적인 데일리 스타일입니다.', imageSeed: 'casual' },
  { id: 'm_cityboy', name: 'CITY BOY', koreanName: '시티보이', desc: '넉넉한 실루엣과 레이어드로<br/>소년미와 도시적인 세련됨을 동시에 보여줍니다.', imageSeed: 'city' },
  { id: 'm_preppy', name: 'PREPPY', koreanName: '프레피', desc: '미국 사립학교 학생들의 교복에서 유래한,<br/>단정하고 클래식한 캐주얼 룩입니다.', imageSeed: 'school' },
  { id: 'm_minimal', name: 'MINIMAL', koreanName: '미니멀', desc: '절제된 디테일과 모노톤 컬러로<br/>깔끔하고 현대적인 세련미를 추구합니다.', imageSeed: 'minimal' },
  { id: 'm_bizcasual', name: 'BIZ CASUAL', koreanName: '비즈니스', desc: '격식을 갖추면서도 딱딱하지 않은,<br/>직장인을 위한 세련된 출근 룩입니다.', imageSeed: 'suit' },
  { id: 'm_dandy', name: 'DANDY', koreanName: '댄디', desc: '코트, 니트 등을 활용하여<br/>부드럽고 깔끔한 신사의 이미지를 연출합니다.', imageSeed: 'coat' },
  { id: 'm_classic', name: 'CLASSIC', koreanName: '클래식', desc: '유행을 타지 않는 전통적인 아이템으로<br/>품격 있고 중후한 멋을 냅니다.', imageSeed: 'classic' }
];

export const FACE_SHAPES = [
  { id: 'Round', name: 'Round', emoji: '🔴' },
  { id: 'Oval', name: 'Oval', emoji: '🥚' },
  { id: 'Square', name: 'Square', emoji: '⬛' },
  { id: 'Long', name: 'Long', emoji: '🥒' },
  { id: 'Heart', name: 'Heart', emoji: '🔻' },
  { id: 'Diamond', name: 'Diamond', emoji: '🔶' },
];

export const PERSONAL_COLOR_SEASONS: PersonalColorSeason[] = [
  {
    id: 'Spring',
    name: 'Spring',
    icon: '🌸',
    tones: [
      { id: 'Spring Light', name: 'Spring Light', kor: '봄 라이트', color: '#FEF3C7' },
      { id: 'Spring Bright', name: 'Spring Bright', kor: '봄 브라이트', color: '#FCD34D' },
      { id: 'Spring Warm', name: 'Spring Warm', kor: '봄 웜 트루', color: '#F59E0B' },
    ]
  },
  {
    id: 'Summer',
    name: 'Summer',
    icon: '🌊',
    tones: [
      { id: 'Summer Light', name: 'Summer Light', kor: '여름 라이트', color: '#DBEAFE' },
      { id: 'Summer Mute', name: 'Summer Mute', kor: '여름 뮤트', color: '#94A3B8' },
      { id: 'Summer Cool', name: 'Summer Cool', kor: '여름 쿨 트루', color: '#3B82F6' },
    ]
  },
  {
    id: 'Autumn',
    name: 'Autumn',
    icon: '🍁',
    tones: [
      { id: 'Autumn Mute', name: 'Autumn Mute', kor: '가을 뮤트', color: '#D6D3D1' },
      { id: 'Autumn Deep', name: 'Autumn Deep', kor: '가을 딥', color: '#78350F' },
      { id: 'Autumn Warm', name: 'Autumn Warm', kor: '가을 웜 트루', color: '#D97706' },
    ]
  },
  {
    id: 'Winter',
    name: 'Winter',
    icon: '❄️',
    tones: [
      { id: 'Winter Bright', name: 'Winter Bright', kor: '겨울 브라이트', color: '#A855F7' },
      { id: 'Winter Deep', name: 'Winter Deep', kor: '겨울 딥', color: '#1E1B4B' },
      { id: 'Winter Cool', name: 'Winter Cool', kor: '겨울 쿨 트루', color: '#2563EB' },
    ]
  }
];

// Helper to flatten colors for easier lookup
export const ALL_PERSONAL_COLORS: PersonalColorTone[] = PERSONAL_COLOR_SEASONS.flatMap(s => s.tones);
