판정: PASS
# RESULT R8 W2b — 웹툰·AI 인플루언서 서비스 영상

버전: R8-W2b · 2026-10-16 KST. 지정된 서비스 영상 2편과 포스터를 순차 재렌더하고 자체 검증했다. 이 판정은 파일 제작·자체 검사에 대한 것이며 독립 검토·사이트 통합·배포 판정이 아니다.

## 최종 사양

ffprobe 전문은 서비스별 `verification.json`에 있다. 두 편 모두 H.264 High / yuv420p / 30fps, AAC LC 48kHz 2ch 1트랙이며 faststart(moov가 mdat 앞)다. 길이 29.5~30.5초, 각 6,000,000 bytes 이하, 전체 디코딩 exit 0·오류 출력 0을 확인했다.

| 영상 | 길이·프레임 | 해상도 | 용량 | AAC 실측 평균 | 최종 loudnorm I / TP / LRA |
|---|---|---|---|---|---|
| 웹툰 (`webtoon`) | 29.800000초 · 894프레임 | 720×1080 (2:3) | 4,975,464 bytes (4.975 MB) | 128.259 kbps | -16.03 LUFS / -4.67 dBTP / 2.50 LU |
| AI 인플루언서 (`ai-influencer`) | 29.633333초 · 889프레임 | 720×1280 (9:16) | 2,642,726 bytes (2.643 MB) | 129.438 kbps | -16.05 LUFS / -2.02 dBTP / 2.80 LU |

AAC 인코더 설정은 `-b:a 128k -ar 48000`이다. 표의 비트레이트는 완성 파일 실측값이며, 음량은 완성 MP4를 다시 측정한 `input_i / input_tp / input_lra`다. 재측정 로그의 `output_*`와 구분했다.

## 산출물·변경

- 최종 영상: `public/content-examples/{webtoon,ai-influencer}/service-reel-r8.mp4`
- 포스터: 같은 폴더의 `service-reel-r8-poster.webp`
- 각 `docs/renewal-2026-10-13/service-reels-r8/<id>/`: `build.py`, `config.js`, 수정한 `index.html`, `verification.json`, `source-audit.json`, `music-audit.json`, `layout-audit.json`, `render-inputs.sha256.json`, `baseline.json`
- W2b 전용 렌더 구성·검사: `service-reels-r8/webtoon/layout.js`, `audit.py`. AI 제작 HTML도 이 구성을 참조한다. 공유 `hero-reel-r8` 렌더러·앱 코드는 수정하지 않았다.
- 이전 후보 MP4·포스터·제작 입력·프레임 캐시는 `.qa/r8-w2/w2b-baseline/<id>/`에 보존하고 경로·SHA-256을 `baseline.json`에 남겼다. 고객 폴더 원본은 읽기만 했으며 사용 원본 해시가 기존 추출 기록과 일치했다.
- 최종 프레임: `.qa/r8-w2/frames/<id>/w2b_*.png`, `w2b-contact-360*.jpg`. `.qa/r8-w2/<id>-spec.json`도 최종 해시·수치로 갱신했다.

기존 후보의 AI 20장 격자·달력 하단이 자막에 가려지던 배치를 고쳤다. 20장 전체가 채워진 뒤 한 장이 앞으로 확대되고, 달력은 2×2 칸·`예정`·20:00·`운영 계획 예시`를 보여준다. 얼굴→전신 와이프, 세로 스크롤, 푸시인, 모자이크 등장, 실제 모션코믹·인물 영상 발췌를 사용했다. 마무리 락업 크기를 정리하고 AI 고지는 마무리까지 유지했다.

## 음악·박자·크레딧

| 영상 | 지정곡 · 작곡가 | 직접 재분석 피크 / 채택 | 컷 격자·길이 |
|---|---|---|---|
| 웹툰 | m02 Slice of Life · Bryan Teoh | 144.90 BPM (하프타임 72.50) / 145 BPM | 1마디 1.655172초 · 18마디 · 29.800초 |
| AI 인플루언서 | m03 Patron Saint of Heists · Bryan Teoh | 85.00 BPM (더블타임 170.00) / 85 BPM | 승인된 반마디 1.411765초 · 21반마디 · 29.633초 |

두 곡을 각각 90초 mono 22050Hz로 새로 디코딩하고 STFT spectral flux·70~180 BPM 자기상관(8박 배수)으로 재분석했다. 모든 컷 시작이 승인 격자와 30fps 반 프레임(16.7ms) 이내다. 음악 시작 위상은 웹툰 0.225초, AI 0.015초이며 80ms 페이드 인·마지막 3초 페이드 아웃과 2-pass `loudnorm=I=-16:TP=-1.5:LRA=11`을 적용했다.

