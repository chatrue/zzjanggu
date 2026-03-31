# 찐장구 (zzJanggu)

찐장구는 태블릿과 브라우저에서 바로 연주할 수 있는 초경량 장구 웹앱입니다.

- 왼쪽 면: 북편 소리
- 오른쪽 면: 채편 소리
- 터치/클릭 즉시 Web Audio로 소리 재생
- 별도 외부 패키지 없음

## 프로젝트 구조

```
zzJanggu_vercel_ready/
├─ index.html
├─ package.json
├─ server.js
├─ vercel.json
├─ README.md
├─ manifest.webmanifest
└─ src/
   ├─ app.js
   └─ styles.css
```

## 로컬 실행

Node.js 18+ 권장

```bash
npm i
npm run dev
```

브라우저에서 아래 주소를 엽니다.

```
http://localhost:3000
```

## 태블릿에서 같은 와이파이로 접속하기

맥에서 실행 중이라면 로컬 IP를 확인한 뒤 태블릿 브라우저에서 접속하면 됩니다.

```bash
ipconfig getifaddr en0
```

예시:

```
http://192.168.0.15:3000
```

## Vercel 배포

이 프로젝트는 정적 파일 기반이라 Vercel에 올리기 쉽습니다.

### 방법 1: GitHub로 배포
1. 이 프로젝트를 GitHub 저장소에 올립니다.
2. Vercel에서 **Add New → Project**를 선택합니다.
3. 해당 저장소를 Import 합니다.
4. Framework Preset은 **Other** 로 두고 배포합니다.
5. 특별한 환경변수는 필요 없습니다.

### 방법 2: Vercel 대시보드에서 업로드
1. 압축을 풀어 프로젝트 폴더를 준비합니다.
2. Vercel에서 새 프로젝트를 만들고 폴더를 업로드합니다.
3. 그대로 배포하면 됩니다.

## 커스터마이징

- 텍스트/레이아웃: `src/app.js`
- 장구 화면 스타일: `src/styles.css`
- 북편/채편 소리 합성: `src/app.js` 안의 `playBuk()`, `playChae()`

## 메모

- 첫 터치 전에는 브라우저 정책상 오디오 컨텍스트가 대기 상태일 수 있습니다. 첫 터치 후 정상 재생됩니다.
- Vercel 배포 시에도 동일하게 브라우저 안에서 오디오가 재생됩니다.

## Footer

앱 하단에는 다음 문구가 들어갑니다.

```
Made by Chatrue
```


## 아이콘 파일

더 단순한 스타일의 장구 아이콘 파일을 함께 포함했습니다.

- `assets/favicon.png`
- `assets/icon-192.png`
- `assets/icon-512.png`

원하면 Vercel 배포 후 PWA 아이콘이나 홈 화면 바로가기 아이콘으로 이어서 쓸 수 있습니다.


## manifest.webmanifest 포함

이번 버전에는 홈 화면 추가를 위한 `manifest.webmanifest`를 포함했습니다.

포함 내용:
- 앱 이름: `찐장구`
- 시작 방향: 가로 모드(`landscape`)
- 표시 방식: `standalone`
- 테마 색상 / 배경색 지정
- 192 / 512 아이콘 연결

`index.html`에도 아래 항목을 연결해 두었습니다.
- manifest 링크
- theme-color
- Apple 웹앱 메타 태그
