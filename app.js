import { addTodo, getTodos, updateTodo, deleteTodo } from './todoService.js';

console.log("App starting...");

class TodoApp {
    constructor() {
        this.todos = [];
        this.init();
    }

    async init() {
        console.log("Initializing app...");
        this.bindEvents();
        await this.loadTodos();
    }

    bindEvents() {
        const addBtn = document.getElementById('addBtn');
        const todoInput = document.getElementById('todoInput');

        // Add todo on button click
        addBtn.addEventListener('click', () => {
            console.log("Add button clicked!");
            this.handleAddTodo();
        });
        
        // Add todo on Enter key press
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleAddTodo();
            }
        });
    }

    async handleAddTodo() {
        console.log("handleAddTodo called");
        const todoInput = document.getElementById('todoInput');
        const todoText = todoInput.value.trim();
        
        console.log("Todo text:", todoText);
        
        if (!todoText) {
            this.showError('Please enter a todo item');
            return;
        }

        if (todoText.length > 200) {
            this.showError('Todo text is too long (max 200 characters)');
            return;
        }

        try {
            console.log("Adding todo to Firebase...");
            this.setLoading(true);
            await addTodo(todoText);
            console.log("Todo added successfully!");
            todoInput.value = '';
            await this.loadTodos();
            this.hideError();
        } catch (error) {
            console.error("Error adding todo:", error);
            this.showError('Failed to add todo: ' + error.message);
        } finally {
            this.setLoading(false);
        }
    }

    async loadTodos() {
        try {
            this.setLoading(true);
            this.todos = await getTodos();
            this.renderTodos();
            this.updateStats();
            this.hideError();
        } catch (error) {
            this.showError('Failed to load todos: ' + error.message);
        } finally {
            this.setLoading(false);
        }
    }

    renderTodos() {
        const todoList = document.getElementById('todoList');
        
        if (this.todos.length === 0) {
            todoList.innerHTML = '<li class="empty-state">No todos yet. Add one above!</li>';
            return;
        }

        todoList.innerHTML = this.todos.map(todo => `
            <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    onchange="app.toggleTodo('${todo.id}', this.checked)"
                >
                <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                <span class="todo-date">${this.formatDate(todo.createdAt)}</span>
                <button class="delete-btn" onclick="app.deleteTodoItem('${todo.id}')">Delete</button>
            </li>
        `).join('');
    }

    async toggleTodo(todoId, completed) {
        try {
            await updateTodo(todoId, { completed });
            await this.loadTodos();
        } catch (error) {
            this.showError('Failed to update todo: ' + error.message);
        }
    }

    async deleteTodoItem(todoId) {
        if (!confirm('Are you sure you want to delete this todo?')) {
            return;
        }

        try {
            await deleteTodo(todoId);
            await this.loadTodos();
        } catch (error) {
            this.showError('Failed to delete todo: ' + error.message);
        }
    }

    updateStats() {
        const totalTodos = this.todos.length;
        const completedTodos = this.todos.filter(todo => todo.completed).length;
        
        document.getElementById('totalTodos').textContent = `Total: ${totalTodos}`;
        document.getElementById('completedTodos').textContent = `Completed: ${completedTodos}`;
    }

    setLoading(loading) {
        const loadingEl = document.getElementById('loading');
        const addBtn = document.getElementById('addBtn');
        
        loadingEl.style.display = loading ? 'block' : 'none';
        addBtn.disabled = loading;
    }

    showError(message) {
        const errorEl = document.getElementById('error');
        errorEl.textContent = message;
        errorEl.style.display = 'block';
        
        // Auto-hide error after 5 seconds
        setTimeout(() => this.hideError(), 5000);
    }

    hideError() {
        const errorEl = document.getElementById('error');
        errorEl.style.display = 'none';
    }

    formatDate(timestamp) {
        if (!timestamp || !timestamp.toDate) {
            return 'Just now';
        }
        
        const date = timestamp.toDate();
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            return 'Today';
        } else if (diffDays === 2) {
            return 'Yesterday';
        } else if (diffDays <= 7) {
            return `${diffDays - 1} days ago`;
        } else {
            return date.toLocaleDateString();
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, initializing app...");
    window.app = new TodoApp();
});

console.log("App script loaded");