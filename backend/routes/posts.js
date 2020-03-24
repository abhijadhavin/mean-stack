const express = require('express');

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');
const PostContorller = require('../controllers/posts');

const router = express.Router();

router.post("", checkAuth, extractFile, PostContorller.createPost);
router.get('', PostContorller.getPosts);
router.get('/:id', PostContorller.getPost);
router.put('/:id', checkAuth, extractFile, PostContorller.updatePost)
router.delete("/:id", checkAuth, PostContorller.deletePost); 

module.exports = router;