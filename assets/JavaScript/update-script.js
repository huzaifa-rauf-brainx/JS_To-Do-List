document.addEventListener("DOMContentLoaded", () => {
    const updateBtn = document.getElementById("updateBtn");
    const toast = document.getElementById("toast");
    updateBtn.addEventListener("click", async () => {
        const taskId = document.getElementById("taskId").value.trim();
        const title = document.getElementById("name").value.trim();
        const status = document.getElementById("status").value;
        if (!taskId || !title) {
            showToast("Please fill in all the fields.", "danger");
            return;
        }
        const updatedTask = {
            id: parseInt(taskId),
            title: title,
            userId: 1,
            completed: status === "Completed"
        };
        let localTodos = JSON.parse(localStorage.getItem("todos")) || [];
        const index = localTodos.findIndex(todo => todo.id === updatedTask.id);
        if (index !== -1) {
            localTodos[index].title = updatedTask.title;
            localTodos[index].completed = updatedTask.completed;
            localStorage.setItem("todos", JSON.stringify(localTodos));
            showToast("Task updated in local storage!", "success");
            return;
        }
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${taskId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedTask)
            });
            if (!response.ok) throw new Error("API update failed");
            const data = await response.json();
            showToast("Task updated unsing API!", "success");
            console.log("Updated task:", data);
        } catch (error) {
            showToast("Failed to update task.", "danger");
            console.error(error);
        }
    });
    function showToast(message, type = "info") {
        toast.textContent = message;
        toast.className = `alert alert-${type} mt-2`;
        toast.classList.remove("d-none");
        setTimeout(() => {
            toast.classList.add("d-none");
        }, 3000);
    }
});