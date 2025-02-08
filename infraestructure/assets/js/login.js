async function loginUsuario() {
    const login = document.getElementById("login").value;
    const senha = document.getElementById("senha").value;

    const loginData = {
        login: login,
        senha: senha
    };

    try {
        const response = await fetch("http://localhost:8080/usuarios/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        });

        // Checando a resposta
        if (response.ok) {
            const data = await response.json();
            alert(data.message); // Exibe a mensagem de sucesso
            window.location.href = "../pages/admin.html"; // Redireciona para a página admin
        } else {
            //Se não for OK, exibe a mensagem de erro
            const errorData = await response.json();
            alert(errorData.message || "Erro desconhecido");
        }
    } catch (error) {
        // Alguns erros, incluindo erros que voltam do backend
        console.error("Erro de comunicação com o servidor", error);
        alert("Ocorreu um erro ao tentar se conectar ao servidor. Tente novamente.");
    }
}
