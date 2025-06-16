document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "https://jsonplaceholder.typicode.com/todos";
    const TOAST_DISPLAY_DURATION = 3000;
    const readForm = document.getElementById("readTaskForm");
    const readBtn = document.getElementById("readBtn");
    const toast = document.getElementById("toast");
    const taskCard = document.getElementById("taskCard");
    const taskUserId = document.getElementById("taskUserId");
    const taskTitle = document.getElementById("taskTitle");
    const taskCompleted = document.getElementById("taskCompleted");
    readForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const taskIdInput = document.getElementById("taskId").value.trim();
        if (!taskIdInput) {
            showToast("Please enter a Task ID", "danger");
            taskCard.classList.add("d-none");
            return;
        }
        const taskId = parseInt(taskIdInput, 10);
        if (isNaN(taskId) || taskId < 1) {
            showToast("Invalid Task ID", "danger");
            taskCard.classList.add("d-none");
            return;
        }
        const localTodos = JSON.parse(localStorage.getItem("todos")) || [];
        const localTask = localTodos.find(t => t.id === taskId);
        if (localTask) {
            renderTask(localTask);
            showToast("Task loaded from local storage!", "info");
            return;
        }
        const cachedTask = JSON.parse(sessionStorage.getItem(`task-${taskId}`));
        if (cachedTask) {
            renderTask(cachedTask);
            showToast("Task loaded from cache!", "info");
            return;
        }
        readBtn.disabled = true;
        readBtn.textContent = "Loading...";
        try {
            const response = await fetch(`${API_URL}/${taskId}`);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("Task not found");
                } else {
                    throw new Error(`Error ${response.status}: Failed to fetch`);
                }
            }
            const data = await response.json();
            sessionStorage.setItem(`task-${taskId}`, JSON.stringify(data));
            renderTask(data);
            showToast("Task loaded from API!", "success");
        } catch (error) {
            console.error("Fetch error:", error);
            showToast(error.message || "Task not found!", "danger");
            taskCard.classList.add("d-none");
        } finally {
            readBtn.disabled = false;
            readBtn.textContent = "Read Task";
        }
    });
    function renderTask(task) {
        taskUserId.textContent = task.userId;
        taskTitle.textContent = task.title;
        taskCompleted.textContent = task.completed ? "Completed" : "Pending";
        taskCard.classList.remove("d-none");
        taskCard.setAttribute("aria-hidden", "false");
    }
    function showToast(message, type = "info") {
        toast.textContent = message;
        toast.className = `alert alert-${type} mt-2`;
        toast.classList.remove("d-none");
        setTimeout(() => {
            toast.classList.add("d-none");
        }, TOAST_DISPLAY_DURATION);
    }
});