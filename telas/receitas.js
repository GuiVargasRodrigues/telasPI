document.addEventListener('DOMContentLoaded', () => {
    carregarExames();
});

document.getElementById('form-agenda').addEventListener('submit', function (event) {
    event.preventDefault();

    const nomeExame = document.getElementById('nome-exame').value.trim();
    const dataExame = document.getElementById('data-exame').value;
    const anexo = document.getElementById('anexo-receita').files[0];

    if (nomeExame && dataExame && anexo) {
        const formData = new FormData();
        formData.append('nomeExame', nomeExame);
        formData.append('dataExame', dataExame);
        formData.append('anexo', anexo);

        fetch('http://localhost:3000/receitas', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(() => {
            carregarExames();
            this.reset();
        })
        .catch(error => console.error('Erro ao salvar receita:', error));
    }
});

function carregarExames() {
    fetch('http://localhost:3000/receitas')
        .then(response => response.json())
        .then(data => {
            const listaExames = document.getElementById('lista-exames');
            listaExames.innerHTML = '';

            data.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `Exame: ${item.nomeExame} | Data: ${item.dataExame} | Receita: ${item.anexo}`;
                listaExames.appendChild(li);
            });
        })
        .catch(error => console.error('Erro ao carregar exames:', error));
}
