document.addEventListener("DOMContentLoaded", () => {
    const readBtn = document.getElementById("readBtn");
    const toast = document.getElementById("toast");
    const taskCard = document.getElementById("taskCard");
    const taskUserId = document.getElementById("taskUserId");
    const taskTitle = document.getElementById("taskTitle");
    const taskCompleted = document.getElementById("taskCompleted");
    readBtn.addEventListener("click", async () => {
        const taskIdInput = document.getElementById("taskId").value.trim();
        if (!taskIdInput) {
            showToast("Please enter a Task ID", "danger");
            taskCard.classList.add("d-none");
            return;
        }
        const taskId = parseInt(taskIdInput);
        const localTodos = JSON.parse(localStorage.getItem("todos")) || [];
        const localTask = localTodos.find(t => t.id === taskId);
        if (localTask) {
            renderTask(localTask);
            showToast("Task loaded from local storage!", "info");
            return;
        }
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${taskId}`);
            if (!response.ok) {
                throw new Error();
            }
            const data = await response.json();
            renderTask(data);
            showToast("Task loaded from API!", "success");
        } catch {
            showToast("Task not found!", "danger");
            taskCard.classList.add("d-none");
        }
    });
    function renderTask(task) {
        taskUserId.textContent = task.userId;
        taskTitle.textContent = task.title;
        taskCompleted.textContent = task.completed ? "Completed" : "Pending";
        taskCard.classList.remove("d-none");
    }
    function showToast(message, type = "info") {
        toast.textContent = message;
        toast.className = `alert alert-${type} mt-2`;
        toast.classList.remove("d-none");
        setTimeout(() => {
            toast.classList.add("d-none");
        }, 3000);
    }
});
