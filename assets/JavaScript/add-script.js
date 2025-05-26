document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("addBtn");
    const toast = document.getElementById("toast");
    addBtn.addEventListener("click", async () => {
        const title = document.getElementById("name").value.trim();
        const status = document.getElementById("status").value;
        if (!title || !status) {
            showToast("Please fill in all fields.", "danger");
            return;
        }
        const todo = {
            title: title,
            completed: status === "Completed",
            userId: 1
        };
        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/todos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(todo)
            });
            const data = await response.json();
            const existingTodos = JSON.parse(localStorage.getItem("todos")) || [];
            if(existingTodos.length > 0) {
                data.id = (existingTodos[existingTodos.length -1].id) + 1;
            }
            existingTodos.push(data);
            localStorage.setItem("todos", JSON.stringify(existingTodos));
            showToast("Task added successfully!", "success");
            console.log("Added todo:", data);
        } catch (error) {
            showToast("Failed to add task", "danger");
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