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
 * /api/user:
 *   get:
 *     summary: Get all recommended users paginated
 *     description: Returns all public users and private users that follow the authenticated user, with pagination
 *     tags:
 *       - User  
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of users to retrieve (default 5)
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *         description: Number of users to skip (default 0)
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
 *                       username:
 *                         type: string
 *                       profilePicture:
 *                         type: string
 *       401:
 *         description: Unauthorized. You must login to access this content
 *       500:
 *         description: Internal Server Error 
 * 
 * 
 *   delete:
 *     summary: Delete current user
 *     description: Deletes the currently authenticated user
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized. You must login to access this content
 *       500:
 *         description: Internal Server Error 
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
 *                 username:
 *                   type: string
 *                 profilePicture:
 *                   type: string
 *       401:
 *         description: Unauthorized. You must login to access this content
 *       500:
 *         description: Internal Server Error 
 * 
 * 
 * /api/user/{user_id}:
 *   get:
 *     summary: Get user by ID
 *     description: Returns the user by user ID if found
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
 *         description: The ID of the user to retrieve 
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
 *                 username:
 *                   type: string
 *                 profilePicture:
 *                   type: string
 *       400:
 *         description: Error Bad Request. Invalid userId 
 *       401:
 *         description: Unauthorized. You must login to access this content
 *       500:
 *         description: Internal Server Error    
 * 
 * 
 * /api/user/by_username/{username}:
 *   get:
 *     summary: Get users by username prefix
 *     description: Returns users whose usernames start with the specified prefix
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The prefix of the username to search for
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of users to retrieve (default 5)
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *         description: Number of users to skip (default 0)
 *     responses:
 *       200:
 *         description: Returns Users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   username:
 *                     type: string
 *                   profilePicture:
 *                     type: string
 *       401:
 *         description: Unauthorized. You must login to access this content
 *       500:
 *         description: Internal Server Error 
 * 
 * 
 * /api/user/update_profile_picture:
 *   post:
 *     summary: Update profile picture
 *     description: Updates the profile picture of the authenticated user
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 *                 description: The key of the new profile picture
 *     responses:
 *       200:
 *         description: Profile picture updated successfully
 *       400:
 *         description: Validation Error. Missing key in request body
 *       401:
 *         description: Unauthorized. You must login to access this content
 *       500:
 *         description: Internal Server Error
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
 *                 $ref: '#/components/schemas/ExtendedPostDTO'
 *       401:
 *         description: Unauthorized. You must login to access this content
 *       500:
 *         description: Internal Server Error  
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
 *         description: Internal Server Error 
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
 *         description: Internal Server Error
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
 *       500:
 *         description: Internal Server Error 
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
 *       500:
 *         description: Internal Server Error 
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
 *       500:
 *         description: Internal Server Error 
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
 *       500:
 *         description: Internal Server Error 
 */
router.use('/follower', withAuth, followerRouter)

/**
 * @swagger
 * /api/reaction/{post_id}:
 *   post:
 *     summary: Add Reaction to a Post
 *     description: Add a Reaction to a Post
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
 *       401:
 *         description: Unauthorized. You must login to access this content 
 *       409:
 *         description: Conflict. Reacting to a post twice
 *       500:
 *         description: Internal Server Error
 * 
 *   delete:
 *     summary: Remove reaction from a post
 *     description: Change reaction deleteAt date to Date.now()
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
 *       401:
 *         description: Unauthorized. You must login to access this content
 *       409:
 *         description: Conflict. Unreacting to the post twice
 *       500:
 *         description: Internal Server Error
 */
router.use('/reaction', withAuth, reactionRouter)


/**
 * @swagger
 * /api/comment/by_user/{user_id}:
 *   get:
 *     summary: Get comments by user
 *     description: Get the comments of an available user
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
 *         description: Bad Request. Invalid user_id
 *       401:
 *         description: Unauthorized. You must login to access this content
 *       500:
 *         description: Internal Server Error 
 * 
 * 
 * /api/comment/by_post/{post_id}:
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
 *       401:
 *         description: Unauthorized. You must login to access this content
 *       409:
 *         description: Conflict. Invalid post_id
 *       500:
 *         description: Internal Server Error 
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
 *       200:
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
 *       400:
 *         description: Bad Request. Invalid user_id
 *       401:
 *         description: Unauthorized. You must login to access this content
 *       500:
 *         description: Internal Server Error  
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
 *       200:
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
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized. You must login to access this content
 *       409:
 *         description: Conflict or error retrieving retweets
 *       500:
 *         description: Internal Server Error
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
 *       201:
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
 *       400:
 *         description: Bad Request. Invalid content type
 *       401:
 *         description: Unauthorized. You must login to access this content 
 *       500:
 *         description: Internal Server Error
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
 *                 example: 1
 *               contentType:
 *                 type: string
 *                 enum: [image/jpeg, image/png]
 *                 description: Type of image content
 *     responses:
 *       201:
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
 *       400:
 *         description: Bad Request. Invalid content type or quantity
 *       401:
 *         description: Unauthorized. You must login to access this content
 *       500:
 *         description: Internal Server Error
 * 
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

