import './feed.css';
import {useState, useEffect} from "react";
import Axios from "axios"

import Post from '../post/Post';
import PostExpanded from '../post/PostExpanded';
import Navbar from '../navbar/Navbar'
import Suggestions from '../suggestions/Suggestions'

export default function Feed({user, setCreatePostWindow, setPeekUser, peekUserHandler}) {


    const [posts, setPosts] = useState([]);

    useEffect(() => {

            Axios.get(`http://localhost:3001/api/posts/timeline/${user._id}`)
            .then((response) => {setPosts(
                
                response.data.sort((p1, p2) => {
                    return new Date(p2.createdAt) - new Date(p1.createdAt);
                  })

                );})
        
       
      }, [user])

    return (
        <><Navbar user={user} setCreatePostWindow={setCreatePostWindow}/>
        
        <div className='feed'>
            <div className="feed-wrapper">
                <div className="posts">
               
                    {
                         posts.map((p) => (
                           <Post peekUserHandler={peekUserHandler} setPeekUser={setPeekUser} post={p} user={user} />
                        ))

                    }
                </div>
            </div>
            <Suggestions peekUserHandler={peekUserHandler} user={user} />
        </div>


        </> )
}
