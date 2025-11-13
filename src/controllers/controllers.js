const fs = require('fs');
const path = require('path');

// Caminho do arquivo JSON
const postsFilePath = path.join(__dirname, '../data/posts.json');

// Função para ler os posts do arquivo
const readPosts = () => {
  try {
    if (!fs.existsSync(postsFilePath)) {
      // Se não existir, cria o arquivo com array vazio
      fs.writeFileSync(postsFilePath, JSON.stringify([], null, 2));
      return [];
    }
    const data = fs.readFileSync(postsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler posts:', error);
    return [];
  }
};

// Função para salvar posts no arquivo
const savePosts = (posts) => {
  try {
    const dir = path.dirname(postsFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2));
  } catch (error) {
    console.error('Erro ao salvar posts:', error);
    throw error;
  }
};

// LISTAR todos os posts
const getAllPosts = (req, res) => {
  try {
    const posts = readPosts();
    res.status(200).json({
      success: true,
      total: posts.length,
      data: posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar posts',
      error: error.message
    });
  }
};

// BUSCAR post por ID
const getPostById = (req, res) => {
  try {
    const { id } = req.params;
    const posts = readPosts();
    const post = posts.find(p => p.id === parseInt(id));

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar post',
      error: error.message
    });
  }
};

// CRIAR novo post
const createPost = (req, res) => {
  try {
    const { title, content, author } = req.body;

    // Validações
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Título e conteúdo são obrigatórios'
      });
    }

    const posts = readPosts();
    
    // Gerar novo ID
    const newId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;

    const newPost = {
      id: newId,
      title,
      content,
      author: author || 'Anônimo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    posts.push(newPost);
    savePosts(posts);

    res.status(201).json({
      success: true,
      message: 'Post criado com sucesso!',
      data: newPost
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao criar post',
      error: error.message
    });
  }
};

// ATUALIZAR post
const updatePost = (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, author } = req.body;

    const posts = readPosts();
    const postIndex = posts.findIndex(p => p.id === parseInt(id));

    if (postIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Post não encontrado'
      });
    }

    // Atualizar apenas os campos fornecidos
    if (title) posts[postIndex].title = title;
    if (content) posts[postIndex].content = content;
    if (author) posts[postIndex].author = author;
    posts[postIndex].updatedAt = new Date().toISOString();

    savePosts(posts);

    res.status(200).json({
      success: true,
      message: 'Post atualizado com sucesso!',
      data: posts[postIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar post',
      error: error.message
    });
  }
};

// DELETAR post
const deletePost = (req, res) => {
  try {
    const { id } = req.params;
    const posts = readPosts();
    const postIndex = posts.findIndex(p => p.id === parseInt(id));

    if (postIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Post não encontrado'
      });
    }

    const deletedPost = posts.splice(postIndex, 1)[0];
    savePosts(posts);

    res.status(200).json({
      success: true,
      message: 'Post deletado com sucesso!',
      data: deletedPost
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar post',
      error: error.message
    });
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
};