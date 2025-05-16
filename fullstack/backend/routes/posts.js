const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');

// GET all posts
router.get('/', postsController.getAllPosts);

// GET single post by id
router.get('/:id', postsController.getPostById);

// POST create a new post
router.post('/', postsController.createPost);

// PUT update a post
router.put('/:id', postsController.updatePost);

// DELETE a post
router.delete('/:id', postsController.deletePost);

module.exports = router;