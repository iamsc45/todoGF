# 📝 할일 메모앱 (Todo Memo App)

Firebase 기반의 실시간 할일 관리 애플리케이션입니다.

## ✨ 주요 기능

- 🔐 **Firebase Authentication**: 안전한 로그인/회원가입
- ☁️ **Firebase Realtime Database**: 실시간 데이터 동기화
- 📱 **반응형 디자인**: 모바일/데스크톱 완벽 지원
- 🎨 **모던 UI/UX**: 아름다운 그라데이션과 애니메이션
- 👤 **작성자 정보**: 할일별 작성자 표시
- ✅ **완료 관리**: 완료된 할일 취소/삭제 기능
- 🔄 **실시간 동기화**: 여러 기기에서 실시간 업데이트

## 🛠️ 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase Authentication, Firebase Realtime Database
- **UI/UX**: Font Awesome Icons, CSS Grid/Flexbox
- **배포**: GitHub Pages

## 📁 파일 구조

```
할일프로그램/
├── index.html          # 메인 페이지
├── login.html          # 로그인 페이지
├── signup.html         # 회원가입 페이지
├── style.css           # 스타일시트
├── script.js           # 메인 JavaScript
├── login.js            # 로그인 JavaScript
├── signup.js           # 회원가입 JavaScript
└── README.md           # 프로젝트 설명서
```

## 🚀 배포 방법

### GitHub Pages 배포

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
   - GitHub 저장소 → Settings → Pages
   - Source: Deploy from a branch
   - Branch: main
   - Save

4. **배포 완료**
   - `https://yourusername.github.io/todo-app` 에서 접속 가능

### Netlify 배포

1. **Netlify 계정 생성**
2. **New site from Git** 선택
3. **GitHub 저장소 연결**
4. **배포 설정**
   - Build command: (비워두기)
   - Publish directory: `.` (루트 디렉토리)

### Vercel 배포

1. **Vercel 계정 생성**
2. **New Project** 선택
3. **GitHub 저장소 import**
4. **배포 설정**
   - Framework Preset: Other
   - Root Directory: `.`

## 🔧 로컬 개발

1. **파일 다운로드**
   ```bash
   git clone https://github.com/yourusername/todo-app.git
   cd todo-app
   ```

2. **로컬 서버 실행**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js
   npx serve .
   
   # PHP
   php -S localhost:8000
   ```

3. **브라우저에서 접속**
   ```
   http://localhost:8000
   ```

## 🔐 Firebase 설정

### 1. Firebase 프로젝트 생성
1. [Firebase Console](https://console.firebase.google.com/) 접속
2. **프로젝트 추가** 클릭
3. 프로젝트 이름 입력 (예: `todo-app`)
4. **Google Analytics** 선택 (선택사항)

### 2. Authentication 설정
1. **Authentication** → **시작하기**
2. **이메일/비밀번호** 제공업체 활성화
3. **사용자 등록** 활성화

### 3. Realtime Database 설정
1. **Realtime Database** → **데이터베이스 만들기**
2. **테스트 모드에서 시작** 선택
3. **규칙** 설정:
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

### 4. 웹 앱 등록
1. **프로젝트 개요** → **웹 앱 추가**
2. 앱 닉네임 입력 (예: `todo-app-web`)
3. **Firebase 호스팅** 선택 (선택사항)
4. **앱 등록** 클릭

### 5. 설정 정보 복사
```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## 📱 사용법

### 1. 회원가입
- **회원가입** 버튼 클릭
- 이름, 이메일, 비밀번호 입력
- **회원가입** 버튼 클릭

### 2. 로그인
- **로그인** 버튼 클릭
- 이메일과 비밀번호 입력
- **로그인** 버튼 클릭

### 3. 할일 관리
- **할일 입력** → **우선순위 선택** → **추가**
- **체크박스** 클릭으로 완료/미완료 토글
- **수정/삭제** 버튼으로 개별 관리
- **필터** 버튼으로 상태별 조회

### 4. 완료된 할일 관리
- **완료된 항목 삭제** 버튼 클릭
- **완료 취소** 또는 **삭제** 선택
- **모든 완료 취소** 또는 **모든 완료 삭제**

## 🔒 보안

- **Firebase Authentication**: 안전한 사용자 인증
- **Realtime Database Rules**: 데이터 접근 제어
- **HTTPS**: 모든 통신 암호화
- **XSS 방지**: 입력 데이터 이스케이프 처리

## 🎨 커스터마이징

### 색상 변경
```css
/* style.css에서 색상 변수 수정 */
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --success-color: #28a745;
  --danger-color: #dc3545;
}
```

### 로고 변경
```html
<!-- index.html에서 로고 수정 -->
<h1><i class="fas fa-tasks"></i> 할일 메모앱</h1>
```

## 📞 지원

- **이슈 리포트**: GitHub Issues
- **기능 요청**: GitHub Discussions
- **문의**: 이메일 또는 GitHub

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능

## 🙏 감사의 말

- **Firebase**: 백엔드 서비스 제공
- **Font Awesome**: 아이콘 제공
- **GitHub**: 무료 호스팅 제공

---

**⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요!**
