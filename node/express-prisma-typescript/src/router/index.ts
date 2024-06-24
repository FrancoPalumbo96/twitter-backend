import { Router } from 'express'
import { withAuth } from '@utils'

import { userRouter } from '@domains/user'
import { postRouter } from '@domains/post'
import { authRouter } from '@domains/auth'
import { healthRouter } from '@domains/health'
import { followerRouter } from '@domains/follower'
import { reactionRouter } from '@domains/reaction'
import { commentRouter } from '@domains/comment'
import { likeRouter } from '@domains/like'
import { retweetRouter } from '@domains/retweet'
import { awsRouter } from '@domains/aws'
import { chatRoute } from '@domains/chat'

export const router = Router()

//TODO fix bearer token
//TODO add deletes
//TODO test

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
 *     summary: Get all recomended users paginated
 *     description: Returns all public users, and private users that follows authenticated user, with pagination
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
 *     description: Returns the user by user Id if found
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
 *       400:
 *         description: Error Bad Request. Invalid userId 
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
 *     description: Returns paginated posts (and comments) from public users or users followed by the authenticated user
 *     tags:
 *       - Post
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of posts to retrieve (default 5)
 *       - in: query
 *         name: before
 *         schema:
 *           type: string
 *         description: Retrieve posts created before this cursor
 *       - in: query
 *         name: after
 *         schema:
 *           type: string
 *         description: Retrieve posts created after this cursor 
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
 *   post:
 *     summary: Create a new post
 *     description: Creates a new post for the authenticated user
 *     tags:
 *       - Post
 *     security:
 *       - BearerAuth: []
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
 *         description: Unauthorized. You must login to access this content
 *       500:
 *         description: Server Error 
 * 
 * 
 * /api/post/{post_id}:
 *   get: 
 *     summary: Get post by ID
 *     description: Returns a post by ID if the authenticated user follows the post owner or the post owner is public
 *     tags:
 *       - Post
 *     security:
 *       - BearerAuth: [] 
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to retrieve
 *     responses:
 *       200:
 *         description: The post with post id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostDTO' 
 *       401:
 *         description: Unauthorized. You must login to access this content
 *       400:
 *         description: Error Bad Request. Invalid Post Id 
 *       500:
 *         description: Server Error
 * 
 * 
 * /api/post/by_user/{user_id}:
 *   get:
 *     summary: Get posts by user
 *     description: Returns all posts by a specific user, visible to the authenticated user
 *     tags:
 *       - Post
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
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
 *       401:
 *         description: Unauthorized. You must login to access this content
 *       404:
 *         description: User not Found 
 * 
 * 
 * 
 * /api/post/{postId}:
 *   delete:
 *     summary: Delete a post
 *     description: Deletes a post by Id for the authenticated user
 *     tags:
 *       - Post
 *     security:
 *       - BearerAuth: []
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
 *         description: Bad Request. Invalid post ID
 *       401:
 *         description: Unauthorized. You must login to access this content
 *       403:
 *         description: Forbidden. Not allowed to perform this action
 */
router.use('/post', withAuth, postRouter)


/**
 * @swagger
 * /api/follower/follow/{user_id}:
 *   post:
 *     summary: Follow a user
 *     description: Allows the authenticated user to follow another user
 *     tags:
 *       - Follower
 *     security:
 *       - BearerAuth: []
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
 *       400:
 *         description: Bad Request. Invalid user_id
 *       401:
 *         description: Unauthorized. You must login to access this content
 * 
 * 
 * /api/follower/unfollow/{user_id}:
 *   post:
 *     summary: Unfollow a user
 *     description: Allows the authenticated user to unfollow another user
 *     tags:
 *       - Follower
 *     security:
 *       - BearerAuth: []
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
 *       400:
 *         description: Bad Request. Invalid user_id
 *       401:
 *         description: Unauthorized. You must login to access this content
 */
router.use('/follower', withAuth, followerRouter)

/**
 * @swagger
 * /api/reaction/{post_id}:
 *   post:
 *     summary:
 *     description: 
 *     tags:
 *       - Reaction
 *     security: 
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to react to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [LIKE, RETWEET]
 *                 description: Type of reaction
 *     responses:
 *       200:
 *         description: Successfully reacted to the post
 *       400:
 *         description: Bad Request. Invalid postId
 *       409:
 *         description: Conflict. Reacting to a post twice
 *       500:
 *         description: Error. Internal Server Error
 * 
 *   delete:
 *     summary: Remove reaction from a post
 *     tags: 
 *       - Reaction
 *     security: 
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to unreact from
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [LIKE, RETWEET]
 *                 description: Type of reaction
 *     responses:
 *       200:
 *         description: Successfully removed reaction from the post
 *       400:
 *         description: Bad Request. Invalid postId
 *       409:
 *         description: Conflict. Unreacting to the post twice
 *       500:
 *         description: Error. Internal Server Error
 */
router.use('/reaction', withAuth, reactionRouter)


