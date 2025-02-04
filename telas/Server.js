const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(cors());

// MySQL connection setup
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "medkit"
});

db.connect(err => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err);
        return;
    }
    console.log("Conectado ao banco de dados.");
});

// Criar o diretório de uploads, se não existir
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Endpoint para salvar receitas
app.post("/receitas", (req, res) => {
    const form = new formidable.IncomingForm(); 
    form.uploadDir = uploadDir;  // Setar o diretório de upload
    form.keepExtensions = true;  // Manter a extensão original do arquivo

    form.parse(req, (err, fields, files) => {
        if (err) {
            console.error("Erro ao processar o arquivo:", err);
            return res.status(500).send("Erro ao processar o arquivo.");
        }

        const { nome_medicamento, validade, id_usuario } = fields;
        const anexo_receita = files.anexo_receita ? files.anexo_receita[0].newFilename : ''; // Obter o nome do arquivo

        if (!nome_medicamento || !validade || !id_usuario) {
            return res.status(400).send("Faltando dados obrigatórios.");
        }

        // Inserir dados no banco de dados MySQL
        db.query("INSERT INTO receitas (id_usuario, nome_medicamento, validade, anexo_receita) VALUES (?, ?, ?, ?)", 
            [id_usuario, nome_medicamento, validade, anexo_receita], 
            (err, result) => {
                if (err) {
                    console.error("Erro ao inserir no banco:", err);
                    return res.status(500).send("Erro ao salvar a receita.");
                }
                res.status(200).json({ message: "Receita salva com sucesso." });
            });
    });
});


// Endpoint para salvar histórico
app.post("/historico", (req, res) => {
    const { condicao, alergia, id_usuario } = req.body;

    if (!condicao && !alergia) {
        return res.status(400).send("É necessário fornecer ao menos uma condição ou alergia.");
    }

    db.query(
        "INSERT INTO historico (id_usuario, condicao, alergia) VALUES (?, ?, ?)",
        [id_usuario, condicao || null, alergia || null],
        (err, result) => {
            if (err) {
                console.error("Erro ao salvar no banco de dados:", err);
                return res.status(500).send("Erro ao salvar no histórico.");
            }
            res.status(200).json({ message: "Histórico salvo com sucesso." });
        }
    );
});

// Endpoint para listar receitas
app.get("/receitas", (req, res) => {
    db.query("SELECT * FROM receitas", (err, results) => {
        if (err) {
            console.error("Erro ao carregar receitas:", err);
            return res.status(500).send("Erro ao carregar receitas.");
        }
        res.status(200).json(results);
    });
});

// Endpoint para listar históricos
app.get("/historico", (req, res) => {
    db.query("SELECT * FROM historico", (err, results) => {
        if (err) {
            console.error("Erro ao carregar históricos:", err);
            return res.status(500).send("Erro ao carregar históricos.");
        }
        res.status(200).json(results);
    });
});

// Iniciar o servidor
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000.");
});
