/**
 * Features:
 *  - Task model: Array of objects [{ id, title, course, dueDate, priority, notes, completed, createdAt }]
 *  - Add, toggle completion, and delete tasks
 *  - Filter by status (All, Active, Completed) and search by keyword
 *  - Calculate & display live statistics (Total, Pending, Completed, Completion Rate)
 *  - LocalStorage synchronization with realistic preloaded coursework tasks
 *  - Semantic DOM manipulation and event delegation
 */

(function () {
  'use strict';

  // Key for browser localStorage
  const STORAGE_KEY = 'cos106_academic_planner_tasks';

  // Initial Sample Coursework Tasks (used if local storage is empty)
  const DEFAULT_TASKS = [
    {
      id: 'task-1',
      title: 'Submit COS 106 Practical Term Project & GitHub Link',
      course: 'COS 106',
      dueDate: getRelativeDate(2),
      priority: 'high',
      notes: 'Finalize HTML semantic elements, external CSS, and JS form validation.',
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'task-2',
      title: 'Read Chapters 4 & 5: Relational Algebra and SQL Queries',
      course: 'COS 102',
      dueDate: getRelativeDate(5),
      priority: 'medium',
      notes: 'Focus on INNER JOIN and GROUP BY exercises.',
      completed: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'task-3',
      title: 'Complete MAT 102 Problem Set 3 on Matrix Inverses',
      course: 'MAT 102',
      dueDate: getRelativeDate(7),
      priority: 'high',
      notes: 'Verify eigenvalues calculation with study group.',
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'task-4',
      title: 'PHY 102 Lab Report on Wave Optics & Double Slit Experiment',
      course: 'PHY 102',
      dueDate: getRelativeDate(10),
      priority: 'low',
      notes: 'Format tables and error propagation analysis.',
      completed: false,
      createdAt: new Date().toISOString()
    }
  ];

  // Application State
  let tasks = [];
  let currentFilter = 'all'; // 'all' | 'active' | 'completed'
  let searchQuery = '';

  // DOM Elements
  const taskForm = document.getElementById('taskForm');
  const taskTitleInput = document.getElementById('taskTitle');
  const taskCourseInput = document.getElementById('taskCourse');
  const taskDueDateInput = document.getElementById('taskDueDate');
  const taskPriorityInput = document.getElementById('taskPriority');
  const taskNotesInput = document.getElementById('taskNotes');
  const taskListElement = document.getElementById('taskList');
  const emptyStateElement = document.getElementById('emptyState');
  const searchInput = document.getElementById('taskSearch');
  const filterButtons = document.querySelectorAll('.filter-tab');

  // Stats Elements
  const statTotal = document.getElementById('statTotal');
  const statPending = document.getElementById('statPending');
  const statCompleted = document.getElementById('statCompleted');
  const statRate = document.getElementById('statRate');

  /**
   * Helper: Generate a date string (YYYY-MM-DD) relative to today
   */
  function getRelativeDate(daysFromNow) {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    return d.toISOString().split('T')[0];
  }

  /**
   * Load tasks from LocalStorage or initialize with defaults
   */
  function loadTasks() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        tasks = JSON.parse(stored);
      } else {
        tasks = [...DEFAULT_TASKS];
        saveTasks();
      }
    } catch (err) {
      console.warn('LocalStorage access failed, using in-memory defaults:', err);
      tasks = [...DEFAULT_TASKS];
    }
  }

  /**
   * Save tasks array to LocalStorage
   */
  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.error('Failed to save tasks to LocalStorage:', err);
    }
  }

  /**
   * Render tasks to the DOM based on filter & search state
   */
  function renderTasks() {
    // 1. Filter tasks
    const filteredTasks = tasks.filter((task) => {
      // Status filter
      if (currentFilter === 'active' && task.completed) return false;
      if (currentFilter === 'completed' && !task.completed) return false;

      // Search keyword filter (title or course)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesCourse = task.course.toLowerCase().includes(query);
        return matchesTitle || matchesCourse;
      }

      return true;
    });

    // 2. Toggle empty state
    if (filteredTasks.length === 0) {
      taskListElement.innerHTML = '';
      emptyStateElement.style.display = 'block';
    } else {
      emptyStateElement.style.display = 'none';

      // 3. Build HTML list items
      taskListElement.innerHTML = filteredTasks
        .map((task) => {
          const isDone = task.completed;
          const priorityClass = `task-priority-${task.priority}`;
          const priorityLabel = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);

          return `
            <li class="task-item ${isDone ? 'completed' : ''}" data-id="${task.id}">
              <div class="task-left">
                <input 
                  type="checkbox" 
                  class="task-checkbox-custom" 
                  ${isDone ? 'checked' : ''} 
                  aria-label="Mark task '${escapeHtml(task.title)}' as completed"
                  data-action="toggle"
                />
                <div class="task-info">
                  <span class="task-title">${escapeHtml(task.title)}</span>
                  <div class="task-meta">
                    <span class="badge badge-primary">${escapeHtml(task.course)}</span>
                    <span class="badge ${priorityClass}">${priorityLabel} Priority</span>
                    <span class="task-date">📅 Due: ${formatDate(task.dueDate)}</span>
                    ${task.notes ? `<span class="task-notes-tag" title="${escapeHtml(task.notes)}">📝 Notes</span>` : ''}
                  </div>
                </div>
              </div>
              <div class="task-actions">
                <button 
                  type="button" 
                  class="btn-task-delete" 
                  data-action="delete" 
                  title="Delete task" 
                  aria-label="Delete task '${escapeHtml(task.title)}'"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            </li>
          `;
        })
        .join('');
    }

    // 4. Update the live statistics dashboard
    updateStatistics();
  }

  /**
   * Update the live statistics counters
   */
  function updateStatistics() {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    if (statTotal) statTotal.textContent = total;
    if (statPending) statPending.textContent = pending;
    if (statCompleted) statCompleted.textContent = completed;
    if (statRate) statRate.textContent = `${rate}%`;
  }

  /**
   * Add a new task to the array
   */
  function addTask(e) {
    e.preventDefault();

    const title = taskTitleInput.value.trim();
    const course = taskCourseInput.value.trim();
    const dueDate = taskDueDateInput.value;
    const priority = taskPriorityInput.value;
    const notes = taskNotesInput ? taskNotesInput.value.trim() : '';

    // Validation
    let hasError = false;

    if (!title) {
      setFieldError(taskTitleInput, 'Task title is required');
      hasError = true;
    } else {
      clearFieldError(taskTitleInput);
    }

    if (!course) {
      setFieldError(taskCourseInput, 'Course code is required');
      hasError = true;
    } else {
      clearFieldError(taskCourseInput);
    }

    if (!dueDate) {
      setFieldError(taskDueDateInput, 'Due date is required');
      hasError = true;
    } else {
      clearFieldError(taskDueDateInput);
    }

    if (hasError) return;

    // Create new task item object
    const newTask = {
      id: 'task-' + Date.now(),
      title: title,
      course: course,
      dueDate: dueDate,
      priority: priority,
      notes: notes,
      completed: false,
      createdAt: new Date().toISOString()
    };

    // Prepend to array
    tasks.unshift(newTask);
    saveTasks();
    renderTasks();

    // Reset Form
    taskForm.reset();
    setDefaultDueDate();
    taskTitleInput.focus();

    // Brief visual feedback
    showNotification(`Task "${title}" added successfully!`);
  }

  /**
   * Toggle task completion state
   */
  function toggleTaskCompletion(taskId) {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    }
  }

  /**
   * Delete task by id
   */
  function deleteTask(taskId) {
    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex !== -1) {
      const removedTask = tasks[taskIndex];
      tasks.splice(taskIndex, 1);
      saveTasks();
      renderTasks();
      showNotification(`Deleted: "${removedTask.title}"`);
    }
  }

  /**
   * Event Delegation for Task Actions (Checkbox toggle and Delete button)
   */
  function handleTaskListClick(e) {
    const taskItem = e.target.closest('.task-item');
    if (!taskItem) return;

    const taskId = taskItem.dataset.id;
    const action = e.target.dataset.action || e.target.closest('[data-action]')?.dataset.action;

    if (action === 'toggle') {
      toggleTaskCompletion(taskId);
    } else if (action === 'delete') {
      if (confirm('Are you sure you want to delete this task?')) {
        deleteTask(taskId);
      }
    }
  }

  /**
   * Filter Tabs Handling
   */
  function handleFilterClick(e) {
    const button = e.target.closest('.filter-tab');
    if (!button) return;

    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    currentFilter = button.dataset.filter || 'all';
    renderTasks();
  }

  /**
   * Live Search Input
   */
  function handleSearchInput(e) {
    searchQuery = e.target.value;
    renderTasks();
  }

  /**
   * Field Error Helpers
   */
  function setFieldError(input, message) {
    const group = input.closest('.form-group');
    if (group) {
      group.classList.add('has-error');
      let msgElem = group.querySelector('.error-msg');
      if (msgElem) msgElem.textContent = message;
    }
  }

  function clearFieldError(input) {
    const group = input.closest('.form-group');
    if (group) {
      group.classList.remove('has-error');
    }
  }

  /**
   * Quick Toast Notification
   */
  function showNotification(msg) {
    let toast = document.getElementById('plannerToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'plannerToast';
      toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background-color: #0f172a;
        color: #ffffff;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 0.9rem;
        box-shadow: 0 10px 25px rgba(0,0,0,0.25);
        z-index: 9999;
        transition: opacity 0.3s ease, transform 0.3s ease;
        opacity: 0;
        transform: translateY(10px);
      `;
      document.body.appendChild(toast);
    }

    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
    }, 2800);
  }

  /**
   * Format ISO date string into readable text (e.g. Nov 15, 2026)
   */
  function formatDate(dateStr) {
    if (!dateStr) return 'No due date';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const date = new Date(parts[0], parts[1] - 1, parts[2]);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return dateStr;
  }

  /**
   * XSS Protection: HTML entity escaping
   */
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Pre-fill the due date input to 3 days from today
   */
  function setDefaultDueDate() {
    if (taskDueDateInput && !taskDueDateInput.value) {
      taskDueDateInput.value = getRelativeDate(3);
    }
  }

  /**
   * Initialize event listeners and render
   */
  function init() {
    loadTasks();
    setDefaultDueDate();

    if (taskForm) {
      taskForm.addEventListener('submit', addTask);
    }

    if (taskListElement) {
      taskListElement.addEventListener('click', handleTaskListClick);
    }

    filterButtons.forEach((btn) => {
      btn.addEventListener('click', handleFilterClick);
    });

    if (searchInput) {
      searchInput.addEventListener('input', handleSearchInput);
    }

    // Clear validation errors on typing
    [taskTitleInput, taskCourseInput, taskDueDateInput].forEach((input) => {
      if (input) {
        input.addEventListener('input', () => clearFieldError(input));
      }
    });

    renderTasks();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
