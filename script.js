// Firebase 설정
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDfbFyvWTHP0LwxkALGsrG4vEvW-gkwpZY",
  authDomain: "gf-to-do-list.firebaseapp.com",
  databaseURL: "https://gf-to-do-list-default-rtdb.firebaseio.com/",
  projectId: "gf-to-do-list",
  storageBucket: "gf-to-do-list.firebasestorage.app",
  messagingSenderId: "739611833036",
  appId: "1:739611833036:web:08e19be1977f4142740869"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.currentFilter = 'all';
        this.editingId = null;
        this.userId = this.generateUserId();
        
        this.initializeElements();
        this.bindEvents();
        this.loadTodos();
        this.updateStats();
        this.checkLoginStatus();
    }

    generateUserId() {
        let userId = localStorage.getItem('todoUserId');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('todoUserId', userId);
        }
        return userId;
    }

    initializeElements() {
        this.todoInput = document.getElementById('todoInput');
        this.addBtn = document.getElementById('addBtn');
        this.prioritySelect = document.getElementById('prioritySelect');
        this.todoList = document.getElementById('todoList');
        this.emptyState = document.getElementById('emptyState');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.clearCompletedBtn = document.querySelector('.clear-completed-btn');
        this.loginBtn = document.getElementById('loginBtn');
        this.logoutBtn = document.getElementById('logoutBtn');
        this.welcomeMessage = document.getElementById('welcomeMessage');
        this.welcomeText = document.getElementById('welcomeText');
        
        // 모달 관련 요소들
        this.completedModal = document.getElementById('completedModal');
        this.closeModal = document.getElementById('closeModal');
        this.completedList = document.getElementById('completedList');
        this.restoreAllBtn = document.getElementById('restoreAllBtn');
        this.deleteAllCompletedBtn = document.getElementById('deleteAllCompletedBtn');
        
        // 통계 요소들
        this.totalCount = document.getElementById('totalCount');
        this.activeCount = document.getElementById('activeCount');
        this.completedCount = document.getElementById('completedCount');
    }

    bindEvents() {
        // 로그인 버튼
        this.loginBtn.addEventListener('click', () => {
            window.location.href = 'login.html';
        });

        // 로그아웃 버튼
        this.logoutBtn.addEventListener('click', async () => {
            if (confirm('로그아웃하시겠습니까?')) {
                try {
                    // Firebase에서 로그아웃
                    await signOut(auth);
                    
                    // 로컬 스토리지 정리
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('userEmail');
                    localStorage.removeItem('userName');
                    localStorage.removeItem('userUid');
                    
                    window.location.reload();
                } catch (error) {
                    console.error('로그아웃 오류:', error);
                    // Firebase 로그아웃 실패해도 로컬 정리
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('userEmail');
                    localStorage.removeItem('userName');
                    localStorage.removeItem('userUid');
                    window.location.reload();
                }
            }
        });

        // 할일 추가
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        // 필터 버튼들
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.render();
            });
        });

        // 완료된 항목 삭제 버튼
        this.clearCompletedBtn.addEventListener('click', () => this.showCompletedModal());

        // 모달 관련 이벤트
        this.closeModal.addEventListener('click', () => this.hideCompletedModal());
        this.completedModal.addEventListener('click', (e) => {
            if (e.target === this.completedModal) {
                this.hideCompletedModal();
            }
        });

        // 모든 완료 취소 버튼
        this.restoreAllBtn.addEventListener('click', () => this.restoreAllCompleted());

        // 모든 완료 삭제 버튼
        this.deleteAllCompletedBtn.addEventListener('click', () => this.deleteAllCompleted());
    }

    showCompletedModal() {
        const completedTodos = this.todos.filter(t => t.completed);
        
        if (completedTodos.length === 0) {
            alert('완료된 할일이 없습니다.');
            return;
        }

        this.renderCompletedList(completedTodos);
        this.completedModal.style.display = 'flex';
    }

    hideCompletedModal() {
        this.completedModal.style.display = 'none';
    }

    renderCompletedList(completedTodos) {
        this.completedList.innerHTML = completedTodos.map(todo => this.createCompletedTodoHTML(todo)).join('');
        
        // 완료된 할일의 이벤트 리스너 바인딩
        this.bindCompletedTodoEvents();
    }

    createCompletedTodoHTML(todo) {
        const priorityClass = `priority-${todo.priority}`;
        const priorityText = {
            low: '낮음',
            medium: '보통',
            high: '높음'
        }[todo.priority];

        const date = new Date(todo.createdAt).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // 작성자 정보 표시
        const authorName = todo.author ? todo.author.name : '익명 사용자';
        const authorDisplay = todo.author && todo.author.isLoggedIn ? 
            `<span class="author-badge">👤 ${authorName}</span>` : 
            `<span class="author-badge anonymous">👤 ${authorName}</span>`;

        return `
            <div class="completed-todo-item" data-id="${todo.id}">
                <div class="completed-todo-content">
                    <div class="completed-todo-text">${this.escapeHtml(todo.text)}</div>
                    <div class="completed-todo-meta">
                        <span class="todo-date">
                            <i class="fas fa-calendar-alt"></i>
                            ${date}
                        </span>
                        <span class="priority-badge ${priorityClass}">${priorityText}</span>
                        ${authorDisplay}
                    </div>
                </div>
                <div class="completed-todo-actions">
                    <button class="completed-action-btn restore-btn" title="완료 취소">
                        <i class="fas fa-undo"></i>
                    </button>
                    <button class="completed-action-btn delete-btn" title="삭제">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    bindCompletedTodoEvents() {
        // 완료 취소 버튼 이벤트
        this.completedList.querySelectorAll('.restore-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const todoId = parseInt(e.target.closest('.completed-todo-item').dataset.id);
                this.restoreTodo(todoId);
            });
        });

        // 삭제 버튼 이벤트
        this.completedList.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const todoId = parseInt(e.target.closest('.completed-todo-item').dataset.id);
                if (confirm('이 할일을 삭제하시겠습니까?')) {
                    this.deleteTodo(todoId);
                }
            });
        });
    }

    async restoreTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = false;
            await this.saveTodos();
            this.render();
            this.updateStats();
            this.hideCompletedModal();
            this.showCompletedModal(); // 모달 새로고침
        }
    }

    async restoreAllCompleted() {
        if (confirm('모든 완료된 할일을 취소하시겠습니까?')) {
            this.todos.forEach(todo => {
                if (todo.completed) {
                    todo.completed = false;
                }
            });
            await this.saveTodos();
            this.render();
            this.updateStats();
            this.hideCompletedModal();
        }
    }

    async deleteAllCompleted() {
        if (confirm('모든 완료된 할일을 삭제하시겠습니까?')) {
            this.todos = this.todos.filter(t => !t.completed);
            await this.saveTodos();
            this.render();
            this.updateStats();
            this.hideCompletedModal();
        }
    }

    checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const userEmail = localStorage.getItem('userEmail');
        const userName = localStorage.getItem('userName');
        
        if (isLoggedIn === 'true' && userEmail) {
            const displayName = userName || userEmail;
            
            // 로그인 버튼 숨기고 로그아웃 버튼 표시
            this.loginBtn.style.display = 'none';
            this.logoutBtn.style.display = 'flex';
            
            // 환영 메시지 표시
            this.welcomeMessage.style.display = 'flex';
            this.welcomeText.textContent = `${displayName}님, 환영합니다!`;
            
            // 환영 메시지 애니메이션
            setTimeout(() => {
                this.welcomeMessage.style.opacity = '1';
            }, 100);
            
        } else {
            // 로그아웃 상태: 로그인 버튼 표시, 로그아웃 버튼 숨기기
            this.loginBtn.style.display = 'flex';
            this.logoutBtn.style.display = 'none';
            this.welcomeMessage.style.display = 'none';
        }
    }

    async loadTodos() {
        try {
            const todosRef = ref(database, `todos/${this.userId}`);
            const snapshot = await get(todosRef);
            
            if (snapshot.exists()) {
                this.todos = snapshot.val();
            } else {
                // Firebase에 데이터가 없으면 로컬 스토리지에서 로드
                this.todos = JSON.parse(localStorage.getItem('todos')) || [];
            }
            
            this.render();
            this.updateStats();
            
            // 실시간 동기화 설정
            onValue(todosRef, (snapshot) => {
                if (snapshot.exists()) {
                    this.todos = snapshot.val();
                } else {
                    this.todos = [];
                }
                this.render();
                this.updateStats();
            });
            
        } catch (error) {
            console.error('Firebase에서 데이터를 불러오는 중 오류:', error);
            // 오류 시 로컬 스토리지에서 백업 데이터 로드
            this.todos = JSON.parse(localStorage.getItem('todos')) || [];
            this.render();
            this.updateStats();
        }
    }

    async saveTodos() {
        try {
            const todosRef = ref(database, `todos/${this.userId}`);
            await set(todosRef, this.todos);
            
            // 로컬 스토리지에도 백업 저장
            localStorage.setItem('todos', JSON.stringify(this.todos));
        } catch (error) {
            console.error('Firebase에 데이터를 저장하는 중 오류:', error);
            // 오류 시 로컬 스토리지에만 저장
            localStorage.setItem('todos', JSON.stringify(this.todos));
        }
    }

    async addTodo() {
        const text = this.todoInput.value.trim();
        if (!text) return;

        // 현재 로그인된 사용자 정보 가져오기
        const userEmail = localStorage.getItem('userEmail');
        const userName = localStorage.getItem('userName');
        const userUid = localStorage.getItem('userUid');
        const isLoggedIn = localStorage.getItem('isLoggedIn');

        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            priority: this.prioritySelect.value,
            createdAt: new Date().toISOString(),
            // 작성자 정보 추가
            author: {
                name: userName || '익명 사용자',
                email: userEmail || 'anonymous@example.com',
                uid: userUid || 'anonymous',
                isLoggedIn: isLoggedIn === 'true'
            }
        };

        this.todos.unshift(todo);
        await this.saveTodos();
        this.render();
        this.updateStats();
        
        // 입력 필드 초기화
        this.todoInput.value = '';
        this.prioritySelect.value = 'medium';
        this.todoInput.focus();
    }

    async toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            await this.saveTodos();
            this.render();
            this.updateStats();
        }
    }

    async deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        await this.saveTodos();
        this.render();
        this.updateStats();
    }

    async editTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;

        const newText = prompt('할일을 수정하세요:', todo.text);
        if (newText !== null && newText.trim() !== '') {
            todo.text = newText.trim();
            await this.saveTodos();
            this.render();
        }
    }

    async clearCompleted() {
        if (confirm('완료된 항목들을 모두 삭제하시겠습니까?')) {
            this.todos = this.todos.filter(t => !t.completed);
            await this.saveTodos();
            this.render();
            this.updateStats();
        }
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(t => !t.completed);
            case 'completed':
                return this.todos.filter(t => t.completed);
            default:
                return this.todos;
        }
    }

    render() {
        const filteredTodos = this.getFilteredTodos();
        
        if (filteredTodos.length === 0) {
            this.todoList.style.display = 'none';
            this.emptyState.style.display = 'block';
        } else {
            this.todoList.style.display = 'block';
            this.emptyState.style.display = 'none';
            
            this.todoList.innerHTML = filteredTodos.map(todo => this.createTodoHTML(todo)).join('');
            
            // 이벤트 리스너 다시 바인딩
            this.bindTodoEvents();
        }
    }

    createTodoHTML(todo) {
        const priorityClass = `priority-${todo.priority}`;
        const priorityText = {
            low: '낮음',
            medium: '보통',
            high: '높음'
        }[todo.priority];

        const date = new Date(todo.createdAt).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // 작성자 정보 표시
        const authorName = todo.author ? todo.author.name : '익명 사용자';
        const authorDisplay = todo.author && todo.author.isLoggedIn ? 
            `<span class="author-badge">👤 ${authorName}</span>` : 
            `<span class="author-badge anonymous">👤 ${authorName}</span>`;

        return `
            <div class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                <div class="todo-content">
                    <div class="todo-text">${this.escapeHtml(todo.text)}</div>
                    <div class="todo-meta">
                        <span class="todo-date">
                            <i class="fas fa-calendar-alt"></i>
                            ${date}
                        </span>
                        <span class="priority-badge ${priorityClass}">${priorityText}</span>
                        ${authorDisplay}
                    </div>
                </div>
                <div class="todo-actions">
                    <button class="action-btn edit-btn" title="수정">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" title="삭제">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    bindTodoEvents() {
        // 체크박스 이벤트
        this.todoList.querySelectorAll('.todo-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const todoId = parseInt(e.target.closest('.todo-item').dataset.id);
                this.toggleTodo(todoId);
            });
        });

        // 수정 버튼 이벤트
        this.todoList.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const todoId = parseInt(e.target.closest('.todo-item').dataset.id);
                this.editTodo(todoId);
            });
        });

        // 삭제 버튼 이벤트
        this.todoList.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const todoId = parseInt(e.target.closest('.todo-item').dataset.id);
                if (confirm('이 할일을 삭제하시겠습니까?')) {
                    this.deleteTodo(todoId);
                }
            });
        });
    }

    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const active = total - completed;

        this.totalCount.textContent = `전체: ${total}`;
        this.activeCount.textContent = `진행중: ${active}`;
        this.completedCount.textContent = `완료: ${completed}`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
