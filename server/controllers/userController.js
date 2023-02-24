const User = require('../models/User');
const Follow = require('../models/Follow');
const Favorite = require('../models/Favorite');
const fileHandler = require('../utils/fileHandler');
const { check, validationResult } = require('express-validator');


// 회원가입
exports.register = [
  check('username').isLength({ min: 5 }),
  check('email').isEmail(),
  check('password').isLength({ min: 5 }),
  async (req, res, next) => {
    try {

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const err = new Error();
        err.errors = errors.array();
        err.status = 400;
        throw err;
      }

      const { email, fullName, username, password } = req.body;

      // 유저네임 중복검사
      const userByUsername = await User.findOne({ username });

      if (userByUsername) {
        const err = new Error('Username already in use');
        err.status = 400;
        throw err;
      }

      // 이메일 중복검사
      const userByEmail = await User.findOne({ email });

      if (userByEmail) {
        const err = new Error('E-mail already in use');
        err.status = 400;
        throw err;
      }

      // 유저 생성
      const user = new User();
      user.email = email;
      user.fullName = fullName;
      user.username = username;
      user.setPassword(password);
      user.image = 'default.png';

      await user.save();

      res.json({ user });

    } catch (error) {
      next(error)
    }
  }
];


// 로그인
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const _user = await User.findOne({ email });

    // 유저가 존재하지 않을 경우
    if (!_user) {
      const err = new Error('User not found');
      err.status = 401;
      throw err;
    }

    // 비밀번호가 다를 때
    if (!_user.checkPassword(password)) {
      const err = new Error('Password not match');
      err.status = 401;
      throw err;
    }

    // 토큰 발급
    const token = _user.generateJWT();

    // 유저 계정 수정
    const user = {
      username: _user.username,
      image: _user.image,
      email: _user.email,
      fullName: _user.fullName,
      bio: _user.bio,
      token
    }

    res.json({ user });

  } catch (error) {
    next(error)
  }
}

// 유저 검색
exports.users = async (req, res, next) => {
  try {

    const where = {};
    const limit = req.query.limit || 10;
    const skip = req.query.skip || 0;

    // 유저가 팔로우하는 유저들 검색
    if ('following' in req.query) {
      const user = await User.findOne({ username: req.query.following });
      const follows = await Follow.find({ follower: user._id });

      // 조건 추가
      where._id = follows.map(follow => follow.following);
    }

    // 유저의 팔로워 검색
    if ('followers' in req.query) {
      const user = await User.findOne({ username: req.query.followers });
      const follows = await Follow
        .find({ following: user._id })

      where._id = follows.map(follow => follow.follower);
    }

    // 특정 게시물을 좋아하는 유저 검색
    if ('favorite' in req.query) {
      const favorites = await Favorite.find({ article: req.query.favorite })

      where._id = favorites.map(favorite => favorite.user);
    }

    // 유저이름으로 유저 검색
    if ('username' in req.query) {
      where.username = new RegExp(req.query.username, 'i');
    }

    // 이메일로 유저 검색
    if ('email' in req.query) {
      where.email = req.query.email;
    }

    // 결과 개수
    const userCount = await User.count(where);
    const _users = await User.find(where).limit(limit).skip(skip);

    const users = [];

    for (let _user of _users) {
      const user = {}
      user.username = _user.username;
      user.fullName = _user.fullName;
      user.image = _user.image;

      users.push(user);
    }

    res.json({ users, userCount });

  } catch (error) {
    next(error)
  }
}

// 정보 수정
exports.edit = [
  fileHandler('profiles').single('image'),
  async (req, res, next) => {
    try {

      // req.user: 로그인한 유저
      const _user = await User.findById(req.user._id);

      // 유저가 파일을 업로드한 경우
      if (req.file) {
        _user.image = req.file.filename;
      }

      // 계정 업데이트
      Object.assign(_user, req.body);

      await _user.save();

      const token = _user.generateJWT();

      const user = {
        email: _user.email,
        username: _user.username,
        fullName: _user.fullName,
        image: _user.image,
        bio: _user.bio,
        token
      }

      res.json({ user });

    } catch (error) {
      next(error)
    }
  }
]