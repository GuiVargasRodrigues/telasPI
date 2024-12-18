document.addEventListener('DOMContentLoaded', () => {
    carregarRegistros('lista-condicoes', 'condicoes');
    carregarRegistros('lista-alergias', 'alergias');
});

document.getElementById('form-historico').addEventListener('submit', function (event) {
    event.preventDefault();

    const condicao = document.getElementById('condicao-saude').value.trim();
    const alergia = document.getElementById('alergias').value.trim();

    if (condicao) {
        adicionarRegistro('lista-condicoes', 'condicoes', condicao);
    }

    if (alergia) {
        adicionarRegistro('lista-alergias', 'alergias', alergia);
    }

    this.reset(); 
});

function adicionarRegistro(listaId, storageKey, texto) {
    const lista = document.getElementById(listaId);

    const li = document.createElement('li');
    li.textContent = texto;

    lista.appendChild(li);

    const registros = JSON.parse(localStorage.getItem(storageKey)) || [];
    registros.push(texto);
    localStorage.setItem(storageKey, JSON.stringify(registros));
}

function carregarRegistros(listaId, storageKey) {
    const lista = document.getElementById(listaId);
    const registros = JSON.parse(localStorage.getItem(storageKey)) || [];

    registros.forEach(texto => {
        const li = document.createElement('li');
        li.textContent = texto;
        lista.appendChild(li);
    });
}
