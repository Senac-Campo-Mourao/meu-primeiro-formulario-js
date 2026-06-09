
document.addEventListener('DOMContentLoaded', function () {
    carregarClientes();
    inicializarSelect2Cidades();
});

function inicializarSelect2Cidades() {
    const cidades = ['São Paulo/SP', 'Rio de Janeiro/RJ', 'Campo Mourão/PR', 'Maringá/PR',
        'Londrina/PR', 'Peabiru/PR'];

    $('#clientCidade').select2({
        theme: 'bootstrap-5',
        placeholder: 'Selecione uma cidade',
        allowClear: true,
        data: cidades.map(cidade => ({ id: cidade, text: cidade }))
    });
}

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
    const cidade = $('#clientCidade').select2('data')[0]?.text || '';
    const salario = document.getElementById('clientSalario').value;

    const salarioConvertivo = converterEmCentavos(salario);
    const credito = salarioConvertivo * 0.3;
    const creditoEmReal = converterEmReal(credito);

    const cliente = {
        name, cpf, telefone, dtNascimento, cidade, salario, creditoEmReal
    };

    if (existCPFCadastrado(cliente.cpf) == true) {
        alert('CPF Cadastrado!');
    } else {
        salvarCliente(cliente);
        limparFormulario();
        alert('Cliente cadastrado com sucesso!');
    }
});

function existCPFCadastrado(cpf) {
    const total = obterTotalClientes();

    for (let i = 0; i < total; i++) {
        const cpfCadastrado = localStorage.getItem(`cliente_${i}_cpf`)

        if (cpf === cpfCadastrado) {
            return true;
        }
    }

    return false;
}

function obterTotalClientes() {
    return parseInt(localStorage.getItem('totalClientes') || '0', 10);
}

function salvarCliente(cliente) {

    const index = obterTotalClientes();

    localStorage.setItem(`cliente_${index}_name`, cliente.name);
    localStorage.setItem(`cliente_${index}_cpf`, cliente.cpf);
    localStorage.setItem(`cliente_${index}_telefone`, cliente.telefone);
    localStorage.setItem(`cliente_${index}_dtNascimento`, cliente.dtNascimento);
    localStorage.setItem(`cliente_${index}_cidade`, cliente.cidade);
    localStorage.setItem(`cliente_${index}_salario`, cliente.salario);
    localStorage.setItem(`cliente_${index}_creditoEmReal`, cliente.creditoEmReal);

    localStorage.setItem('totalClientes', index + 1);

    carregarClientes();
}

function limparFormulario() {
    document.getElementById('clientName').value = '';
    document.getElementById('clientCPF').value = '';
    document.getElementById('clientTelefone').value = '';
    document.getElementById('clientDtNascimento').value = '';
    document.getElementById('clientSalario').value = '';
}

function buscarClientes() {
    const total = obterTotalClientes();
    const clientes = [];

    for (let i = 0; i < total; i++) {
        const cliente = {
            name: localStorage.getItem(`cliente_${i}_name`),
            cpf: localStorage.getItem(`cliente_${i}_cpf`),
            telefone: localStorage.getItem(`cliente_${i}_telefone`),
            dtNascimento: localStorage.getItem(`cliente_${i}_dtNascimento`),
            salario: localStorage.getItem(`cliente_${i}_salario`),
            cidade: localStorage.getItem(`cliente_${i}_cidade`) || '',
            creditoEmReal: localStorage.getItem(`cliente_${i}_creditoEmReal`),
        };

        clientes.push(cliente);
    }

    return clientes;
}

function carregarClientes() {
    const clientes = buscarClientes();
    const tbody = document.getElementById('listaClientes');

    tbody.innerHTML = '';
    clientes.forEach(cli => {
        const tr = document.createElement('tr');
        const date = formatDate(cli.dtNascimento);
        tr.innerHTML = `
            <td>${cli.name}</td>
            <td>${cli.cpf}</td>
            <td>${cli.telefone}</td>
            <td>${date}</td>
            <td>${cli.cidade}</td>
            <td>${cli.salario}</td>
            <td>${cli.creditoEmReal}</td>
        `;

        tbody.appendChild(tr);
    });
}

function formatDate(dataStr) {
    if (!isNaN(dataStr)) return '';

    const parts = dataStr.split('-');
    if (parts.length === 3) {
        const [y, m, d] = parts;
        return `${d}/${m}/${y}`;
    }

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