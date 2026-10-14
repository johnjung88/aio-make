/** MCN 현행 계정 AGENTS와 채택 자산 근거 / 사용자 확정 범위: 4계정
 * 피드는 기존 기준 이미지로 편집한 구성 예시이며 게시물이나 성과를 주장하지 않음
 */
export const creatorRoster = [
  {
    id:"unnie87", name:"기록하는87", category:"뷰티 · 자기관리",
    line:"나를 돌보는 일상을 기록하는 87언니",
    bio:"뷰티와 자기관리를 영상일기처럼 풀어내는 AI 가상인물",
    direction:"컨텐츠 주제 · 뷰티 루틴과 일상 속 제품 장면",
    account:"인스타그램 @from1987.diary",
    portrait:"/content-site/ai-influencer/unnie87-face.webp",
    images:[
      {src:"/content-site/ai-influencer/unnie87-street.webp",label:"가벼운 외출",caption:"거리의 빛과 편안한 차림으로 잡은 일상 분위기"},
      {src:"/content-site/ai-influencer/unnie87-front.webp",label:"얼굴의 기준",caption:"이미지와 영상에서 이어갈 인물의 인상"},
      {src:"/content-site/ai-influencer/unnie87-full.webp",label:"전체 스타일",caption:"헤어와 의상, 실루엣을 확인하는 기준 컷"},
    ],
  },
  {
    id:"yeopjip", name:"옆집엄마", category:"리빙 · 라이프스타일",
    line:"첫 집을 채워가는 신혼의 작은 순간들",
    bio:"퇴근 후 루틴과 주말의 일상을 담는 새댁 콘셉트의 AI 가상인물",
    direction:"컨텐츠 주제 · 신혼 생활과 집 안의 루틴",
    account:"리빙과 일상을 담는 계정 콘셉트",
    portrait:"/content-site/ai-influencer/yeopjip-portrait.webp",
    images:[
      {src:"/content-site/ai-influencer/yeopjip-style.webp",label:"편안한 니트 차림",caption:"집에서의 일상에 맞춘 부드러운 색과 의상"},
      {src:"/content-site/ai-influencer/yeopjip-portrait.webp",label:"밝은 인상",caption:"일상 컨텐츠에 사용할 얼굴과 표정의 기준"},
      {src:"/content-site/ai-influencer/yeopjip-detail.webp",label:"옆모습의 디테일",caption:"각도가 바뀌어도 유지할 헤어와 얼굴"},
    ],
  },
  {
    id:"grace", name:"그레이스의정원", category:"시니어 · 라이프스타일",
    line:"나를 위해 보내는 60대의 새로운 일상",
    bio:"은발의 단정한 스타일과 다정한 말투를 가진 AI 가상인물",
    direction:"컨텐츠 주제 · 일상의 취향과 시니어 스타일",
    account:"유튜브 @grace.garden.61",
    portrait:"/content-site/ai-influencer/grace-portrait.webp",
    images:[
      {src:"/content-site/ai-influencer/grace-style.webp",label:"외출하는 날",caption:"트렌치코트와 은발로 표현한 단정한 취향"},
      {src:"/content-site/ai-influencer/grace-portrait.webp",label:"여유로운 표정",caption:"편안한 대화를 떠올리게 하는 인물의 인상"},
      {src:"/content-site/ai-influencer/grace-full.webp",label:"스카프로 더한 색",caption:"차분한 의상에 작은 포인트를 주는 스타일"},
    ],
  },
  {
    id:"ssal", name:"쌀만드는아저씨", category:"농업 · 귀농 라이프스타일",
    line:"은퇴 후 고향에서 시작하는 쌀농사 이야기",
    bio:"농사와 시골 생활을 전하는 60대 남성 콘셉트의 AI 가상인물",
    direction:"컨텐츠 주제 · 쌀농사와 계절에 따른 귀농 생활",
    account:"농업과 귀농 생활을 담는 계정 콘셉트",
    portrait:"/content-site/ai-influencer/ssal-portrait.webp",
    images:[
      {src:"/content-site/ai-influencer/ssal-farm.webp",label:"농사짓는 풍경",caption:"들판을 배경으로 잡은 귀농 생활의 장면"},
      {src:"/content-site/ai-influencer/ssal-portrait.webp",label:"차분한 인상",caption:"농사 이야기를 전할 인물의 얼굴 기준"},
      {src:"/content-site/ai-influencer/ssal-full.webp",label:"평소의 차림",caption:"일터 밖의 모습까지 이어가는 인물 설정"},
    ],
  },
] as const;
