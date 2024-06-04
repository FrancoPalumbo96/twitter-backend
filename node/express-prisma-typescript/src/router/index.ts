import { Router } from 'express'
import { withAuth } from '@utils'

import { userRouter } from '@domains/user'
import { postRouter } from '@domains/post'
import { authRouter } from '@domains/auth'
import { healthRouter } from '@domains/health'

export const router = Router()

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health Check
 *     description: Returns status 200 OK to indicate the service is up and running.
 *     responses:
 *       200:
 *         description: Service is up and running
 */
router.use('/health', healthRouter)

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Sign up a new user
 *     description: Creates a new user and returns an authentication token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             SignupInputDTO:
 *              type: object
 *              required:
 *                  - email
 *                  - username
 *                  - password
 *              properties:
 *                  email:
 *                      type: string
 *                      description: Email of the user
 *                      example: user@example.com
 *                      format: email
 *                  username:
 *                      type: string
 *                      description: Username of the user
 *                      example: pedro_96
 *                  password:
 *                      type: string
 *                      description: Password of the user
 *                      example: Strong_Password_00
 *                  name:
 *                      type: string
 *                      description: Name of the user
 *                      example: Pedro
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       409:
 *         description: Conflict, user already exists
 * /api/auth/login:
 *   post:
 *     summary: Log in an existing user
 *     description: Authenticates a user and returns an authentication token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Unauthorized, invalid credentials
 */
router.use('/auth', authRouter)


router.use('/user', withAuth, userRouter)
router.use('/post', withAuth, postRouter)
