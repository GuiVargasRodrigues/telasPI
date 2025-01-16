const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

let receitas = [];
let historicoPaciente = [];

app.get('/receitas', (req, res) => {
    res.sendFile(path.join(__dirname, 'receitas.html'));
});

app.get('/historico', (req, res) => {
    res.sendFile(path.join(__dirname, 'historico.html'));
});

app.post('/receitas', upload.single('anexo-receita'), (req, res) => {
    const { nomeExame, dataExame } = req.body;
    const receita = {
        nomeExame,
        dataExame,
        anexo: req.file ? `/uploads/${req.file.filename}` : null
    };
    receitas.push(receita);
    res.json({ message: 'Receita salva com sucesso!', receitas });
});

app.get('/receitas/lista', (req, res) => {
    res.json(receitas);
});

app.post('/historico', (req, res) => {
    const { condicoes, alergias } = req.body;
    const registro = {
        condicoes,
        alergias,
        data: new Date().toISOString()
    };
    historicoPaciente.push(registro);
    res.json({ message: 'Histórico salvo com sucesso!', historicoPaciente });
});

app.get('/historico/lista', (req, res) => {
    res.json(historicoPaciente);
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
  
