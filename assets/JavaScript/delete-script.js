document.addEventListener("DOMContentLoaded", () => {
    const deleteBtn = document.getElementById("deleteBtn");
    const toast = document.getElementById("toast");
    deleteBtn.addEventListener("click", async () => {
        const id = document.getElementById("taskID").value.trim();
        if (id === "") {
            showToast("Please enter a task ID", "danger");
            return;
        }
        const confirmed = confirm(`Are you sure you want to delete task with ID ${id}?`);
        if (!confirmed) {
            return;
        }
        let localTodos = JSON.parse(localStorage.getItem("todos")) || [];
        const index = localTodos.findIndex(todo => String(todo.id) === id);
        if (index !== -1) {
            localTodos.splice(index, 1);
            localStorage.setItem("todos", JSON.stringify(localTodos));
            showToast(`Task with ID ${id} deleted from local storage!`, "success");
        } else {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                showToast(`Task with ID ${id} deleted successfully!`, "success");
            } else {
                showToast(`Failed to delete task with ID ${id}`, "danger");
            }
        }
    });
    function showToast(message, type = "info") {
        toast.textContent = message;
        toast.classList.remove("d-none");
        toast.className = `alert alert-${type} mt-2`;
        setTimeout(() => {
            toast.classList.add("d-none");
        }, 3000);
    }
});