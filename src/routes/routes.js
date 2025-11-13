const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/controllers');

// Rotas para Posts
router.get('/posts', getAllPosts);           // Listar todos
router.get('/posts/:id', getPostById);       // Buscar por ID
router.post('/posts', createPost);           // Criar novo
router.put('/posts/:id', updatePost);        // Atualizar
router.delete('/posts/:id', deletePost);     // Deletar

module.exports = router;