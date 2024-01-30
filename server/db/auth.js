const client = require('./client');
const { v4 } = require('uuid');
const uuidv4 = v4;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios')

const findUserByToken = async(token) => {
  try {
    const payload = await jwt.verify(token, process.env.JWT);
    const SQL = `
      SELECT id, username, is_admin
      FROM users
      WHERE id = $1
    `;
    const response = await client.query(SQL, [payload.id]);
    if(!response.rows.length){
      const error = Error('bad credentials');
      error.status = 401;
      throw error;
    }

    return response.rows[0];
  }
  catch(ex){
    console.log(ex);
    const error = Error('bad credentials');
    error.status = 401;
    throw error;
  }
}

const authenticateGitHub = async(code)=> {
  let response = await axios.post('https://github.com/login/oauth/access_token', {
    client_id: process.env.GITHUB_CLIENT,
    code,
    client_secret: process.env.GITHUB_SECRET
    }, {
      headers: {
      accept: 'application/json'
    }
  })

  response = await axios.get('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${response.data.access_token}`
    }
  })

  const login = response.data.login
  let SQL = `
    SELECT id
    FROM users
    WHERE username = $1
  `
  response = await client.query(SQL, [login])
  if(!response.rows.length){
    SQL = `
      INSERT INTO users (id, username, is_Oauth)
      VALUES($1, $2, $3)
      RETURNING *
    `
    response = await client.query(SQL, [uuidv4(), login, true])
  }

  return jwt.sign({ id: response.rows[0].id }, process.env.JWT);
};

const authenticate = async (credentials) => {
  const SQL = `
    SELECT id, password
    FROM users
    WHERE username = $1
  `;
  const response = await client.query(SQL, [credentials.username]);
  if(!response.rows.length){
    const error = Error('bad credentials');
    error.status = 401;
    throw error;
  }
  const valid = await bcrypt.compare(credentials.password, response.rows[0].password);
  if(!valid){
    const error = Error('bad credentials');
    error.status = 401;
    throw error;
  }

  return jwt.sign({ id: response.rows[0].id }, process.env.JWT);

}

const createUser = async(user)=> {
  if(!user.username.trim() || !user.password.trim()){
    throw Error('must have username and password');
  }
  user.password = await bcrypt.hash(user.password, 5);
  const SQL = `
    INSERT INTO users (id, username, password, is_admin) VALUES($1, $2, $3, $4) RETURNING *
  `;
  const response = await client.query(SQL, [ uuidv4(), user.username, user.password, user.is_admin ]);
  return response.rows[0];
};

module.exports = {
  createUser,
  authenticate,
  authenticateGitHub,
  findUserByToken
};
