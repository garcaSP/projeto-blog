const express = require('express');
const routes = require('./routes/routes');

const app = express();
const PORT = 3000;

// Middleware para processar JSON
app.use(express.json());

// Usando as rotas
app.use('/api', routes);

// Rota inicial
app.get('/', (req, res) => {
  res.json({ 
    message: 'API do Blog Simples - Sistema funcionando!',
    endpoints: {
      'GET /api/posts': 'Listar todos os posts',
      'GET /api/posts/:id': 'Buscar post por ID',
      'POST /api/posts': 'Criar novo post',
      'PUT /api/posts/:id': 'Atualizar post',
      'DELETE /api/posts/:id': 'Deletar post'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`API disponível em http://localhost:${PORT}/api`);
});