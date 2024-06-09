import { Router } from 'express'
import { withAuth } from '@utils'

import { userRouter } from '@domains/user'
import { postRouter } from '@domains/post'
import { authRouter } from '@domains/auth'
import { healthRouter } from '@domains/health'
import { followerRouter } from '@domains/follower/controller'
import { reactionRouter } from '@domains/reaction'

export const router = Router()

//TODO fix bearer token
//TODO add deletes
//TODO make it workable

/**
 * @swagger
 * components:
 *  securitySchemes:
 *    BearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 * 
 * 
 * /api/health:
 *   get:
 *     summary: Health Check
 *     description: Returns status 200 OK to indicate the service is up and running.
 *     tags:
 *       - Health  
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
 *     description: Creates a new user account and returns an authentication token.
 *     tags:
 *       - Auth  
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupInputDTO'
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
 * 
 *          
 * /api/auth/login:
 *   post:
 *     summary: Log in an existing user
 *     description: Authenticates a user and returns an authentication token.
 *     tags:
 *       - Auth   
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInputDTO'
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
 *       404:
 *          description: User not found
 *                          
 */
router.use('/auth', authRouter)

/**
 * @swagger
 * 
 * 
 * /api/user:
 *   get:
 *     summary: Get all users
 *     description: Returns recommended users paginated
 *     tags:
 *       - User  
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns Users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       createdAt:
 *                         type: Date
 *       401:
 *         description: Unauthorized. You must login to access this content
 * 
 * 
 * /api/user/me:
 *   get:
 *     summary: Get current user
 *     description: Returns the information of the currently authenticated user
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns current user 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 createdAt:
 *                   type: Date
 *       401:
 *         description: Unauthorized. You must login to access this content
 * 
 * 
 * /api/user/{user_id}:
 *   get:
 *     summary: Get user by ID
 *     description: Returns the user by their Id
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: [] 
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Id of the user to retrieve 
 *     responses:
 *       200:
 *         description: Returns User
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 createdAt:
 *                   type: Date
 *       401:
 *         description: Unauthorized. You must login to access this content   
 *                   
 */
router.use('/user', withAuth, userRouter)



/**
 * @swagger
 * /api/post:
 *   get:
 *     summary: Get available posts
 *     description: Returns paginated posts from public users or users followed by the authenticated user
 *     tags:
 *       - Post
 *     security:
 *       - BearerAuth: [] 
 *     responses:
 *       200:
 *         description: A list of paginated posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PostDTO'
 *       401:
 *         description: Unauthorized. You must login to access this content 
 * 
 * 
 * /api/post/{post_id}:
 *   get: 
 *     summary: 
 *     description: returns a post by id when authenticated user follows the post_id user or the post_id user is public
 *     tags:
 *       - Post
 *     security:
 *       - bearerAuth: [] 
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Id of the post
 *     responses:
 *       200:
 *         description: The post with post id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostDTO' 
 *       401:
 *         description: Unauthorized. You must login to access this content
 *       500:
 *         description: Error invalida post id
 * 
 * 
 * /api/posts/by_user/{userId}:
 *   get:
 *     summary: Get posts by user
 *     description: Returns all posts by a specific user, visible to the authenticated user
 *     tags:
 *       - Post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The Id of the user whose posts are to be retrieved
 *     responses:
 *       200:
 *         description: Posts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PostDTO'
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: User not found
 * 
 * 
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     description: Creates a new post for the authenticated user
 *     tags:
 *       - Post
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostDTO'
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostDTO'
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 * 
 * 
 * /api/posts/{postId}:
 *   delete:
 *     summary: Delete a post
 *     description: Deletes a post by Id for the authenticated user
 *     tags:
 *       - Post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The Id of the post to delete
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Post not found   
 *                  
 */
router.use('/post', withAuth, postRouter)


/**
 * @swagger
 * /api/followers/follow/{user_id}:
 *   post:
 *     summary: Follow a user
 *     description: Allows the authenticated user to follow another user
 *     tags:
 *       - Follower
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Id of the user to follow
 *     responses:
 *       200:
 *         description: Followed user successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: User not found
 * 
 * 
 * /api/followers/unfollow/{user_id}:
 *   post:
 *     summary: Unfollow a user
 *     description: Allows the authenticated user to unfollow another user
 *     tags:
 *       - Follower
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Id of the user to unfollow
 *     responses:
 *       200:
 *         description: Unfollowed user successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: User not found
 * 
 * 
 * 
 * 
 */
router.use('/follower', withAuth, followerRouter)

router.use('/reaction', withAuth, reactionRouter)