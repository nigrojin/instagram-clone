const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = passport.authenticate('jwt', { session: false });
const jwtStrategy = require('../auth/jwtStrategy');
const userController = require('../controllers/userController');
const articleController = require('../controllers/articleController');
const commentController = require('../controllers/commentController');
const profileController = require('../controllers/profileController');

passport.use(jwtStrategy);

// INDEX 
router.get('/', (req, res, next) => {
  res.json({ message: 'API Server - INDEX PAGE' })
});

/* 

  * HTTP Request Method *
  
  1 GET - Read data
  2 POST - Create data
  3 PUT - Update data
  4 DELETE - Delete data

*/

/* USERS */
router.post('/users', userController.register);
router.get('/users', userController.users);
router.post('/user/login', userController.login);
router.put('/user', auth, userController.edit);

/* ARTICLES */
router.get('/articles', auth, articleController.articles);
router.get('/articles/:id', auth, articleController.article);
router.post('/articles', auth, articleController.create);
router.delete('/articles/:id', auth, articleController.delete);
router.get('/feed', auth, articleController.feed);
router.post('/articles/:id/favorite', auth, articleController.favorite);
router.delete('/articles/:id/favorite', auth, articleController.unfavorite);

/* COMMENTS */
router.get('/articles/:id/comments', auth, commentController.comments);
router.post('/articles/:id/comments', auth, commentController.create);
router.delete('/comments/:id', auth, commentController.delete);

/* PROFILES */
router.get('/profiles/:username', auth, profileController.details);
router.post('/profiles/:username/follow', auth, profileController.follow);
router.delete('/profiles/:username/follow', auth, profileController.unfollow);

module.exports = router;
