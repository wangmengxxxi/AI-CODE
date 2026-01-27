class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.currentEditId = null;
        this.initializeElements();
        this.bindEvents();
        this.renderTasks();
        this.updateStats();
    }

    initializeElements() {
        // 表单元素
        this.taskForm = document.getElementById('task-form');
        this.taskIdInput = document.getElementById('task-id');
        this.taskTitleInput = document.getElementById('task-title');
        this.taskDescriptionInput = document.getElementById('task-description');
        this.taskPrioritySelect = document.getElementById('task-priority');
        this.taskDueDateInput = document.getElementById('task-due-date');
        this.formTitle = document.getElementById('form-title');
        this.saveBtn = document.getElementById('save-btn');
        this.cancelBtn = document.getElementById('cancel-btn');

        // 过滤器元素
        this.searchInput = document.getElementById('search-input');
        this.priorityFilter = document.getElementById('priority-filter');
        this.statusFilter = document.getElementById('status-filter');

        // 任务列表元素
        this.tasksList = document.getElementById('tasks-list');
        this.totalTasksSpan = document.getElementById('total-tasks');
    }

    bindEvents() {
        // 表单事件
        this.taskForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        this.cancelBtn.addEventListener('click', () => this.resetForm());

        // 过滤器事件
        this.searchInput.addEventListener('input', () => this.filterAndRender());
        this.priorityFilter.addEventListener('change', () => this.filterAndRender());
        this.statusFilter.addEventListener('change', () => this.filterAndRender());

        // 页面点击事件（用于关闭编辑状态）
        document.addEventListener('click', (e) => {
            if (!this.taskForm.contains(e.target)) {
                this.resetForm();
            }
        });
    }

    handleFormSubmit(e) {
        e.preventDefault();

        const taskData = {
            title: this.taskTitleInput.value.trim(),
            description: this.taskDescriptionInput.value.trim(),
            priority: this.taskPrioritySelect.value,
            dueDate: this.taskDueDateInput.value,
            status: this.currentEditId ? this.getTaskById(this.currentEditId).status : 'pending',
            createdAt: this.currentEditId ? this.getTaskById(this.currentEditId).createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (!taskData.title) {
            alert('任务标题不能为空！');
            return;
        }

        if (this.currentEditId) {
            this.updateTask(this.currentEditId, taskData);
        } else {
            this.addTask(taskData);
        }

        this.resetForm();
    }

    addTask(taskData) {
        const newTask = {
            id: this.generateId(),
            ...taskData
        };
        
        this.tasks.unshift(newTask);
        this.saveToStorage();
        this.renderTasks();
        this.updateStats();
    }

    updateTask(id, taskData) {
        this.tasks = this.tasks.map(task => 
            task.id === id ? { ...task, ...taskData } : task
        );
        this.saveToStorage();
        this.renderTasks();
        this.updateStats();
    }

    deleteTask(id) {
        if (confirm('确定要删除这个任务吗？')) {
            this.tasks = this.tasks.filter(task => task.id !== id);
            this.saveToStorage();
            this.renderTasks();
            this.updateStats();
        }
    }

    toggleTaskStatus(id) {
        this.tasks = this.tasks.map(task => {
            if (task.id === id) {
                const statusMap = {
                    'pending': 'in-progress',
                    'in-progress': 'completed',
                    'completed': 'pending'
                };
                return {
                    ...task,
                    status: statusMap[task.status],
                    updatedAt: new Date().toISOString()
                };
            }
            return task;
        });
        this.saveToStorage();
        this.renderTasks();
        this.updateStats();
    }

    editTask(id) {
        const task = this.getTaskById(id);
        if (!task) return;

        this.currentEditId = id;
        this.taskIdInput.value = task.id;
        this.taskTitleInput.value = task.title;
        this.taskDescriptionInput.value = task.description;
        this.taskPrioritySelect.value = task.priority;
        this.taskDueDateInput.value = task.dueDate;
        this.formTitle.textContent = '编辑任务';
        this.saveBtn.textContent = '更新任务';

        // 滚动到表单位置
        this.taskForm.scrollIntoView({ behavior: 'smooth' });
    }

    getTaskById(id) {
        return this.tasks.find(task => task.id === id);
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    saveToStorage() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    resetForm() {
        this.taskForm.reset();
        this.taskIdInput.value = '';
        this.currentEditId = null;
        this.formTitle.textContent = '添加新任务';
        this.saveBtn.textContent = '保存任务';
    }

    formatDueDate(dueDate) {
        if (!dueDate) return '无截止日期';

        const date = new Date(dueDate);
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('zh-CN', options);

        // 判断是否临近截止日期
        if (date < today) {
            return `已过期: ${formattedDate}`;
        } else if (date.toDateString() === today.toDateString()) {
            return `今天到期: ${formattedDate}`;
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return `明天到期: ${formattedDate}`;
        }

        return `截止: ${formattedDate}`;
    }

    isDueSoon(dueDate) {
        if (!dueDate) return false;

        const date = new Date(dueDate);
        const today = new Date();
        const diffTime = date.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays <= 3 && diffDays >= 0;
    }

    filterAndRender() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const priorityFilter = this.priorityFilter.value;
        const statusFilter = this.statusFilter.value;

        let filteredTasks = this.tasks.filter(task => {
            const matchesSearch = !searchTerm || 
                task.title.toLowerCase().includes(searchTerm) || 
                (task.description && task.description.toLowerCase().includes(searchTerm));
            
            const matchesPriority = !priorityFilter || task.priority === priorityFilter;
            const matchesStatus = !statusFilter || task.status === statusFilter;

            return matchesSearch && matchesPriority && matchesStatus;
        });

        this.renderTaskList(filteredTasks);
    }

    renderTasks() {
        this.filterAndRender();
    }

    renderTaskList(tasks) {
        if (tasks.length === 0) {
            this.tasksList.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" width="48" height="48">
                        <path fill="#ccc" d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z" />
                        <path fill="#ccc" d="M17,11H7V9H17V11M17,15H7V13H17V15Z" />
                    </svg>
                    <p>没有找到匹配的任务</p>
                </div>
            `;
            return;
        }

        this.tasksList.innerHTML = tasks.map(task => {
            const isDueSoon = this.isDueSoon(task.dueDate);
            const dueDateClass = isDueSoon ? 'due-soon' : '';
            const priorityClass = `priority-${task.priority}`;

            return `
                <div class="task-item ${task.status}">
                    <div class="task-checkbox">
                        <input type="checkbox" 
                               id="task-${task.id}" 
                               ${task.status === 'completed' ? 'checked' : ''}>
                    </div>
                    <div class="task-content">
                        <h3 class="task-title">${this.escapeHtml(task.title)}</h3>
                        ${task.description ? `<p class="task-description">${this.escapeHtml(task.description)}</p>` : ''}
                        <div class="task-meta">
                            <span class="task-meta-item ${priorityClass}">
                                <svg viewBox="0 0 24 24"><path d="M12,2L2,7V17L12,22L22,17V7L12,2M12,4.5L19,8.25V15.75L12,19.5L5,15.75V8.25L12,4.5Z" /></svg>
                                ${this.getPriorityLabel(task.priority)}
                            </span>
                            <span class="task-meta-item ${dueDateClass}">
                                <svg viewBox="0 0 24 24"><path d="M19,4H18V2H16V4H8V2H6V4H5C3.89,4 3,4.89 3,6V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V6A2,2 0 0,0 19,4M19,20H5V10H19V20M19,8H5V6H19V8Z" /></svg>
                                ${this.formatDueDate(task.dueDate)}
                            </span>
                            <span class="task-meta-item">
                                <svg viewBox="0 0 24 24"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.7L16.2,16.2Z" /></svg>
                                ${this.formatRelativeTime(task.createdAt)}
                            </span>
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="edit-btn" data-id="${task.id}" title="编辑任务">
                            <svg viewBox="0 0 24 24"><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>
                        </button>
                        <button class="delete-btn" data-id="${task.id}" title="删除任务">
                            <svg viewBox="0 0 24 24"><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // 绑定新渲染元素的事件
        this.bindTaskItemEvents();
    }

    bindTaskItemEvents() {
        // 绑定复选框事件
        this.tasksList.querySelectorAll('.task-checkbox input').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const taskId = e.target.closest('.task-item').querySelector('.edit-btn').dataset.id;
                this.toggleTaskStatus(taskId);
            });
        });

        // 绑定编辑按钮事件
        this.tasksList.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.editTask(e.target.closest('button').dataset.id);
            });
        });

        // 绑定删除按钮事件
        this.tasksList.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteTask(e.target.closest('button').dataset.id);
            });
        });
    }

    getPriorityLabel(priority) {
        const labels = {
            'high': '高优先级',
            'medium': '中优先级',
            'low': '低优先级'
        };
        return labels[priority] || priority;
    }

    formatRelativeTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);

        if (diffSec < 60) {
            return '刚刚';
        } else if (diffMin < 60) {
            return `${diffMin}分钟前`;
        } else if (diffHour < 24) {
            return `${diffHour}小时前`;
        } else if (diffDay < 7) {
            return `${diffDay}天前`;
        } else {
            return '一周前';
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    updateStats() {
        this.totalTasksSpan.textContent = `共 ${this.tasks.length} 项`;
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new TaskManager();
});