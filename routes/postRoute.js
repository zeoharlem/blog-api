const express = require('express');
const postRouter = express.Router();
const passport = require('passport')
const postController = require('../controllers/postController')
const {postValidationMiddleware} = require("../middleware/validationMiddleware");

const authenticate = passport.authenticate("jwt", {session: false});

postRouter.get('/', postController.getAllPostsByPagination);

postRouter.get('/:id', postController.getPostDetailsById);

postRouter.post('/create', postValidationMiddleware, authenticate, postController.createBlogPost);

postRouter.get('/me', authenticate, postController.getMyBlogPosts)

postRouter.put('/me', authenticate, postController.updateMyBlogPost)

postRouter.patch('/me/:id', authenticate, postController.updateMyBlogPostStatus)

postRouter.delete('/:id', authenticate, postController.deleteMyBlogPost)

module.exports = postRouter;