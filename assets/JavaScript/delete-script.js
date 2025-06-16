document.addEventListener("DOMContentLoaded", () => {
    const deleteForm = document.getElementById("deleteForm");
    const taskInput = document.getElementById("taskID");
    const toast = document.getElementById("toast");
    const confirmModal = new bootstrap.Modal(document.getElementById("confirmModal"));
    const confirmMessage = document.getElementById("confirmMessage");
    const confirmDeleteBtn = document.getElementById("confirmDelete");
    const TOAST_DISPLAY_DURATION = 3000;
    let pendingTaskId = null;
    deleteForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const id = taskInput.value.trim();
        if (!id || isNaN(id) || Number(id) <= 0) {
            showToast("Please enter a valid Task ID", "danger");
            return;
        }
        pendingTaskId = Number(id);
        confirmMessage.textContent = `Are you sure you want to delete task with ID ${id}?`;
        confirmModal.show();
    });
    confirmDeleteBtn.addEventListener("click", async () => {
        if (!pendingTaskId) return;
        confirmModal.hide();
        showToast("Deleting...", "warning");
        const id = pendingTaskId;
        let localTodos = JSON.parse(localStorage.getItem("todos")) || [];
        const index = localTodos.findIndex(todo => todo.id === id);
        if (index !== -1) {
            localTodos.splice(index, 1);
            localStorage.setItem("todos", JSON.stringify(localTodos));
            showToast(`Task with ID ${id} deleted from local storage`, "success");
        } else {
            try {
                const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
                    method: "DELETE",
                });
                if (response.ok) {
                    showToast(`Task with ID ${id} deleted from API`, "success");
                } else {
                    showToast(`Failed to delete task with ID ${id}`, "danger");
                }
            } catch (error) {
                showToast("Network error occurred", "danger");
                console.error(error);
            }
        }
        pendingTaskId = null;
        taskInput.value = "";
    });
    function showToast(message, type = "info") {
        toast.textContent = message;
        toast.className = `alert alert-${type} mt-2`;
        toast.classList.remove("d-none");

        setTimeout(() => {
            toast.classList.add("d-none");
        }, TOAST_DISPLAY_DURATION);
    }
});