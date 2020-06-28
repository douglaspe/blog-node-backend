const app = require('express')();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const environment = require('custom-env');

environment.env(process.env.NODE_ENV);

// Conecta no MongoDB
mongoose.connect(process.env.DATABASE_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// Carrega o model de Usuário
require('./models/user');

app.use(bodyParser.json());

// Habilita o cors
app.use(cors());

// Inicia as rotas da API
app.use('/api', require('./controllers/userController'));

console.log('Server rodando na porta', process.env.APP_PORT);

app.listen(process.env.APP_PORT);
