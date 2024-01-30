import React, {useState} from "react"

const Register = ({register}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
  
    const _register = async(ev)=> {
      ev.preventDefault();
      try {
        await register({ username, password });
      }
      catch(ex){
        console.log(ex.response.data);
      }
    }

    return (
        <div>
            <h3>Register</h3>
            <form onSubmit={ _register }>
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
            <button disabled={!username || !password}>Register</button>
            </form>
        </div>
    )

}

export default Register