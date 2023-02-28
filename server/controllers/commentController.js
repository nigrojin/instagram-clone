const User = require('../models/User');
const Article = require('../models/Article');
const Comment = require('../models/Comment');


// 댓글 생성

exports.create = async (req, res, next) => {
  try {

    // 댓글이 달릴 게시물 검색
    const article = await Article.findById(req.params.id);

    const _comment = new Comment({
      article: article._id,
      content: req.body.content,
      author: req.user._id
    })

    await _comment.save();

    // 데이터 가공
    const user = await User.findById(_comment.author);

    const comment = {
      id: _comment._id,
      content: _comment.content,
      author: {
        username: user.username,
        image: user.image
      },
      created: _comment.created,
    }

    res.json({ comment });

  } catch (error) {
    next(error)
  }
}