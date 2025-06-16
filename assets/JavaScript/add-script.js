document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "https://jsonplaceholder.typicode.com/todos";
    const USER_ID = 1;
    const TOAST_DISPLAY_DURATION = 3000;
    const form = document.getElementById("addTaskForm");
    const toast = document.getElementById("toast");
    const nameInput = document.getElementById("name");
    const statusInput = document.getElementById("status");
    const submitBtn = form.querySelector("button[type='submit']");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        form.classList.remove("was-validated");
        const title = nameInput.value.trim();
        const status = statusInput.value;
        if (!title || title.length < 3) {
            showToast("Task name must be at least 3 characters long.", "danger");
            nameInput.focus();
            return;
        }
        if (!status) {
            showToast("Please select a task status.", "danger");
            statusInput.focus();
            return;
        }
        const todo = {
            title: title,
            completed: status === "Completed",
            userId: USER_ID,
        };
        try {
            submitBtn.disabled = true;
            submitBtn.textContent = "Adding...";
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(todo),
            });
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            const data = await response.json();
            const existingTodos = JSON.parse(localStorage.getItem("todos")) || [];
            data.id = existingTodos.length > 0 ? existingTodos[existingTodos.length - 1].id + 1 : 1;
            existingTodos.push(data);
            localStorage.setItem("todos", JSON.stringify(existingTodos));
            showToast("Task added successfully!", "success");
            console.log("Added todo:", data);
            form.reset();
        } catch (error) {
            console.error("Add task error:", error);
            showToast("Failed to add task. Please try again later.", "danger");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Add Task";
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