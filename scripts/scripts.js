document.getElementById('formCadastro').addEventListener('submit', function (event) {
    event.preventDefault();
    console.log("Entrou no cadastro de cliente");

    const name = document.getElementById('clientName').value;
    const cpf = document.getElementById('clientCPF').value;
    const tel = document.getElementById('clientTel').value;
    const dataNascimento = document.getElementById('clientBirthDate').value;
    const salario = document.getElementById('clientSalario').value;

    console.log(name);
    console.log(cpf);
    console.log(tel);
    console.log(dataNascimento);
    console.log(salario);

});