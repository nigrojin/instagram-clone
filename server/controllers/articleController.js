const User = require('../models/User');
const Follow = require('../models/Follow');
const Article = require('../models/Article');
const Favorite = require('../models/Favorite');
const Comment = require('../models/Comment');
const fileHandler = require('../utils/fileHandler');


// 게시물 가져오기
exports.articles = async (req, res, next) => {
  try {

    const where = {};
    const limit = req.query.limit || 9;
    const skip = req.query.skip || 0;

    // 특정 유저의 게시물만 가져오는 조건
    if ('username' in req.query) {
      const user = await User
        .findOne({ username: req.query.username });
      where.author = user._id;
    }

    // 게시물 갯수 구하기
    const articleCount = await Article.count(where);
    // 게시물 가져오기
    const _articles = await Article
      .find(where)
      .sort({ created: 'desc' })
      .limit(limit)
      .skip(skip)

    const articles = [];
    // 데이터 가공

    for (let _article of _articles) {

      // 좋아요 개수
      const favoriteCount = await Favorite
        .count({ article: _article._id });
      // 댓글 개수
      const commentCount = await Comment
        .count({ article: _article._id });

      const article = {
        images: _article.images,
        favoriteCount,
        commentCount,
        id: _article._id
      }

      articles.push(article);
    }

    res.json({ articles, articleCount });


  } catch (error) {
    next(error)
  }
}

// 게시물 한개 가져오기
exports.article = async (req, res, next) => {
  try {
    
    const _article = await Article.findById(req.params.id);

    // 게시물이 존재하지 않을 경우
    if (!_article) {
      const err = new Error("Article not found");
      err.status = 404;
      throw err;
    }

    // 게시물 가공
    const favorite = await Favorite
      .findOne({ user: req.user._id, article: _article._id });
    const commentCount = await Comment
      .count({ article: _article._id });
    const user = await User
      .findById(_article.author);

    const article = {
      images: _article.images,
      description: _article.description,
      displayDate: _article.displayDate,
      author: {
        username: user.username,
        image: user.image,
      },
      favoriteCount: _article.favoriteCount,
      isFavorite: !!favorite,
      commentCount,
      id: _article._id
    }

    res.json({ article });

  } catch (error) {
    next(error)
  }
}