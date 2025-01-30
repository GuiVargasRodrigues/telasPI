const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// Set up multer for file upload handling
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // specify the folder to store files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // add unique name to avoid overwriting
    }
});
const upload = multer({ storage: storage });

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

// Handling POST request for saving a recipe
app.post("/receitas", upload.single('anexo'), (req, res) => {
    const { nome_medicamento, validade, id_usuario } = req.body;
    const anexo_receita = req.file ? req.file.filename : ''; // Get the file name from multer

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

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000.");
});