/**
 * @swagger
 * api/comment/by_user/{user_id}:
 *   get:
 *     summary: Get comments by user
 *     tags:
 *       - Comment
 *     security: 
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to get comments for
 *     responses:
 *       200:
 *         description: Successfully retrieved comments
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Conflict or error retrieving comments
 * 
 * 
 * /comment/by_post/{post_id}:
 *   get:
 *     summary: Get comments by post
 *     tags:
 *       - Comment
 *     security: 
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to get comments for
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: The number of comments to return
 *       - in: query
 *         name: before
 *         schema:
 *           type: string
 *         description: Cursor for comments before a specific date
 *       - in: query
 *         name: after
 *         schema:
 *           type: string
 *         description: Cursor for comments after a specific date
 *     responses:
 *       200:
 *         description: Successfully retrieved comments
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Conflict or error retrieving comments
 */
router.use('/comment', withAuth, commentRouter)

/**
 * @swagger
 * /api/like/getAll/{user_id}:
 *   get:
 *     summary: Get all likes of a user
 *     tags:
 *       - Like
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose likes are to be fetched
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved likes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The ID of the like
 *                   postId:
 *                     type: string
 *                     description: The ID of the post liked
 *                   userId:
 *                     type: string
 *                     description: The ID of the user who liked the post
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when the like was created
 *       '400':
 *         description: Invalid input
 *       '409':
 *         description: Conflict or error retrieving likes
 */
router.use('/like', withAuth, likeRouter)


/**
 * @swagger
 * /api/retweet/getAll/{user_id}:
 *   get:
 *     summary: Get all retweets by a user
 *     tags:
 *       - Retweet
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose retweets are to be fetched
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved retweets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The ID of the retweet
 *                   postId:
 *                     type: string
 *                     description: The ID of the original post being retweeted
 *                   userId:
 *                     type: string
 *                     description: The ID of the user who retweeted the post
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when the retweet was created
 *       '400':
 *         description: Invalid input
 *       '409':
 *         description: Conflict or error retrieving retweets
 */
router.use('/retweet', withAuth, retweetRouter)


/**
 * @swagger
 * /api/aws/presigned_profile_url:
 *   post:
 *     summary: Generate pre-signed URL for uploading a profile picture
 *     tags:
 *       - AWS
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contentType:
 *                 type: string
 *                 enum: [image/jpeg, image/png]
 *                 description: Type of image content
 *     responses:
 *       '201':
 *         description: Successfully generated pre-signed URL for profile picture upload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: Pre-signed URL for uploading the profile picture
 *                 key:
 *                   type: string
 *                   description: Key identifier for the uploaded profile picture
 *       '400':
 *         description: Invalid input or content type
 *       '500':
 *         description: Error generating pre-signed URL for profile picture upload
 * 
 * /api/aws/presigned_post_url:
 *   post:
 *     summary: Generate pre-signed URLs for uploading post pictures
 *     tags:
 *       - AWS
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *                 description: Number of URLs and keys to generate
 *               contentType:
 *                 type: string
 *                 enum: [image/jpeg, image/png]
 *                 description: Type of image content
 *     responses:
 *       '201':
 *         description: Successfully generated pre-signed URLs for post pictures upload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 urls:
 *                   type: array
 *                   items:
 *                     type: string
 *                     description: Pre-signed URLs for uploading post pictures
 *                 keys:
 *                   type: array
 *                   items:
 *                     type: string
 *                     description: Key identifiers for the uploaded post pictures
 *       '400':
 *         description: Invalid input or content type
 *       '500':
 *         description: Error generating pre-signed URLs for post pictures upload
 * 
 * /api/aws/get:
 *   get:
 *     summary: Retrieve profile picture key for the authenticated user
 *     tags:
 *       - AWS
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '201':
 *         description: Successfully retrieved profile picture key
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               description: Key identifier for the profile picture
 *       '409':
 *         description: Conflict or error retrieving profile picture key
 * 
 * /api/aws/get/{post_id}:
 *   get:
 *     summary: Retrieve keys for all images associated with a post
 *     tags:
 *       - AWS
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to fetch image keys for
 *     responses:
 *       '201':
 *         description: Successfully retrieved keys for post images
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 description: Key identifiers for images associated with the post
 *       '409':
 *         description: Conflict or error retrieving post image keys
 */
router.use('/aws', withAuth, awsRouter)


/**
 * @swagger
 * /api/chat/{user_id}:
 *   get:
 *     summary: Retrieve messages between authenticated user and another user
 *     tags:
 *       - Chat
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve messages with
 *     responses:
 *       '200':
 *         description: Successfully retrieved messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Unique identifier of the message
 *                   senderId:
 *                     type: string
 *                     description: ID of the sender user
 *                   receiverId:
 *                     type: string
 *                     description: ID of the receiver user
 *                   content:
 *                     type: string
 *                     description: Content of the message
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Date and time when the message was created
 *       '400':
 *         description: Invalid input
 *       '409':
 *         description: Conflict or error retrieving messages
 */
router.use('/chat', withAuth, chatRoute)

