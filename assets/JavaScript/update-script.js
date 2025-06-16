document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "https://jsonplaceholder.typicode.com/todos";
    const USER_ID = 1;
    const TOAST_DISPLAY_DURATION = 3000;
    const form = document.getElementById("updateTaskForm");
    const toast = document.getElementById("toast");
    const updateBtn = document.getElementById("updateBtn");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const taskId = parseInt(document.getElementById("taskId").value.trim());
        const title = document.getElementById("name").value.trim();
        const status = document.getElementById("status").value;
        if (!taskId || taskId < 1 || !title || title.length < 3 || !status) {
            showToast("Please fill all fields with valid data.", "danger");
            return;
        }
        const updatedTask = {
            id: taskId,
            title: title,
            userId: USER_ID,
            completed: status === "Completed"
        };
        const localTodos = JSON.parse(localStorage.getItem("todos")) || [];
        const index = localTodos.findIndex(todo => todo.id === updatedTask.id);
        updateBtn.disabled = true;
        updateBtn.textContent = "Updating...";
        try {
            if (index !== -1) {
                localTodos[index] = updatedTask;
                localStorage.setItem("todos", JSON.stringify(localTodos));
                showToast("Task updated in local storage!", "success");
            } else {
                const response = await fetch(`${API_URL}/${taskId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(updatedTask)
                });
                if (!response.ok) {
                    throw new Error(`API responded with status ${response.status}`);
                }
                const data = await response.json();
                console.log("Updated task via API:", data);
                showToast("Task updated using API!", "success");
            }
            form.reset();
        } catch (error) {
            console.error("Update failed:", error);
            showToast("Failed to update task. Please try again.", "danger");
        } finally {
            updateBtn.disabled = false;
            updateBtn.textContent = "Update Task";
        }
    });
    function showToast(message, type = "info") {
        toast.textContent = message;
        toast.className = `alert alert-${type} mt-3`;
        toast.classList.remove("d-none");
        setTimeout(() => {
            toast.classList.add("d-none");
        }, TOAST_DISPLAY_DURATION);
    }
});