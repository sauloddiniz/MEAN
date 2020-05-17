const express = require('express');

const Post = require('../models/post');
const multer = require('multer');
const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let err = new Error('Invalid mime type');
    if(isValid) {
      err = null;
    }
    cb(err, 'backend/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post('', multer({storage: storage}).single('image'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename
  });
  post.save().then((createdPost) => {
    res.status(201).json({
      message : 'Post criado com sucesso',
      post: {
        ...createdPost,
        _id: createdPost._id
      }
    });
  });
});

router.put('/:_id', multer({storage: storage}).single('image'), (req, res, next) => {
  console.log(req.body);
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename
  }
  const post = new Post({
    _id: req.body._id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  Post.updateOne({_id: req.body._id}, post)
    .then((result) => {
      res.status(200).json({
        message: 'Update Successful'
      });
    });
});

router.get('', (req, res, next) => {

  const pageSize = +req.query.pagesize; // a utilidade do + e para informar que e NUMERO
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchPost;
  if (pageSize && currentPage) {
     postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
  .then(documents => { fetchPost = documents; return Post.count(); })
  .then((count) => { res.status(200).json( {message: 'get efetuado com sucesso', posts: fetchPost, maxPosts: count} );
  });
});

router.get('/:_id', (req, res, next) => {
  Post.findOne({_id: req.params._id}).then((result) => {
    res.status(200).json({
      message: 'Get Success',
      post: result
    })
  })
});

router.delete('/:_id', (req, res, next) => {
  Post.deleteOne({_id: req.params._id}).then((result) => {
    console.log(result);
    res.status(200).json({
      message: 'Post deleted'
    });
  })
});

module.exports = router;
