document.addEventListener("DOMContentLoaded", () => {
    const todoList = document.getElementById("todoList");
    async function fetchTodos() {
        const response = await fetch("https://jsonplaceholder.typicode.com/users/1/todos");
        if (!response.ok) throw new Error("Failed to fetch tasks");
        const todos = await response.json();
        todos.forEach(renderTodo);
        const localTodos = JSON.parse(localStorage.getItem("todos")) || [];
        if (localTodos.length > 0) {
            localTodos.forEach(renderTodo);
        }
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
    fetchTodos();
});