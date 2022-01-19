import logo from './logo.svg';
import './App.css';
import {useState, useEffect} from 'react'
import Axios from 'axios'

import { render } from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Feed from './components/feed/Feed'
import Messenger from './components/messenger/Messenger'
import Register from './components/register/Register'
import Login from './components/login/Login'
import Profile from './components/profile/Profile'
import CreatePost from './components/create-post/CreatePost'




function App() {

  const [user, setUser] = useState(
{    username: "",
    followers: [],
    following: [],
    profilePicture: "/default_avatar.jpg"}
  )

  const [logged, setLogged] = useState(false)
  const [peekUser, setPeekUser] = useState(
    {    username: "user",
    followers: [],
    following: [],
    profilePicture: "/default_avatar.jpg"}
  )
  const [createPostWindow ,setCreatePostWindow] = useState(false)

  const peekUserHandler = (usrnm) => {
    console.log(usrnm.target.innerText)
    Axios.get(`http://localhost:3001/api/users?user=${usrnm.target.innerText}`).then((res) => {
      setPeekUser(res.data);
      console.log(res)
    })
  }
  
  
  useEffect(() => {
    Axios.get('http://localhost:3001/api/auth/session').then((response) => {
      if(response.data.logged){
        setUser(response.data.user)
      }
    })
  }, [])

//user, setCreatePostWindow, setPeekUser, peekUserHandler
//setCreatePostWindow, user


  return (
    <div className="App">
      <>
      { createPostWindow && <CreatePost user={user} setCreatePostWindow={setCreatePostWindow} />}
      <BrowserRouter>
    <Routes>
      <Route path="/" element={ (user.username != "") ? <Feed user={user} setCreatePostWindow={setCreatePostWindow} setPeekUser={setPeekUser} peekUserHandler={peekUserHandler} />  : <Login setUser={setUser}/>} />
      <Route path="register" element={!(user.username != "")? <Register setUser={setUser}/> : <Feed user={user} setCreatePostWindow={setCreatePostWindow} setPeekUser={setPeekUser} peekUserHandler={peekUserHandler} />} />
      <Route path="login" element={!(user.username != "") ? <Login setUser={setUser}/> : <Feed user={user} setCreatePostWindow={setCreatePostWindow} setPeekUser={setPeekUser} peekUserHandler={peekUserHandler} />} />
      <Route path="messenger" element={ (user.username != "") ? <Messenger setCreatePostWindow={setCreatePostWindow} user={user}/> : <Login setUser={setUser}/>} />
      <Route path="profile" element={ (user.username != "") ? <Profile user={user} setUser={setUser} setCreatePostWindow={setCreatePostWindow} />  : <Login setUser={setUser}/>} />
      <Route path="user" element={ (user.username != "") ? <Profile user={peekUser} setUser={setUser} setCreatePostWindow={setCreatePostWindow} />  : <Login setUser={setUser}/>} />
    </Routes>
  </BrowserRouter>
    
  </>
    </div>
  );
}

export default App;
