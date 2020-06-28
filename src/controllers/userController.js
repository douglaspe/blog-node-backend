const router = require('express').Router();
const mongoose = require('mongoose');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = require('../../swaggerOptions');
const authMiddleware = require('../middlewares/auth');

const swaggerDocs = swaggerJsDoc(swaggerOptions);

router.use('/docs', swaggerUi.serve);
router.get('/docs', swaggerUi.setup(swaggerDocs));

const User = mongoose.model('User');

/**
 * @swagger
 * /api/register:
 *  post:
 *    description: Use para cadastrar novo usuário
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/register', async (req, res) => {
  const { email, username } = req.body;

  try {
    if (await User.findOne({ email })) {
      return res
        .status(400)
        .json({ error: 'Já existe um usuário com esse e-mail!' });
    }

    const user = await User.create(req.body);

    return res.json({ user });
  } catch (err) {
    return res.status(400).json({ error: 'Falha no cadastro do usuário!' });
  }
});

/**
 * @swagger
 * /api/authenticate:
 *  post:
 *    description: Use para autenticar usuário
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/authenticate', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Usuário não encontrado!' });
    }

    if (!(await user.compareHash(password))) {
      return res.status(400).json({ error: 'Senha inválida!' });
    }

    return res.json({
      user,
      token: user.generateToken(),
    });
  } catch (err) {
    return res.status(400).json({ error: 'Autenticação falou!' });
  }
});

router.use(authMiddleware);

/**
 * @swagger
 * /api/me:
 *  get:
 *    description: Use para obter dados do usuário logado
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/me', async (req, res) => {
  try {
    const { userId } = req;

    const user = await User.findById(userId);

    return res.json({ user });
  } catch (err) {
    return res.status(400).json({ error: 'Usuário não encontrado!' });
  }
});

module.exports = router;
