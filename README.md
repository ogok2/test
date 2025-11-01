# 고기이음 - 축산물 이력제 플랫폼

축산물 이력제의 혁신, 소비자 네트워크형 플랫폼입니다.

## 기능

- 축산물 이력번호 조회
- 소비자 평가 시스템
- 포인트 보상
- 저탄소 인증 제품 구매
- 취향 테스트 및 AI 맞춤 추천
- 커뮤니티

## 개발 환경 설정

### 필수 요구사항
- Node.js 18 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 배포

### Vercel 배포

1. [Vercel](https://vercel.com)에 로그인
2. GitHub에 프로젝트 푸시 (선택사항)
3. Vercel에서 "New Project" 클릭
4. 프로젝트 import
5. 배포 설정:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. "Deploy" 클릭

### Netlify 배포

1. [Netlify](https://www.netlify.com)에 로그인
2. "Add new site" > "Import an existing project"
3. 프로젝트 선택 또는 GitHub 연결
4. 빌드 설정:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. "Deploy site" 클릭

### GitHub Pages 배포

1. `vite.config.ts`에 base 경로 추가 필요
2. GitHub Actions를 통한 자동 배포 설정

## 기술 스택

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (아이콘)

