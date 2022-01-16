import {useState, useEfect} from "react";
import Axios from 'axios';
import {Link} from 'react-router-dom';
import './register.css'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function Register({setUser}) {

Axios.defaults.withCredentials = true;

const [email, setEmail] = useState("")
const [fullName, setFullName] = useState("")
const [username, setUsername] = useState("")
const [password, setPassword] = useState("")

const register = () => {
    Axios.post('http://localhost:3001/api/auth/register', {
        email: email,
        fullName: fullName,
        username: username,
        password: password
    }).then((response) => {
        console.log(response)
        setUser(response.data)
    })
}

    return (
        <div className='register'>
            <div className='register-wrapper'>
            <h1>Instagram</h1>
            <p>Sign up to see photos and videos from your friends.</p>
           
            <Box className="form-inputs">
      <TextField 
      className='register-input' id="demo-helper-text-misaligned-no-helper"
      label="Email"
      value={email}
      onChange={(e) => {setEmail(e.target.value)}} />

      <TextField className='register-input' id="demo-helper-text-misaligned-no-helper" 
      label="Full Name"
      value={fullName}
      onChange={(e) => {setFullName(e.target.value)}} />

      <TextField className='register-input' id="demo-helper-text-misaligned-no-helper" 
      label="Username"
      value={username}
      onChange={(e) => {setUsername(e.target.value)}} />

      <TextField
          id="standard-password-input"
          label="Password"
          type="password"
          variant="outlined"
          className="register-input"
          value={password}
          onChange={(e) => {setPassword(e.target.value)}}
        />
        <button 
        className='register-input register-btn'
        onClick={register}
        >Sign up</button>
    </Box>
    <div className="signup-link">
    Have an account? <Link className="link" to='../login'>Log in</Link>
    </div>
    </div>
        </div>
    )
}
