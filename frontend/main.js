const API_URL = "http://localhost:3000/api";

if (document.getElementById("register-form")) {
    document.getElementById("register-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre: name, email, password }),
        });

        const data = await response.json();
        alert(data.message);
        if (response.ok) {
            window.location.href = "login.html";
        }
    });
}

if (document.getElementById("login-form")) {
    document.getElementById("login-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem("token", data.token);
            window.location.href = "index.html";
        } else {
            alert(data.message);
        }
    });
}

if (document.getElementById("task-list")) {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
    }

    const fetchTasks = async () => {
        const response = await fetch(`${API_URL}/tasks`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const tasks = await response.json();
        const taskList = document.getElementById("tasks");
        taskList.innerHTML = "";

        tasks.forEach((task) => {
            const li = document.createElement("li");
            li.innerHTML = `
            <span class="${task.completada ? "completed" : ""}">${task.titulo}</span>
            <button data-id="${task.id}" class="edit">Editar</button>
            <button data-id="${task.id}" class="delete">Eliminar</button>
        `;
            taskList.appendChild(li);
        });
    };


    fetchTasks();

    document.getElementById("add-task").addEventListener("click", async () => {
        const title = document.getElementById("task-title").value;
        const desc = document.getElementById("task-desc").value;

        await fetch(`${API_URL}/tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ titulo: title, descripcion: desc }),
        });

        fetchTasks();
    });

    document.getElementById("logout").addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "login.html";
    });

    document.getElementById("tasks").addEventListener("click", async (e) => {
        if (e.target.classList.contains("delete")) {
            const id = e.target.dataset.id;

            await fetch(`${API_URL}/tasks/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            fetchTasks();
        }
    });

    document.getElementById("tasks").addEventListener("click", async (e) => {
        if (e.target.classList.contains("edit")) {
            const id = e.target.dataset.id;

            const response = await fetch(`${API_URL}/tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const task = await response.json();

            document.getElementById("task-title").value = task.titulo;
            document.getElementById("task-desc").value = task.descripcion;
            document.getElementById("task-id").value = task.id; 
            document.getElementById("update-task").style.display = "block"; 
            document.getElementById("add-task").style.display = "none";
        }
    });

    document.getElementById("update-task").addEventListener("click", async () => {
        const id = document.getElementById("task-id").value;
        const title = document.getElementById("task-title").value;
        const desc = document.getElementById("task-desc").value;

        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ titulo: title, descripcion: desc, completada: false }),
        });

        const data = await response.json();
        alert(data.message);

        fetchTasks();
        document.getElementById("task-title").value = "";
        document.getElementById("task-desc").value = "";
        document.getElementById("task-id").value = "";
        document.getElementById("update-task").style.display = "none";
        document.getElementById("add-task").style.display = "block";
    });
}
