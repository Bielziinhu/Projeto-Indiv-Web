document.addEventListener("DOMContentLoaded", async function () {
    const tabelaUsuarios = document.querySelector(".lista-usuarios tbody");

    // Função carrega usuarios (Pode ser chamada dentro das outras para ficar carregando a lista)
    async function carregarUsuarios() {
        try {
            const response = await fetch("http://localhost:8080/usuarios/findall");
            if (!response.ok) throw new Error("Erro ao buscar usuários");

            const data = await response.json();
            const usuarios = data.content;

            tabelaUsuarios.innerHTML = "";

            if (Array.isArray(usuarios)) {
                usuarios.forEach(usuario => {
                    const tr = document.createElement("tr");

                    // Preenchimento da tabela
                    tr.innerHTML = `
                        <td>${usuario.nome}</td>
                        <td>${usuario.login}</td>
                        <td>${usuario.email}</td>
                        <td class="td-img">
                            <button class="botao excluir" data-id="${usuario.id}">
                                <img src="../assets/images/lixeira.png" alt="Excluir">
                            </button>
                        </td>
                        <td class="td-img">
                            <button class="botao editar" data-id="${usuario.id}" data-nome="${usuario.nome}" data-login="${usuario.login}" data-email="${usuario.email}">
                                <img src="../assets/images/lapis.png" alt="Editar">
                            </button>
                        </td>
                    `;

                    tabelaUsuarios.appendChild(tr);
                });
            } else {
                console.error("A resposta não é um array de usuários", usuarios);
            }

            // Ao inserir um user, ele já adiciona o botão de excluir e edit em seu id
            document.querySelectorAll(".excluir").forEach(botao => {
                botao.addEventListener("click", excluirUsuario);
            });

            document.querySelectorAll(".editar").forEach(botao => {
                botao.addEventListener("click", editarUsuario);
            });

        } catch (error) {
            console.error("Erro ao carregar usuários:", error);
        }
    }

    // função de excluir user com algumas infos de log
    async function excluirUsuario(event) {
        const id = event.currentTarget.dataset.id;

        // Faz a exibição do login apenas para depuração e logs
        if (confirm(`Tem certeza que deseja excluir o usuário?`)) {
            try {
                const response = await fetch(`http://localhost:8080/usuarios/delete/${id}`, {
                    method: "DELETE"
                });

                // resposta ok
                if (!response.ok) throw new Error("Erro ao excluir usuário");

                const data = await response.json();

                alert(data.LOG || "Usuário excluído com sucesso!");
                // Recarrega a lista apos excluir um usuario
                carregarUsuarios();
            } catch (error) {
                console.error("Erro ao excluir usuário:", error);
            }
        }
    }

    // Editar usuario (coloca usuario no form)
    async function editarUsuario(event) {
        const id = event.currentTarget.dataset.id;
        const nome = event.currentTarget.dataset.nome;
        const login = event.currentTarget.dataset.login;
        const email = event.currentTarget.dataset.email;

        // Pega os dados atuais e preenche para facilitar a edição
        document.getElementById("usuario-id").value = id;
        document.getElementById("nome").value = nome;
        document.getElementById("login").value = login;
        document.getElementById("email").value = email;

        // Exibir o formulário de edição (atualmente oculto)
        document.getElementById("form-editar-usuario").style.display = "block";

        // Lidar com o envio do formulário
        const form = document.getElementById("form-edit-usuario");
        form.addEventListener("submit", async function (event) {
            event.preventDefault();

            const usuarioEditado = {
                nome: document.getElementById("nome").value,
                login: document.getElementById("login").value,
                email: document.getElementById("email").value
            };

            try {
                const response = await fetch(`http://localhost:8080/usuarios/update/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(usuarioEditado)
                });

                if (!response.ok) throw new Error("Erro ao editar usuário");

                const usuarioAtualizado = await response.json();
                alert("Usuário atualizado com sucesso!");
                // Recarrega a lista após edição
                carregarUsuarios();
                // Ocultar o formulário de edição
                document.getElementById("form-editar-usuario").style.display = "none";
            } catch (error) {
                console.error("Erro ao editar usuário:", error);
            }
        });

        // Ao clicar em cancelar ele oculta o form
        document.getElementById("cancelar-edicao").addEventListener("click", function () {
            document.getElementById("form-editar-usuario").style.display = "none";
        });
    }

    carregarUsuarios();
});