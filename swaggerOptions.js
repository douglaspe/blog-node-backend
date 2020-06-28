// Extended: https://swagger.io/specification/#infoObject
module.exports = {
  swaggerDefinition: {
    info: {
      version: '1.0.0',
      title: 'Blog API',
      description: 'Blog API',
      contact: {
        name: 'Douglas',
      },
      servers: ['http://localhost:8080/api'],
    },
  },
  // ['.routes/*.js']
  apis: ['./src/controllers/*'],
};