원본 영상 오디오는 프레임 추출·화면 인코딩 단계의 `-an`으로 전부 버리고 지정 음악만 믹스했다. 성우·기존 BGM·효과음은 없다. `.qa/r8-music/` 음원 파일·관련 라이선스 증거 해시가 승인된 `license-evidence-r8/INDEX.sha256.txt`와 일치하며 음원 사본을 저장소에 추가하지 않았다. FreePD CC0 근거와 곡명·작곡가는 서비스별 `music-audit.json`에 연결했다.

W2 푸터 크레딧 인계: `Slice of Life — Bryan Teoh`, `Patron Saint of Heists — Bryan Teoh` (FreePD, CC0). 푸터 자체는 수정하지 않았다.

## 최종 프레임·제외 구간 확인

| 영상 | 최종 추출·직접 확인 | 렌더 전 컷 전후·중간 검사 | 결과 |
|---|---|---|---|
| 웹툰 | 21장 | 33시점 | 자체 자막 고객명 0, 자막 잘림 0, 제외 장면 0 |
| AI 인플루언서 | 27장 | 33시점 | 자체 자막 고객명 0, 자막 잘림 0, 효능 단정 자막 0, AI 고지 유지 |

총 48장 최종 프레임을 360px 폭 축소 시트로 직접 확인했다. 주 자막 60/38px는 이 축소본에서 약 30/19px, 고지 30px는 약 15px다. AI 주 자막은 세로 14~80%와 오른쪽 12% 제외 영역 안에 놓았다. AI 4.575초에는 20장 전부, 달력 24.342~25.188초에는 네 칸의 `예정`·20:00 전부, 마무리 28.933초에는 AI 고지와 락업이 보인다. 실제 360px 사이트 슬롯 검증은 W2 통합 범위다.

웹툰은 승인된 《1억의 구단주》 12컷과 제품 소개·선물 페이지 3장만 사용했다. 외출편 화장실·밤편 '일주일 뒤' 개선·효능 전후 연출 장면은 쓰지 않았다. 모션코믹 v04는 준비 소스 `[18.0,24.0)`만 사용해 4초 화장실 말풍선과 26~30초 CC BY 크레딧을 배제했다. 제품 소개 페이지 안의 제품 라벨·제품 보드는 명세의 로고·제품 허용 범위로 유지했다.

AI는 자막 없는 `K1/K2/K3/C4_draft.mp4`와 다른 제품 `C3_draft.mp4` 두 편을 사용했다. 효능 자막이 구워진 최종 편집본을 사용하지 않았다. 자체 자막에 고객명·가격·성과·최고 표현을 넣지 않았으며 운영 일정은 예정·연출임을 표시했다. 진상품·힐러넷 끝카드·제조사 공식 영상은 이 두 편의 소스에 포함되지 않는다.

## 실행·검증

각 id를 한 번에 하나씩 순서대로 처리했다. 아래 명령은 모두 exit 0이다.

```powershell
python docs/renewal-2026-10-13/service-reels-r8/webtoon/audit.py baseline <id>
python docs/renewal-2026-10-13/service-reels-r8/webtoon/audit.py preflight <id>
python docs/renewal-2026-10-13/service-reels-r8/<id>/build.py render
python docs/renewal-2026-10-13/service-reels-r8/<id>/build.py encode
python docs/renewal-2026-10-13/service-reels-r8/webtoon/audit.py final <id>
```

`preflight`로 대표 프레임을 추출·직접 확인한 뒤 전체 렌더를 시작했다. AI 달력 보정 후 AI 사전 검사도 재통과했다. `final`은 ffprobe·loudnorm·전체 디코딩·faststart·프레임 추출을 수행하며 영상별 `verification.json.visualReview`에는 실제 자체 육안 확인을 기록했다. Chrome/Playwright는 영상 하나씩 실행하고 브라우저와 컨텍스트를 매번 종료했다. 최종 소유 렌더·브라우저 프로세스 잔류 0을 확인했다. 다른 작업의 Chrome·서버를 종료하지 않았고 3215 포트를 건드리지 않았다.

## NOT_RUN·후속

히어로 릴·소리 UI·슬롯 연결·앱 코드 수정·typecheck/lint/전체 테스트·next build·사이트 재생/소리/reduced-motion 검증은 W2 범위로 NOT_RUN이다. 실제 휴대폰·Safari/Firefox 재생, 작업자의 음악 청취, 전 프레임 OCR, 독립 검토·커밋·push·배포·게시·실사용 검증도 NOT_RUN이다. 두 파일과 포스터를 W2가 슬롯에 연결하고 통합 검증해야 한다.
