document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    
    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        // Pega os valores dos campos
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const login = document.getElementById("login").value;
        const password = document.getElementById("password").value;

        // Verifica se os campos estão preenchidos
        const userData = {
            nome: name,
            email: email,
            login: login,
            senha: password
        };

        try {
            const response = await fetch("http://localhost:8080/usuarios/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });

            // Log que foi sucesso
            if (response.ok) {
                alert("Registro realizado com sucesso!");
                // Redireciona para a página do admin
                window.location.href = "admin.html";
            } else {
                const errorMessage = await response.text();
                alert("Erro ao registrar: " + errorMessage);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("API Offline, verifique a conexão.");
        }
    });
});