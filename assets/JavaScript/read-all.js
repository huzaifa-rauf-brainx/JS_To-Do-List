document.addEventListener("DOMContentLoaded", () => {
    const todoList = document.getElementById("todoList");
    const loader = document.getElementById("loader");
    const pagination = document.getElementById("pagination");
    const statusFilter = document.getElementById("statusFilter");
    const TASKS_PER_PAGE = 6;
    let allTasks = [];
    let currentPage = 1;
    async function fetchTodos() {
        try {
            loader.classList.remove("d-none");
            const cachedApiTodos = JSON.parse(localStorage.getItem("apiTodos"));
            let apiTodos = [];
            if (cachedApiTodos && Array.isArray(cachedApiTodos)) {
                apiTodos = cachedApiTodos;
            } else {
                const response = await fetch("https://jsonplaceholder.typicode.com/users/1/todos");
                if (!response.ok) throw new Error("Failed to fetch tasks");
                apiTodos = await response.json();
                localStorage.setItem("apiTodos", JSON.stringify(apiTodos));
            }
            const localTodos = JSON.parse(localStorage.getItem("todos")) || [];
            const seen = new Set();
            allTasks = [...localTodos, ...apiTodos].filter(task => {
                if (seen.has(task.id)) return false;
                seen.add(task.id);
                return true;
            });
            renderTasks();
        } catch (error) {
            showError("Unable to load tasks. Please try again later.");
            console.error(error);
        } finally {
            loader.classList.add("d-none");
        }
    }
    function renderTasks() {
        todoList.innerHTML = "";
        const filtered = applyFilter(allTasks);
        const paginated = paginate(filtered, currentPage, TASKS_PER_PAGE);
        paginated.forEach(renderTodo);
        renderPagination(filtered.length);
    }
    function renderTodo(todo) {
        const col = document.createElement("div");
        col.className = "col-md-6";
        const card = document.createElement("div");
        card.className = "card";
        const cardBody = document.createElement("div");
        cardBody.className = "card-body";
        const title = document.createElement("h5");
        title.className = "card-title";
        title.textContent = todo.title;
        const id = document.createElement("p");
        id.className = "card-text mb-1";
        id.textContent = `Task ID: ${todo.id}`;
        const userId = document.createElement("p");
        userId.className = "card-text mb-2";
        userId.textContent = `User ID: ${todo.userId}`;
        const status = document.createElement("span");
        status.className = `badge ${todo.completed ? "bg-success" : "bg-secondary"}`;
        status.textContent = todo.completed ? "Completed" : "Pending";
        cardBody.appendChild(title);
        cardBody.appendChild(id);
        cardBody.appendChild(userId);
        cardBody.appendChild(status);
        card.appendChild(cardBody);
        col.appendChild(card);
        todoList.appendChild(col);
    }
    function renderPagination(totalItems) {
        pagination.innerHTML = "";
        const totalPages = Math.ceil(totalItems / TASKS_PER_PAGE);
        if (totalPages <= 1) return;

        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement("li");
            li.className = `page-item ${i === currentPage ? "active" : ""}`;
            const btn = document.createElement("button");
            btn.className = "page-link";
            btn.textContent = i;
            btn.addEventListener("click", () => {
                currentPage = i;
                renderTasks();
            });
            li.appendChild(btn);
            pagination.appendChild(li);
        }
    }
    function applyFilter(tasks) {
        const status = statusFilter.value;
        if (status === "completed") {
            return tasks.filter(t => t.completed);
        } else if (status === "pending") {
            return tasks.filter(t => !t.completed);
        }
        return tasks;
    }
    function paginate(items, page, perPage) {
        const start = (page - 1) * perPage;
        return items.slice(start, start + perPage);
    }
    function showError(message) {
        todoList.innerHTML = `<div class="alert alert-danger text-center">${message}</div>`;
    }
    statusFilter.addEventListener("change", () => {
        currentPage = 1;
        renderTasks();
    });
    fetchTodos();
});