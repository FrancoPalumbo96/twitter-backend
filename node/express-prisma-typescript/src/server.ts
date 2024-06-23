import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import { Constants, NodeEnv, Logger, socketAuth } from '@utils'
import { router } from '@router'
import { ErrorHandling } from '@utils/errors'

import { createServer } from 'node:http'; //TODO try http
import socketHandler from './domains/chat/socket';
import { Server } from 'socket.io'

//Swagger
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import swaggerOptions from '@utils/swagger'

const app = express()

const swaggerSpec = swaggerJsdoc(swaggerOptions)

// Set up request logger
if (Constants.NODE_ENV === NodeEnv.DEV) {
  app.use(morgan('tiny')) // Log requests only in development environments
}

// Set up request parsers
app.use(express.json()) // Parses application/json payloads request bodies
app.use(express.urlencoded({ extended: false })) // Parse application/x-www-form-urlencoded request bodies
app.use(cookieParser()) // Parse cookies


// Set up CORS
app.use(
  cors({
    origin: Constants.CORS_WHITELIST
  })
)

// Set up Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', router)

app.use(ErrorHandling)

const httpServer = createServer(app); // Create HTTP server
const io = new Server(httpServer)

io.use(socketAuth)

socketHandler(io); // Integrate Socket.IO

httpServer.listen(Constants.PORT, () => {
  Logger.info(`Server listening on port ${Constants.PORT}`)
});


export { httpServer }
