판정: PASS
# RESULT R8 W2c — 서비스 영상 3종

버전: R8 W2c · 2026-10-16 KST. 지정 범위인 모션그래픽·브랜드 홍보·SNS 광고만 재렌더했다. 이 판정은 렌더 결과의 **자체 검증**이며 독립 검토·사이트 통합·배포 판정이 아니다.

## 최종 사양

ffprobe와 최종 AAC 재측정값이다. 3종 모두 H.264 High / yuv420p / BT.709, MP4 faststart(moov가 mdat 앞), 오디오 1트랙이며 전체 디코딩 exit 0·오류 출력 0이다. 길이 29.5~30.5초·각 6,000,000 bytes 이하 조건을 만족했다.

| 영상 | 길이 | 화면 | 용량 | 오디오 실측 | loudnorm I / TP / LRA |
|---|---|---|---|---|---|
| 모션그래픽 (`motion-graphics`) | 29.533333초 | 1280×720 · 30fps · 886프레임 | 3,351,347 bytes (3.351 MB) | AAC LC · 48kHz · 2ch · 138.833 kbps | -16.04 LUFS / -1.61 dBTP / 3.10 LU |
| 브랜드 홍보 (`brand-film`) | 30.000000초 | 1280×720 · 30fps · 900프레임 | 4,382,523 bytes (4.383 MB) | AAC LC · 48kHz · 2ch · 127.959 kbps | -16.16 LUFS / -1.41 dBTP / 7.40 LU |
| SNS 광고 (`ad`) | 29.533333초 | 720×1280 · 30fps · 886프레임 | 2,960,956 bytes (2.961 MB) | AAC LC · 48kHz · 2ch · 141.505 kbps | -16.02 LUFS / -3.70 dBTP / 3.70 LU |

인코더 설정은 `-c:a aac -b:a 128k -ar 48000`이다. 표는 AAC가 실제로 기록한 평균 비트레이트로, 설정한 목표 비트레이트와 구분했다. loudnorm은 **완성 MP4를 다시 측정한 input_i/input_tp/input_lra**이며 로그의 output_*를 완성본 음량으로 쓰지 않았다.

## 산출물·재현 자료

- 영상·포스터: `public/content-examples/{motion-graphics,brand-film,ad}/service-reel-r8.mp4`, `service-reel-r8-poster.webp`.
- 서비스별 `docs/renewal-2026-10-13/service-reels-r8/<id>/`: 기존 `build.py`·`config.js`, 갱신한 `index.html`, `verification.json`(ffprobe 전문·loudnorm·출력 SHA-256·직접 프레임 확인), `music-audit.json`, `source-audit.json`, `layout-audit.json`, `render-inputs.sha256.json`, `baseline.json`.
- W2c 전용 구성·검사: `service-reels-r8/motion-graphics/layout.js`, `audit.py`. 브랜드·SNS 제작 HTML도 이 렌더 전용 구성을 참조한다. 앱 코드와 공유 `hero-reel-r8` 파일은 수정하지 않았다.
- 이전 MP4·포스터·프레임 캐시는 `.qa/r8-w2/w2c-baseline/<id>/`에 보존하고 `baseline.json`에 경로·해시를 기록했다. 고객 폴더 원본은 읽기만 했으며 사용 소스의 최종 SHA-256도 최초 추출 기록과 일치했다.
- 프레임: `.qa/r8-w2/frames/<id>/w2c_*.png`, `w2c-contact-360.jpg`. 모션그래픽 20.5초 AI 인물 고지는 `w2c-golf-disclosure.png`로 추가 확인했다.
- 최종 사양 요약은 `.qa/r8-w2/<id>-spec.json`도 현재 출력의 해시·수치로 갱신했다.

## 음악·박자

| 영상 | 추천 음원·작곡가 | 직접 재분석 피크 / 채택 격자 | 마디·완성 길이 |
|---|---|---|---|
| 모션그래픽 | m04 Goodnightmare · Kevin MacLeod | 130.02 / 130 BPM | 16마디 · 29.533초 |
| 브랜드 홍보 | m05 Motions · Rafael Krux | 120.18 / 120 BPM | 15마디 · 30.000초 |
| SNS 광고 | m06 Backbeat · Kevin MacLeod | 130.02 / 130 BPM | 16마디 · 29.533초 |

`.qa/r8-music/` 원본을 최대 90초(Backbeat는 곡 전체 약 46초) 디코딩해 STFT spectral flux와 70~180 BPM 자기상관을 새로 계산했다. Goodnightmare의 86.66 BPM은 3:2 관계 대안이고 Motions는 박이 약하므로 승인된 130/120/130 격자를 사용했다. 컷마다 마디선과의 오차는 30fps 반 프레임(16.7ms) 이하다. 음악 시작 위상은 각각 0.245/0.240/0.015초이며 80ms 페이드 인·마지막 3초 페이드 아웃, 2-pass `loudnorm=I=-16:TP=-1.5:LRA=11`을 적용했다.

