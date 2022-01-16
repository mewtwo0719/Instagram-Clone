import './profile.css'
import { MoreHoriz, Favorite, ChatBubble} from "@material-ui/icons";
import {useEffect, useState} from "react"
import Axios from 'axios';

import Navbar from '../navbar/Navbar'
import PostExpanded from '../post/PostExpanded'


export default function Profile({user, setUser, setCreatePostWindow}) {

    const [userProfile, setUserProfile] = useState({
        username: "user",
        followers: [],
        following: [],
        profilePicture: "/default_avatar.jpg"
    })

    const [currentUser, setCurrentUser] = useState({
        username: "user",
        followers: [],
        following: [],
        profilePicture: "/default_avatar.jpg"
    })

    const [posts, setPosts] = useState([]);
    const [uploadNewAvatar, setUploadNewAvatar] = useState(false)
    const [expandPost, setExpandPost] = useState(false);

    Axios.defaults.withCredentials = true;

    const [file, setFile] = useState(null);
    const [caption, setCaption] = useState("")

    const submitHandler = async (e) => {
        e.preventDefault();
        const newPost = {
            userId: user._id,
            desc: caption
        }
        if(file){
            const data = new FormData();
            const fileName = Date.now() + file.name;
            data.append('name', fileName);
            data.append('file', file);
               
            newPost.img = fileName;


            try{
                await Axios.post('http://localhost:3001/api/upload', data)
                
            }catch(err){}

            try{
             
                await Axios.put('http://localhost:3001/api/users/changeavatar', {fileName : fileName})
              
                window.location.reload()
            }catch(err){}

        }
    }

  

    useEffect(() => {
        if(!user){
            console.log("There is no user so I am running")
            Axios.get('http://localhost:3001/api/auth/session').then((response) => {
                setUser(response.data.user);
                setUserProfile(response.data.user);
                Axios.get(`http://localhost:3001/api/posts/profile/${response.data.user.username}`)
                .then((response) => {
                    console.log("This is the data I get from this user")
                    console.log(response.data)
                    setPosts(
                    response.data.sort((p1, p2) => {
                        return new Date(p2.createdAt) - new Date(p1.createdAt);
                      })
                );}
                )
              })
              
        } else {
            console.log("There is a user but something is wrong")
        Axios.get(`http://localhost:3001/api/users?user=${user.username}`)
        .then((response) => {   
            
            Axios.get('http://localhost:3001/api/auth/session').then((res) => {
                setCurrentUser(res.data.user);})



           if(response.data.username) setUserProfile(response.data);
            console.log(response.data)
            if(response.data.username){Axios.get(`http://localhost:3001/api/posts/profile/${user.username}`)
            .then((response2) => {setPosts(
                response2.data.sort((p1, p2) => {
                    return new Date(p2.createdAt) - new Date(p1.createdAt);
                  })
            );})}
        })}

       
      }, [user])



    return (
        <><Navbar setCreatePostWindow={setCreatePostWindow} user={currentUser} />
         {uploadNewAvatar && (
               <div className="upload-avatar">
                <div className="upload-avatar-wrapper"> 
                <h4>Change Profile Photo</h4> 
                <hr/>          
              {!file && <label className='upload-btn' htmlFor='new-post'>Upload Photo</label>}
              {file && <p className='upload-btn' onClick={submitHandler}>Save and Finish</p>}
                  <input
                style={{ display:'none' }}
                type="file"
                id="new-post"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => {setFile(e.target.files[0])}}
              /> <hr/> 
              <p className="upload-btn rm-btn">Remove Current Photo</p>
               <hr/>
               <p onClick={() => {
                setUploadNewAvatar(false)
            }} className="upload-btn cn-btn">Cancel</p>
            
               </div>  </div>)}


        <div className='profile'>
            <div className="profile-info">
                <div
                onClick={() => {
                    setUploadNewAvatar(true)
                }}
                
                className="profile-picture">
                    <img src={process.env.REACT_APP_PULIC_FOLDER + userProfile.profilePicture} alt="" className="profile-icon" />
                </div>
                <div className="profile-summary">
                    <div className="profile-summary-top">
                        <h2 className="profile-username">{userProfile.username}</h2>
                        {
                            
                        currentUser._id == userProfile._id ? <><button className="btn">Edit Profile</button></>  
                        :  <><button className="btn message">Message</button>
                        <button className="btn follow">{
                            currentUser.following.includes(userProfile._id) ? "Following" : "Follow"
                        }</button></>}
                        <MoreHoriz className='more-btn' />
                    </div>
                    <div className="profile-summary-center">
                       <p><span>{posts.length}</span>posts</p>
                       <p><span>{userProfile.followers.length}</span>followers</p>
                       <p><span>{userProfile.following.length}</span>following</p>
                    </div>
                    <div className="profile-summary-bottom">
                        {/* <p className="common-followers">
                            Followed by <span>john_1919</span>, <span>john_1919</span>,<span>john_1919</span> + 10 more
                        </p> */}
                    </div>
                    
                </div>
                
                </div>{/**PROFILE INFO */}
                <div className="profile-posts">


                    {

                        posts.map((p) => (
                            
                            <div className="post-item">
                {/* { expandPost && <PostExpanded 
                    liked={liked} 
                    setLiked = {setLiked} 
                    setExpandPost={setExpandPost} 
                    user={user} 
                    post={post}
                    likesNumber={likesNumber}
                    setLikesNumber={setLikesNumber}
                    likeDislikeHandler = {likeDislikeHandler}
                    userProfile={userProfile}
                    timeOfPosting={timeOfPosting}
                    addComment={addComment}
                    setAddComment={setAddComment}
                    addCommentHandler={addCommentHandler}
                    comments={comments}
                    peekUserHandler={peekUserHandler}
                    />} */}
                    <div className="post-hover">
                            <div className="stats"><Favorite/> <span className="post-likes">{p.likes.length}</span></div>
                            <div className="stats"><ChatBubble/> <span className="post-likes">{p.comments.length}</span></div>
                        </div>
                        <img src={process.env.REACT_APP_PULIC_FOLDER +"/"+ p.img} alt="" className="post-img" />
                        
                    </div>
                   
                        ))


              
                    }

                    
                  
                </div>
        </div>
        </> )
}
