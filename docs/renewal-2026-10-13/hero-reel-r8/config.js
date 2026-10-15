window.REEL={
  "id": "hero",
  "w": 1920,
  "h": 1080,
  "fps": 30,
  "duration": 68.0,
  "music": {
    "file": "r8-m01-arpent.mp3",
    "sha256": "ef06d8b524c196a31954dfb1f3261e7d37459e43f4afd9df31ee2965c6094a56",
    "title": "Arpent",
    "composer": "Kevin MacLeod",
    "bpm": 120.0,
    "beatSeconds": 0.5,
    "onsetPhaseSeconds": 0.265,
    "unitSeconds": 2.0,
    "units": 34,
    "duration": 68.0,
    "method": "spectral-flux autocorrelation, 8 beat multiples, 90s; phase energy grid 5ms",
    "halfBar": false,
    "expectedBpm": 120
  },
  "scenes": [
    {
      "title": "웹툰",
      "sub": "제품 이야기를 12컷·24컷으로 그립니다",
      "layout": "L2",
      "panels": [
        {
          "label": "시나리오",
          "desc": "회차를 한 편의 이야기로",
          "kind": "script",
          "src": ""
        },
        {
          "label": "컷 구성",
          "desc": "한 화면에 들어갈 컷을 짭니다",
          "kind": "grid",
          "src": "wt"
        },
        {
          "label": "작화",
          "desc": "장면과 감정을 그립니다",
          "kind": "image",
          "src": "wt4"
        },
        {
          "label": "편집",
          "desc": "말풍선과 순서를 맞춥니다",
          "kind": "scroll",
          "src": "wt"
        },
        {
          "label": "완성",
          "desc": "모션코믹으로도 만듭니다",
          "kind": "clip",
          "src": "comic"
        }
      ]
    },
    {
      "title": "애니메이션",
      "sub": "브랜드 캐릭터가 움직이는 30초·60초 영상",
      "layout": "L1",
      "panels": [
        {
          "label": "캐릭터 기획",
          "desc": "제품을 닮은 캐릭터를 정합니다",
          "kind": "poses",
          "src": "mascot"
        },
        {
          "label": "설계",
          "desc": "색·글자·움직임을 정합니다",
          "kind": "palette",
          "src": ""
        },
        {
          "label": "영상 시나리오",
          "desc": "16컷을 박자에 놓습니다",
          "kind": "beats",
          "src": ""
        },
        {
          "label": "작업·편집",
          "desc": "컷마다 박에 맞춥니다",
          "kind": "wave",
          "src": "alignment"
        },
        {
          "label": "완성",
          "desc": "30초 애니메이션 영상",
          "kind": "clip",
          "src": "s1"
        }
      ]
    },
    {
      "title": "AI 인플루언서",
      "sub": "브랜드 전용 AI 가상인물을 만듭니다",
      "layout": "L2",
      "panels": [
        {
          "label": "인물 기획",
          "desc": "나이·직업·말투를 정합니다",
          "kind": "identity",
          "src": "face"
        },
        {
          "label": "컨텐츠 기획",
          "desc": "한 편을 6컷으로 짭니다",
          "kind": "aiboard",
          "src": ""
        },
        {
          "label": "SNS 운영 기획",
          "desc": "계정 틀과 일정을 짭니다",
          "kind": "profile",
          "src": "profile"
        },
        {
          "label": "작업·업로드",
          "desc": "편집하고 올릴 시간을 정합니다",
          "kind": "clip",
          "src": "ai2"
        },
        {
          "label": "운영",
          "desc": "계정 운영은 별도 견적입니다",
          "kind": "calendar",
          "src": ""
        }
      ]
    },
    {
      "title": "모션그래픽",
      "sub": "제품과 메시지를 짧고 분명하게",
      "layout": "L1",
      "panels": [
        {
          "label": "컷 01 훅",
          "desc": "원료 4종이 박마다 팝",
          "kind": "clip",
          "src": "mg1"
        },
        {
          "label": "컷 02 자연",
          "desc": "원료 깊이와 초점 이동",
          "kind": "clip",
          "src": "mg2"
        },
        {
          "label": "컷 03 연구",
          "desc": "원형 단면과 측정 링",
          "kind": "clip",
          "src": "hero-mg3"
        },
        {
          "label": "컷 04 기술",
          "desc": "기술 4종을 같은 길이로",
          "kind": "clip",
          "src": "hero-mg4"
        },
        {
          "label": "컷 05 제품",
          "desc": "제품을 실제 병으로 완성",
          "kind": "clip",
          "src": "hero-mg6"
        }
      ]
    },
    {
      "title": "브랜드 홍보 영상",
      "sub": "회사와 브랜드를 소개하는 영상",
      "layout": "L1",
      "panels": [
        {
          "label": "오프닝",
          "desc": "로고로 시작합니다",
          "kind": "clip",
          "src": "logo"
        },
        {
          "label": "고층",
          "desc": "현장 영상으로 보여줍니다",
          "kind": "clip",
          "src": "highrise2"
        },
        {
          "label": "공항",
          "desc": "장면마다 단계를 나눕니다",
          "kind": "clip",
          "src": "airport3"
        },
        {
          "label": "산악",
          "desc": "제품이 일하는 곳을 보입니다",
          "kind": "clip",
          "src": "mountain2"
        },
        {
          "label": "마무리",
          "desc": "제품과 로고로 닫습니다",
          "kind": "clip",
          "src": "hero-photo"
        }
      ]
    },
    {
      "title": "SNS 광고 영상",
      "sub": "세로형 9:16 숏폼 광고",
      "layout": "L1",
      "panels": [
        {
          "label": "시나리오",
          "desc": "12컷을 25초에 짭니다",
          "kind": "acts",
          "src": ""
        },
        {
          "label": "이미지",
          "desc": "컷마다 기준 이미지를 정합니다",
          "kind": "grid",
          "src": "adimg"
        },
        {
          "label": "영상",
          "desc": "이미지를 4초 클립으로",
          "kind": "clip",
          "src": "addraft"
        },
        {
          "label": "편집",
          "desc": "자막과 소리를 얹습니다",
          "kind": "edit",
          "src": "hero-ad1"
        },
        {
          "label": "완성",
          "desc": "25초 광고 한 편",
          "kind": "clip",
          "src": "hero-ad2"
        }
      ]
    }
  ]
};
