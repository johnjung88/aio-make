/** MCN 계정별 AGENTS·채택 자산 근거 2026-10-14 / 사용자 지시: 확인된 4계정 먼저
 * 피드는 기준 이미지로 편집한 포트폴리오이며 게시물·팔로워·실제 운영 성과가 아님
 * 미개설·미확인 핸들을 실제 계정 링크로 만들지 않음
 */
export const creatorRoster = [
  {
    id: "unnie87", name: "기록하는87", category: "뷰티 · 자기관리",
    line: "나를 돌보는 일상을 기록하는 87언니",
    bio: "뷰티와 자기관리를 영상일기처럼 풀어내는 AI 가상인물",
    direction: "담백한 말투 · 일상 속 제품 장면 · 뷰티 루틴",
    account: "인스타그램 @from1987.diary",
    portrait: "/content-site/ai-influencer/unnie87-face.webp",
    images: [
      { src: "/content-site/ai-influencer/unnie87-front.webp", label: "인물" },
      { src: "/content-site/ai-influencer/unnie87-street.webp", label: "일상" },
      { src: "/content-site/ai-influencer/unnie87-full.webp", label: "스타일" },
    ],
  },
  {
    id: "yeopjip", name: "옆집엄마", category: "리빙 · 라이프스타일",
    line: "첫 집을 채워가는 신혼의 작은 순간들",
    bio: "퇴근 후 루틴과 주말의 일상을 담는 새댁 콘셉트의 AI 가상인물",
    direction: "신혼 생활 · 집 안의 루틴 · 자연스러운 일상 장면",
    account: "리빙과 일상을 담는 계정 콘셉트",
    portrait: "/content-site/ai-influencer/yeopjip-portrait.webp",
    images: [
      { src: "/content-site/ai-influencer/yeopjip-portrait.webp", label: "인물" },
      { src: "/content-site/ai-influencer/yeopjip-style.webp", label: "스타일" },
      { src: "/content-site/ai-influencer/yeopjip-detail.webp", label: "분위기" },
    ],
  },
  {
    id: "grace", name: "그레이스의정원", category: "시니어 · 라이프스타일",
    line: "나를 위해 보내는 60대의 새로운 일상",
    bio: "은발의 단정한 스타일과 다정한 말투를 가진 AI 가상인물",
    direction: "일상의 취향 · 차분한 스타일 · 여유로운 시간",
    account: "유튜브 @grace.garden.61",
    portrait: "/content-site/ai-influencer/grace-portrait.webp",
    images: [
      { src: "/content-site/ai-influencer/grace-portrait.webp", label: "인물" },
      { src: "/content-site/ai-influencer/grace-style.webp", label: "외출" },
      { src: "/content-site/ai-influencer/grace-full.webp", label: "스타일" },
    ],
  },
  {
    id: "ssal", name: "쌀만드는아저씨", category: "농업 · 귀농 라이프스타일",
    line: "은퇴 후 고향에서 시작하는 쌀농사 이야기",
    bio: "농사와 시골 생활을 전하는 60대 남성 콘셉트의 AI 가상인물",
    direction: "쌀농사 · 계절의 변화 · 귀농 생활",
    account: "농업과 귀농 생활을 담는 계정 콘셉트",
    portrait: "/content-site/ai-influencer/ssal-portrait.webp",
    images: [
      { src: "/content-site/ai-influencer/ssal-portrait.webp", label: "인물" },
      { src: "/content-site/ai-influencer/ssal-farm.webp", label: "농사" },
      { src: "/content-site/ai-influencer/ssal-full.webp", label: "일상" },
    ],
  },
] as const;
