import {useState, useEfect} from "react";
import { Link } from 'react-router-dom'

import Axios from 'axios';

import './login.css'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function Login({setUser}) {

Axios.defaults.withCredentials = true;

const [username, setUsername] = useState("salko0719");
const [password, setPassword] = useState("salko123");
const [loginMsg, setLoginMsg] = useState("")

const login = () => {
    try{
    Axios.post('http://localhost:3001/api/auth/login', {
        username: username,
        password: password
    }).then((response) => {
       setUser(response.data)
    })} catch(err){console.log(err)}
}

    return (
        <div className='register login'>
            <div className="login-side-img">
                <img src="assets/login-side.png" className="login-side-ram" alt="" />
                {/* <img src="assets/login-side1.jpg" className="login-side" alt="" /> */}
            </div>
            <div className='register-wrapper'>
            <h1>Instagram</h1>
                       
            <Box className="form-inputs">

      <TextField className='register-input' id="demo-helper-text-misaligned-no-helper" 
      label="Username"
      value={username}
      onChange={(e) => {setUsername(e.target.value)}} />

      <TextField
          id="standard-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
          variant="outlined"
          className="register-input"
          value={password}
          onChange={(e) => {setPassword(e.target.value)}}
        />
        <button 
        className='register-input register-btn'
        onClick={login}
        >Log In</button>
        <p id="login-msg">{loginMsg}</p>
        <p className="forgot-password">Forgot password?</p>
    </Box>
    
    <div className="signup-link">
    Don't have an account? <Link className="link" to='../register'>Sign up</Link>
    </div>

    </div>

        </div>
    )
}
