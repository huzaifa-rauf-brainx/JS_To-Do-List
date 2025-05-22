document.addEventListener("DOMContentLoaded", () => {
    const todoList = document.getElementById("todoList");
    async function fetchTodos() {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");
        if (!response.ok) throw new Error("Failed to fetch tasks");
        const todos = await response.json();
        todoList.innerHTML = "";
        todos.forEach(todo => {
            const li = document.createElement("li");
            li.className = "list-group-item";
            li.textContent = `${todo.title} - ${todo.body}`;
            todoList.appendChild(li);
        });
    }
    fetchTodos();
});
