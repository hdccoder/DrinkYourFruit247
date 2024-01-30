import React, { useState } from 'react';

const Login = ({ login })=> {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const _login = async(ev)=> {
    ev.preventDefault();
    try {
      await login({ username, password });
    }
    catch(ex){
      alert("bad credentials")
      console.log(ex.response.data);
    }
  }
  
  return (
    <div>
      <h3>Login</h3>
      <form onSubmit={ _login }>
      <input
        placeholder='username'
        value={ username }
        onChange={ ev => setUsername(ev.target.value)}
      />
      <input
        type='password'
        placeholder='password'
        value={ password }
        onChange={ ev => setPassword(ev.target.value)}
      />
      <button disabled={!username || !password}>Login</button>
    </form>

      <a href={`https://github.com/login/oauth/authorize?client_id=${window.GITHUB_CLIENT}`}> Login with Github </a>
    </div>
  );
}

export default Login;
