const Post = require('../models/post');

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Posts retrieved successfully",
      data: posts
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: err.message 
    });
  }
};

// Get post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Post retrieved successfully",
      data: post
    });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    res.status(500).json({
      success: false, 
      message: 'Server error', 
      error: err.message
    });
  }
};

// Create a new post
exports.createPost = async (req, res) => {
  const { title, content, imageUrl } = req.body;

  // Validation
  if (!title || !content || !imageUrl) {
    return res.status(400).json({
      success: false,
      message: 'Please provide title, content and imageUrl'
    });
  }

  try {
    const newPost = new Post({
      title,
      content,
      imageUrl
    });

    const savedPost = await newPost.save();
    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: savedPost
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};

// Update post
exports.updatePost = async (req, res) => {
  const { title, content, imageUrl } = req.body;

  // Build post object
  const postFields = {};
  if (title) postFields.title = title;
  if (content) postFields.content = content;
  if (imageUrl) postFields.imageUrl = imageUrl;

  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Update post
    post = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: postFields },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: post
    });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    await Post.findByIdAndRemove(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Post removed successfully',
      data: { id: req.params.id }
    });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};