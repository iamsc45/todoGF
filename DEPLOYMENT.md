# 🚀 배포 가이드

할일 메모앱을 다양한 플랫폼에 배포하는 방법을 안내합니다.

## 📋 사전 준비

### 1. Firebase 설정 확인
- Firebase 프로젝트가 생성되어 있는지 확인
- Authentication이 활성화되어 있는지 확인
- Realtime Database가 설정되어 있는지 확인
- 웹 앱이 등록되어 있는지 확인

### 2. 파일 준비
모든 파일이 준비되었는지 확인:
```
✅ index.html
✅ login.html
✅ signup.html
✅ style.css
✅ script.js
✅ login.js
✅ signup.js
✅ README.md
✅ package.json
✅ .gitignore
```

## 🌐 배포 옵션

### 1. GitHub Pages (추천)

#### 장점
- 무료
- 간단한 설정
- 자동 HTTPS
- 커스텀 도메인 지원

#### 배포 방법

1. **GitHub 저장소 생성**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **GitHub에 푸시**
   ```bash
   git remote add origin https://github.com/yourusername/todo-app.git
   git push -u origin main
   ```

3. **GitHub Pages 활성화**
   - GitHub 저장소 페이지로 이동
   - Settings 탭 클릭
   - Pages 메뉴 클릭
   - Source: Deploy from a branch 선택
   - Branch: main 선택
   - Save 클릭

4. **배포 확인**
   - `https://yourusername.github.io/todo-app` 에서 접속 가능
   - 배포에는 몇 분 정도 소요될 수 있습니다

### 2. Netlify

#### 장점
- 무료
- 자동 배포
- 고급 기능 제공
- 커스텀 도메인 지원

#### 배포 방법

1. **Netlify 계정 생성**
   - [netlify.com](https://netlify.com) 접속
   - GitHub 계정으로 로그인

2. **새 사이트 생성**
   - "New site from Git" 클릭
   - GitHub 선택
   - 저장소 선택

3. **배포 설정**
   - Build command: (비워두기)
   - Publish directory: `.` (루트 디렉토리)
   - Deploy site 클릭

4. **도메인 설정**
   - 자동 생성된 도메인 사용
   - 또는 커스텀 도메인 설정

### 3. Vercel

#### 장점
- 무료
- 빠른 배포
- 자동 HTTPS
- 고급 분석 기능

#### 배포 방법

1. **Vercel 계정 생성**
   - [vercel.com](https://vercel.com) 접속
   - GitHub 계정으로 로그인

2. **프로젝트 생성**
   - "New Project" 클릭
   - GitHub 저장소 import
   - Framework Preset: Other 선택

3. **배포 설정**
   - Root Directory: `.`
   - Deploy 클릭

4. **도메인 확인**
   - 자동 생성된 도메인으로 접속 가능

### 4. Firebase Hosting

#### 장점
- Firebase와 완벽 통합
- 빠른 전송 속도
- 자동 HTTPS
- 글로벌 CDN

#### 배포 방법

1. **Firebase CLI 설치**
   ```bash
   npm install -g firebase-tools
   ```

2. **Firebase 로그인**
   ```bash
   firebase login
   ```

3. **프로젝트 초기화**
   ```bash
   firebase init hosting
   ```

4. **배포 설정**
   - Use an existing project 선택
   - 프로젝트 선택
   - Public directory: `.`
   - Configure as a single-page app: No
   - Set up automatic builds: No

5. **배포**
   ```bash
   firebase deploy
   ```

## 🔧 환경별 설정

### 개발 환경

1. **로컬 서버 실행**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js
   npx serve .
   
   # PHP
   php -S localhost:8000
   ```

2. **브라우저에서 접속**
   ```
   http://localhost:8000
   ```

### 프로덕션 환경

1. **Firebase 설정 확인**
   - 프로덕션 Firebase 프로젝트 사용
   - 보안 규칙 설정 확인

2. **도메인 설정**
   - 커스텀 도메인 설정 (선택사항)
   - SSL 인증서 확인

3. **모니터링 설정**
   - Google Analytics 연결
   - Firebase Analytics 활성화

## 🔒 보안 설정

### Firebase 보안 규칙

```json
{
  "rules": {
    "todos": {
      "$uid": {
        ".read": "auth != null && auth.uid == $uid",
        ".write": "auth != null && auth.uid == $uid"
      }
    },
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid == $uid",
        ".write": "auth != null && auth.uid == $uid"
      }
    }
  }
}
```

### HTTPS 설정
- 모든 배포 플랫폼에서 자동 HTTPS 제공
- 추가 설정 불필요

## 📊 모니터링

### Google Analytics 설정

1. **Google Analytics 계정 생성**
2. **웹사이트 등록**
3. **추적 코드 추가**

```html
<!-- index.html의 head 태그에 추가 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Firebase Analytics

1. **Firebase Console에서 Analytics 활성화**
2. **이벤트 추적 설정**

## 🚨 문제 해결

### 일반적인 문제들

1. **Firebase 연결 오류**
   - Firebase 설정 확인
   - 네트워크 연결 확인
   - 브라우저 콘솔 확인

2. **배포 실패**
   - 파일 경로 확인
   - 설정 파일 확인
   - 로그 확인

3. **HTTPS 오류**
   - 배포 플랫폼의 HTTPS 설정 확인
   - Firebase 설정 확인

### 디버깅 방법

1. **브라우저 개발자 도구**
   - Console 탭에서 오류 확인
   - Network 탭에서 요청 확인

2. **Firebase Console**
   - Authentication 사용자 확인
   - Database 데이터 확인
   - Analytics 이벤트 확인

## 📞 지원

### 도움말
- [GitHub Issues](https://github.com/yourusername/todo-app/issues)
- [Firebase 문서](https://firebase.google.com/docs)
- [배포 플랫폼 문서](https://docs.github.com/pages)

### 연락처
- 이메일: your-email@example.com
- GitHub: [@yourusername](https://github.com/yourusername)

---

**배포가 완료되면 사용자들에게 공유해보세요!** 🎉
