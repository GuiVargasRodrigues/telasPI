const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const formidable = require("formidable");
const path = require("path");

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


app.post("/receitas", (req, res) => {
    const form = formidable({});    
    form.uploadDir = path.join(__dirname, 'uploads');  // Set upload directory
    form.keepExtensions = true;  // Keep original file extension
    form.parse(req, (err, fields, files) => {
        if (err) {
            console.error("Erro ao processar o arquivo:", err);
            return res.status(500).send("Erro ao processar o arquivo.");
        }

        const { nome_medicamento, validade, id_usuario } = fields;
        const anexo_receita = files.anexo_receita ? files.anexo_receita.newFilename : ''; // Get the file name from formidable

        if (!nome_medicamento || !validade || !id_usuario) {
            return res.status(400).send("Faltando dados obrigatórios.");
        }

        // Insert data into MySQL database
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

// Starting the server
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000.");
});
