

function validarCPF(cpf) {
    cpf = cpf.replace(/[.-]/g, ""); // Remove pontos e traços
    if (cpf.length !== 11 || /^(\\d)\\1{10}$/.test(cpf)) {
        return false;
    }
    let soma = 0;
    let resto;
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) {
        return false;
    }
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) {
        return false;
    }
    return true;
}

document.getElementById("clientCPF").addEventListener("blur", function () {
    const cpf = this.value;
    if (!validarCPF(cpf)) {
        alert("CPF inválido. Por favor, insira um CPF válido.");
    }
});

document.getElementById('formCadastro').addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('clientName').value;
    const cpf = document.getElementById('clientCPF').value;
    const telefone = document.getElementById('clientTelefone').value;
    const dtNascimento = document.getElementById('clientDtNascimento').value;
    const salario = document.getElementById('clientSalario').value;

    const salarioConvertivo = converterEmCentavos(salario);
    const credito = salarioConvertivo * 0.3;
    const creditoEmReal = converterEmReal(credito);

    const cliente = {
        name, cpf, telefone, dtNascimento, salario, creditoEmReal
    };

    salvarCliente(cliente);
    limparFormulario();
    alert('Cliente cadastrado com sucesso!');
});

function obterTotalClientes() {
    return parseInt(localStorage.getItem('totalClientes') || '0',10);
}

function salvarCliente(cliente) {

    const index = obterTotalClientes();

    localStorage.setItem(`cliente_${index}_name`, cliente.name);
    localStorage.setItem(`cliente_${index}_cpf`, cliente.cpf);
    localStorage.setItem(`cliente_${index}_telefone`, cliente.telefone);
    localStorage.setItem(`cliente_${index}_dtNascimento`, cliente.dtNascimento);
    localStorage.setItem(`cliente_${index}_salario`, cliente.salario);
    localStorage.setItem(`cliente_${index}_creditoEmReal`, cliente.creditoEmReal);

    localStorage.setItem('totalClientes', index + 1);
}

function limparFormulario() {
    document.getElementById('clientName').value = '';
    document.getElementById('clientCPF').value = '';
    document.getElementById('clientTelefone').value = '';
    document.getElementById('clientDtNascimento').value = '';
    document.getElementById('clientSalario').value = '';
}

function mostrarCliente() {
    const name = localStorage.getItem('name');
    const cpf = localStorage.getItem('cpf');
    const telefone = localStorage.getItem('telefone');
    const dtNascimento = localStorage.getItem('dtNascimento');
    const salario = localStorage.getItem('salario');
    const creditoEmReal = localStorage.getItem('creditoEmReal');

    alert(
        'Nome do cliente: ' + name + '\n' +
        'CPF: ' + cpf + '\n' +
        'Telefone: ' + telefone + '\n' +
        'Data de Nascimento: ' + dtNascimento + '\n' +
        'Salário: ' + salario + '\n' +
        'Crédito Disponível: R$ ' + creditoEmReal
    );
}

function converterEmCentavos(salario) {
    const salarioEmCentavos = salario.replace(/[^\d,]/g, '').replace(',', '.');
    const salarioEmNumero = parseFloat(salarioEmCentavos);

    return Math.round(salarioEmNumero * 100);
}

function converterEmReal(credito) {
    const creditoConvertivo = (credito / 100).toFixed(2);
    return creditoConvertivo.replace('.', ',')
        .replace(/\d(?=(\d{3})+,)/g, '$&.')
}