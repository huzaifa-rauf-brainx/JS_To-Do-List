document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("addBtn");
    const toast = document.getElementById("toast");
    addBtn.addEventListener("click", async () => {
        const title = document.getElementById("name").value.trim();
        const description = document.getElementById("description").value.trim();
        const todo = {
            title: title,
            body: description,
            userId: 1
        };
        const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(todo)
        });
        const data = await response.json();
        showToast("Task added successfully!");
        console.log("Added todo:", data);

    });
    function showToast(message) {
        toast.textContent = message;
        toast.classList.remove("d-none");
        setTimeout(() => {
            toast.classList.add("d-none");
        }, 3000);
    }
});