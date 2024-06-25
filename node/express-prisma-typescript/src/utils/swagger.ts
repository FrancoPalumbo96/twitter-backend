import { SwaggerDefinition, Options } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Twitter Backend',
    version: '1.0.0',
    description: '',
  },
  servers: [
    {
      url: 'http://localhost:8080',
      description: 'Development server',
    },
  ],
};

const swaggerOptions: Options = {
  swaggerDefinition,
  apis: ['./src/router/index.ts', './src/domains/auth/dto/*.ts', './src/domains/post/dto/*.ts',
    './src/domains/chat/dto/*.ts', './src/domains/reaction/dto/*.ts', './src/domains/follower/dto/*.ts',
    './src/domains/user/dto/*.ts'],
     //To add more schemas do here
};

export default swaggerOptions;