// Firebase 설정
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAALJgRcjN2mk-koQWfmc8owEUQTLphuSA",
  authDomain: "todododo-117f6.firebaseapp.com",
  databaseURL: "https://todododo-117f6-default-rtdb.firebaseio.com",
  projectId: "todododo-117f6",
  storageBucket: "todododo-117f6.firebasestorage.app",
  messagingSenderId: "81439555995",
  appId: "1:81439555995:web:a0f0b1ca6b4a434122a13e"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitBtn = document.querySelector('.login-submit-btn');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        
        if (!email || !password) {
            alert('이메일과 비밀번호를 모두 입력해주세요.');
            return;
        }
        
        // 버튼 비활성화 및 로딩 상태
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 로그인 중...';
        
        try {
            // Firebase Authentication으로 로그인
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Firebase Database에서 사용자 정보 가져오기
            const userRef = ref(database, `users/${user.uid}`);
            const snapshot = await get(userRef);
            
            let userName = user.displayName || email;
            
            if (snapshot.exists()) {
                const userData = snapshot.val();
                userName = userData.name || user.displayName || email;
            }
            
            // 로그인 상태 설정
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userName', userName);
            localStorage.setItem('userUid', user.uid);
            
            alert('로그인 성공!');
            window.location.href = 'index.html';
            
        } catch (error) {
            console.error('로그인 오류:', error);
            
            let errorMessage = '로그인 중 오류가 발생했습니다.';
            
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = '등록되지 않은 이메일입니다.';
                    break;
                case 'auth/wrong-password':
                    errorMessage = '비밀번호가 올바르지 않습니다.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = '올바르지 않은 이메일 형식입니다.';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = '너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = '네트워크 연결을 확인해주세요.';
                    break;
                default:
                    errorMessage = `로그인 중 오류가 발생했습니다: ${error.message}`;
            }
            
            alert(errorMessage);
        } finally {
            // 버튼 상태 복원
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> 로그인';
        }
    });

    // 비밀번호 잊어버림 링크
    document.querySelector('.forgot-password').addEventListener('click', (e) => {
        e.preventDefault();
        alert('비밀번호 재설정 기능은 준비 중입니다.');
    });
});
