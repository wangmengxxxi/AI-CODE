class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.currentFilter = 'all';
        this.currentSearch = '';
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderTasks();
        this.updateTaskCount();
    }

    bindEvents() {
        // 表单事件
        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTask();
        });

        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.resetForm();
        });

        // 搜索和过滤事件
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.currentSearch = e.target.value.toLowerCase();
            this.renderTasks();
        });

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.status;
                this.renderTasks();
            });
        });

        // 点击空白处重置表单
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.task-form-section') && !e.target.closest('.task-item')) {
                this.resetForm();
            }
        });
    }

    saveTask() {
        const taskId = document.getElementById('taskId').value;
        const title = document.getElementById('taskTitle').value.trim();
        const description = document.getElementById('taskDescription').value.trim();
        const priority = document.getElementById('taskPriority').value;
        const dueDate = document.getElementById('taskDueDate').value;

        if (!title) {
            alert('任务标题不能为空！');
            return;
        }

        if (taskId) {
            // 编辑现有任务
            const taskIndex = this.tasks.findIndex(t => t.id === taskId);
            if (taskIndex !== -1) {
                this.tasks[taskIndex] = {
                    ...this.tasks[taskIndex],
                    title,
                    description,
                    priority,
                    dueDate,
                    updatedAt: new Date().toISOString()
                };
            }
        } else {
            // 添加新任务
            const newTask = {
                id: Date.now().toString(),
                title,
                description,
                priority,
                status: 'pending',
                dueDate,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            this.tasks.unshift(newTask);
        }

        this.saveToStorage();
        this.renderTasks();
        this.resetForm();
        this.updateTaskCount();

        // 显示成功提示
        this.showNotification(taskId ? '任务已更新' : '任务已添加');
    }

    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        document.getElementById('form-title').textContent = '编辑任务';
        document.getElementById('taskId').value = task.id;
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDescription').value = task.description;
        document.getElementById('taskPriority').value = task.priority;
        document.getElementById('taskDueDate').value = task.dueDate;

        // 滚动到表单位置
        document.querySelector('.task-form-section').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    deleteTask(taskId) {
        if (confirm('确定要删除这个任务吗？')) {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.saveToStorage();
            this.renderTasks();
            this.updateTaskCount();
            this.showNotification('任务已删除');
        }
    }

    updateTaskStatus(taskId, newStatus) {
        const taskIndex = this.tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
            this.tasks[taskIndex] = {
                ...this.tasks[taskIndex],
                status: newStatus,
                updatedAt: new Date().toISOString()
            };

            this.saveToStorage();
            this.renderTasks();
            this.showNotification('任务状态已更新');
        }
    }

    filterTasks() {
        return this.tasks.filter(task => {
            const matchesFilter = this.currentFilter === 'all' || task.status === this.currentFilter;
            const matchesSearch = !this.currentSearch || 
                task.title.toLowerCase().includes(this.currentSearch) ||
                (task.description && task.description.toLowerCase().includes(this.currentSearch));
            
            return matchesFilter && matchesSearch;
        });
    }

    renderTasks() {
        const filteredTasks = this.filterTasks();
        const tasksList = document.getElementById('tasksList');
        
        if (filteredTasks.length === 0) {
            tasksList.innerHTML = `
                <div class="empty-state">
                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzAiIGZpbGw9IiNmMGYxZjMiIHN0cm9rZT0iI2QyZDRkNCIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxwYXRoIGQ9Ik0yNiAyMmgxMnYxMkgyNlYyMnoiIGZpbGw9IiM5Mjk2OTciLz4KPHBhdGggZD0iTTE4IDMwdjE0aDI4VjMwSDE4eiIgZmlsbD0iIzk5OWI5YSIvPgo8L3N2Zz4=" alt="无任务" width="64" height="64">
                    <p>${this.currentSearch ? '未找到匹配的任务' : '暂无任务，添加一个新任务开始吧！'}</p>
                </div>
            `;
            return;
        }

        tasksList.innerHTML = filteredTasks.map(task => this.generateTaskHTML(task)).join('');
        
        // 绑定任务项的事件
        this.bindTaskEvents();
    }

    generateTaskHTML(task) {
        const now = new Date();
        const dueDate = task.dueDate ? new Date(task.dueDate) : null;
        const isOverdue = dueDate && dueDate < now && task.status !== 'completed';

        let statusText, statusClass, actionBtn;
        
        switch (task.status) {
            case 'pending':
                statusText = '待办';
                statusClass = 'pending';
                actionBtn = `<button class="task-btn complete" data-action="start" title="开始任务">▶</button>`;
                break;
            case 'in-progress':
                statusText = '进行中';
                statusClass = 'in-progress';
                actionBtn = `<button class="task-btn complete" data-action="complete" title="完成任务">✓</button>`;
                break;
            case 'completed':
                statusText = '已完成';
                statusClass = 'completed';
                actionBtn = `<button class="task-btn complete" data-action="pending" title="重新打开">↺</button>`;
                break;
        }

        const formattedDate = dueDate ? dueDate.toLocaleDateString('zh-CN') : '无截止日期';
        const overdueBadge = isOverdue ? '<span class="overdue-badge" title="已逾期">⚠</span>' : '';

        return `
            <div class="task-item ${task.status} ${task.priority}-priority" data-id="${task.id}">
                <div class="task-content">
                    <h3 class="task-title">${task.title}</h3>
                    ${task.description ? `<p class="task-description">${task.description}</p>` : ''}
                    <div class="task-meta">
                        <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> ${statusText}</span>
                        <span class="priority priority-${task.priority}">${this.getPriorityLabel(task.priority)}</span>
                        <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> ${formattedDate}</span>
                        ${overdueBadge}
                    </div>
                </div>
                <div class="task-actions">
                    ${actionBtn}
                    <button class="task-btn edit" data-action="edit" title="编辑任务">✎</button>
                    <button class="task-btn delete" data-action="delete" title="删除任务">🗑</button>
                </div>
            </div>
        `;
    }

    bindTaskEvents() {
        document.querySelectorAll('.task-item').forEach(item => {
            const taskId = item.dataset.id;
            
            item.querySelectorAll('.task-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = e.currentTarget.dataset.action;
                    
                    switch (action) {
                        case 'edit':
                            this.editTask(taskId);
                            break;
                        case 'delete':
                            this.deleteTask(taskId);
                            break;
                        case 'start':
                            this.updateTaskStatus(taskId, 'in-progress');
                            break;
                        case 'complete':
                            this.updateTaskStatus(taskId, 'completed');
                            break;
                        case 'pending':
                            this.updateTaskStatus(taskId, 'pending');
                            break;
                    }
                });
            });

            // 点击任务项也可以编辑
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.task-btn')) {
                    this.editTask(taskId);
                }
            });
        });
    }

    getPriorityLabel(priority) {
        const labels = {
            'low': '低',
            'medium': '中',
            'high': '高'
        };
        return labels[priority] || priority;
    }

    resetForm() {
        document.getElementById('taskForm').reset();
        document.getElementById('taskId').value = '';
        document.getElementById('form-title').textContent = '添加新任务';
    }

    saveToStorage() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    updateTaskCount() {
        document.getElementById('totalTasks').textContent = this.tasks.length;
    }

    showNotification(message) {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // 添加样式
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: '#48bb78',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: '1000',
            transform: 'translateX(120%)',
            transition: 'transform 0.3s ease'
        });

        document.body.appendChild(notification);

        // 触发动画
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // 自动移除
        setTimeout(() => {
            notification.style.transform = 'translateX(120%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new TaskManager();
});