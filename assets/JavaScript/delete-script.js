document.addEventListener("DOMContentLoaded", () => {
    const deleteBtn = document.getElementById("deleteBtn");
    deleteBtn.addEventListener("click", async () => {
        const id = document.getElementById("taskID").value.trim();
        if (id == "") {
            showToast("Please enter a task ID");
            return;
        }
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
            method: "DELETE",
        });
        if (response.ok) {
            showToast(`Task with ID ${id} deleted successfully!`);
        }
        else {
            showToast(`Failed to delete task with ID ${id}`);
        }
    });
    function showToast(message) {
        toast.textContent = message;
        toast.classList.remove("d-none");
        setTimeout(() => {
            toast.classList.add("d-none");
        }, 3000);
    }
});