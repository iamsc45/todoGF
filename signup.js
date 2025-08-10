// Firebase 설정
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

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
    const signupForm = document.getElementById('signupForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const submitBtn = document.querySelector('.login-submit-btn');

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        
        // 입력 검증
        if (!name || !email || !password || !confirmPassword) {
            alert('모든 필드를 입력해주세요.');
            return;
        }
        
        // 이메일 형식 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('올바른 이메일 형식을 입력해주세요.');
            return;
        }
        
        // 비밀번호 길이 검증
        if (password.length < 6) {
            alert('비밀번호는 최소 6자 이상이어야 합니다.');
            return;
        }
        
        // 비밀번호 확인 검증
        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        
        // 버튼 비활성화 및 로딩 상태
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 회원가입 중...';
        
        try {
            // Firebase Authentication으로 사용자 생성
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // 사용자 프로필 업데이트 (이름 설정)
            await updateProfile(user, {
                displayName: name
            });
            
            // Firebase Realtime Database에 사용자 정보 저장
            const userRef = ref(database, `users/${user.uid}`);
            await set(userRef, {
                name: name,
                email: email,
                createdAt: new Date().toISOString(),
                uid: user.uid
            });
            
            // 로컬 스토리지에도 백업 저장
            const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
            const newUser = {
                name: name,
                email: email,
                uid: user.uid,
                createdAt: new Date().toISOString()
            };
            existingUsers.push(newUser);
            localStorage.setItem('users', JSON.stringify(existingUsers));
            
            // 자동 로그인 상태 설정
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userName', name);
            localStorage.setItem('userUid', user.uid);
            
            alert('회원가입이 완료되었습니다!');
            window.location.href = 'index.html';
            
        } catch (error) {
            console.error('회원가입 오류:', error);
            
            let errorMessage = '회원가입 중 오류가 발생했습니다.';
            
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = '이미 사용 중인 이메일입니다.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = '올바르지 않은 이메일 형식입니다.';
                    break;
                case 'auth/weak-password':
                    errorMessage = '비밀번호가 너무 약합니다. 더 강한 비밀번호를 사용해주세요.';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = '네트워크 연결을 확인해주세요.';
                    break;
                default:
                    errorMessage = `회원가입 중 오류가 발생했습니다: ${error.message}`;
            }
            
            alert(errorMessage);
        } finally {
            // 버튼 상태 복원
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> 회원가입';
        }
    });

    // 실시간 비밀번호 확인
    confirmPasswordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (confirmPassword && password !== confirmPassword) {
            confirmPasswordInput.style.borderColor = '#dc3545';
        } else {
            confirmPasswordInput.style.borderColor = '#e9ecef';
        }
    });
});
