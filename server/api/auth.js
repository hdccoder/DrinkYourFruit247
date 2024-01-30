const {
  authenticate,
  authenticateGitHub,
  createUser,
  findUserByToken
} = require('../db');

const express = require('express');
const app = express.Router();
const { isLoggedIn } = require('./middleware');


app.post('/login', async(req, res, next)=> {
  try {
    const token = await authenticate(req.body);
    res.send({ token });
  }
  catch(ex){
    next(ex);
  }
});

app.post('/register', async(req, res, next) => {
  try {
    const response = await createUser({...req.body, is_admin: false})
    res.send(response)
  } catch (error) {
    next(error)
  }
})

app.get('/github', async (req, res, next)=> {
  try {
    const token = await authenticateGitHub(req.query.code);
    res.send(`
      <html>
        <head>
          <script>
            window.localStorage.setItem('token', '${token}')
            window.location = '/'
          </script>
        </head>
      </html>
    `)
  } 
  catch(ex){
    next(ex);
  }
});


app.get('/me', isLoggedIn, (req, res, next)=> {
  try {
    res.send(req.user);
  } 
  catch(ex){
    next(ex);
  }
});

module.exports = app;