원본 영상 오디오는 프레임 추출·화면 인코딩 단계의 `-an`으로 전부 버렸다. 성우·기존 BGM·효과음을 섞지 않고 지정 음원 한 트랙만 넣었다. 음악 파일 사본을 저장소에 추가하지 않았다. 곡 해시는 서비스별 `music-audit.json`, 승인된 FreePD CC0 근거는 기존 `license-evidence-r8/`에 있다. 크레딧 인계: `Goodnightmare — Kevin MacLeod`, `Motions — Rafael Krux`, `Backbeat — Kevin MacLeod` (FreePD, CC0). 푸터 적용은 W2 범위다.

## 프레임·제외 구간 확인

| 영상 | 직접 본 최종 프레임 | 렌더 전 레이아웃 | 확인 결과 |
|---|---|---|---|
| 모션그래픽 | 16장 + AI 인물 확인 1장 | 27시점 | 자막 잘림 0, 고객명 제목·CTA 0, 연락처 끝카드 0, 생성 인물 고지 확인 |
| 브랜드 홍보 | 16장 | 42시점 | 자막 잘림 0, 자체 고객명 자막 0, 제조사 원본 영상 0, 공식 사진 출처 보존 |
| SNS 광고 | 20장 | 39시점 | 자막 잘림 0, 고객명 제목·CTA 0, 화장실 컷 0, 연락처 끝카드 0, AI 인물 고지 확인 |

총 53장 최종 프레임을 직접 보고 360px 축소본도 확인했다. 주 자막은 가로 기본 76/52px(360px에서 약 21.4/14.6px), 세로 기본 60/38px(약 30/19px)이며 제품 엔딩의 작은 자막도 약 14px 이상이다. 큰 줄·작은 줄 구조와 작은 줄 22자 이하를 유지하고 자체 자막에서 고객명·가격·성과·최고 표현을 사용하지 않았다. 실제 제품 라벨·고객 로고·원본 그대로인 로고형 낙관은 명세의 허용 범위로 유지했다.

힐러넷 가로는 준비 소스 최대 23.0초, 세로 최대 11.7초까지만 사용해 26.0/12.5초 이후 연락처를 배제했다. 진상품은 `[8.3,12.3)`, `[14.8,18.8)`, `[20.6,22.6)`만 사용해 두 화장실 구간과 겹치지 않는다. 모션코믹·87언니·CC BY 크레딧 소스는 이 3종에서 사용하지 않았다. 제조사 원본 `웹/`·`Magirus_공식/`은 사용하지 않았다.

모션그래픽의 원본 CASE/고객명 제목과 S1의 한글·영문 고객명 제목·CTA를 제품 라벨과 구분해 정리했다. 원본 S1 하단 `AI 음성 · 연출 이미지 · 개인에 따라 차이가 있을 수 있습니다` 고지는 유지했다. S1 `docs/credits.md`의 골프 생성 이미지(job 258617b0)를 확인해 모션그래픽 해당 샷에도 AI 가상인물 고지를 넣었다. SNS 진상품 AI 인물 샷에서도 고지가 계속 보인다. 브랜드의 `사진 Magirus 공식` 표기를 가리지 않도록 자체 태그를 좌상단으로 옮겼고, 854×480 소방로봇은 원해상도 가로 창에 배치했다.

전체가 정지 이미지를 나열하는 방식이 아니라 원본 움직임·키네틱 타이포·실제 영상 발췌·컷 전환과 마무리 페이드를 사용한다. 검증은 대표 프레임과 컷 전후 레이아웃·전체 디코딩에 대한 것이며 모든 프레임의 OCR 검사를 실시한 것은 아니다.

## 실행 명령·결과

각 id에 대해 아래 작업을 **순차로** 실행했다(추가 수정은 해당 프레임 구간만 보존·재렌더 후 MP4 전체를 다시 인코딩·검증).

```powershell
python docs/renewal-2026-10-13/service-reels-r8/motion-graphics/audit.py preflight <id>
python docs/renewal-2026-10-13/service-reels-r8/<id>/build.py shots
python docs/renewal-2026-10-13/service-reels-r8/<id>/build.py render
python docs/renewal-2026-10-13/service-reels-r8/<id>/build.py encode
python docs/renewal-2026-10-13/service-reels-r8/motion-graphics/audit.py final <id>
ffmpeg -v error -i public/content-examples/<id>/service-reel-r8.mp4 -f null -
```

모든 명령 exit 0. 레이아웃 108시점에서 자체 자막 금지 문자열·화면 밖 글자 0건, 원본 해시·제외 구간·마디 격자 검사 PASS. Chrome/Playwright는 한 영상씩 실행하고 `finally: browser.close()`와 Playwright 컨텍스트 종료로 매번 닫았다. 최종 소유 브라우저·렌더 프로세스가 남지 않았는지도 확인했다. 패키지 설치·유료 생성·커밋·push는 실행하지 않았다.

## NOT_RUN·인계

히어로 릴, 소리 켜기 UI, 슬롯 연결, 앱 코드 수정, typecheck/lint/전체 테스트, next build, 사이트 재생·소리 토글·reduced-motion 검증은 이번 W2c 범위 밖이므로 NOT_RUN이다. W2가 세 MP4·포스터를 연결한 뒤 통합 검증하고 코디네이터가 독립 검토를 진행해야 한다. 사람의 음악 청취·실제 휴대폰·Safari/Firefox 재생·배포·게시·실사용 검증도 NOT_RUN이다. 파일 제작·자체 검사 완료이며 서비스 적용이나 배포 완료를 뜻하지 않는다.
