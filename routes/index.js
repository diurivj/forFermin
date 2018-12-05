const express  = require('express');
const router   = express.Router();
const User     = require('../models/User');
const passport = require('passport');

const isLogged = (req, res, next) => {
  if (!req.app.locals.loggedUser) return res.redirect('/login');
  next();
}

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  res.send(`
    <form method="POST" action="/signup">
      <input type="text" placeholder="username" name="username" />
      <input type="email" placeholder="email" name="email" />
      <input type="password" placeholder="password" name="password" />
      <input type="submit" value="create user" />
    </form>
  `)
});

router.post('/signup', (req, res, next) => {
  User.register(req.body, req.body.password)
  .then(user => {
    res.redirect('/login');
  })
  .catch(err => {
    res.send(err);
  })
});

router.get('/login', (req, res, next) => {
   res.send(`
    <form method="POST" action="/login">
      <input type="email" placeholder="email" name="email" />
      <input type="password" placeholder="password" name="password" />
      <input type="submit" value="login" />
    </form>
  `)
});

router.post('/login', passport.authenticate('local'), (req, res, next) => {
  req.app.locals.loggedUser = req.user;
  res.redirect('/profile');
});

router.get('/profile', isLogged, (req, res, next) => {
  const { loggedUser } = req.app.locals;
  res.send(`
    <p>Welcome ${loggedUser.username}</p>
    <form method="POST" action="/profile">
      <input type="text" name="occupation" placeholder="occupation" value="${loggedUser.occupation}" />
      <input type="text" name="bio" placeholder="bio" value="${loggedUser.bio}" />
      <input type="submit" value"edit" />
    </form> 
  `)
});

router.post('/profile', (req, res, next) => {
  const { loggedUser } = req.app.locals;
  User.findByIdAndUpdate(loggedUser._id, {$set: {...req.body}}, {new: true})
  .then(user => {
    loggedUser = user
    res.send(`
    <p>Welcome ${loggedUser.username}</p>
    <form method="POST" action="/profile">
      <input type="text" name="occupation" placeholder="occupation" value="${loggedUser.occupation}" />
      <input type="text" name="bio" placeholder="bio" value="${loggedUser.bio}" />
      <input type="submit" value"edit" />
    </form> 
  `)
  })
  .catch(err => {
    res.send(err);
  })
});

module.exports = router;
