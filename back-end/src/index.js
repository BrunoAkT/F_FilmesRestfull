import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { query } from './database/sqlite.js';

const app = express();
app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});

app.get("/filmes", async (req, res) => {
  try {
    const filmes = await query("SELECT id_filme as id, nome, analise, nota FROM filmes");
    res.json(filmes);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar filmes" });
  }
});

app.post("/filmes", upload.single("imagem"), async (req, res) => {
  const { nome, analise, nota } = req.body;
  const imagemBuffer = req.file.buffer;

  try {
    await query(
      "INSERT INTO filmes (id_filme, nome, analise, nota, imagem) VALUES (null, ?, ?, ?, ?)",
      [nome, analise, nota, imagemBuffer]
    );
    res.status(201).json({ mensagem: "Filme adicionado com sucesso!" });
  } catch (error) {
    console.error("Erro ao salvar filme:", error);
    res.status(500).json({ error: "Erro ao salvar filme" });
  }
});

app.get('/filmes/:id/imagem', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query('SELECT imagem FROM filmes WHERE id_filme = ?', [id]);
    if (result.length > 0) {
      const imagem = result[0].imagem;
      res.set('Content-Type', 'image/jpeg');
      res.send(imagem);
    } else {
      res.status(404).send('Imagem não encontrada');
    }
  } catch (error) {
    res.status(500).send('Erro ao buscar imagem');
  }
});


app.delete("/filmes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await query("DELETE FROM filmes WHERE id_filme = ?", [id]);
    res.status(200).json({ mensagem: "Filme excluído com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir filme:", error);
    res.status(500).json({ error: "Erro ao excluir filme" });
  }
});

app.put("/filmes/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, analise, nota } = req.body;

  try {
    await query(
      "UPDATE filmes SET nome = ?, analise = ?, nota = ? WHERE id_filme = ?",
      [nome, analise, nota, id]
    );
    res.status(200).json({ mensagem: "Filme atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar filme:", error);
    res.status(500).json({ error: "Erro ao atualizar filme" });
  }
}
)