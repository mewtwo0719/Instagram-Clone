import './post.css'
import { MoreHoriz} from "@material-ui/icons"
import {useState, useEffect} from "react";
import Axios from 'axios'
import PostExpanded from './PostExpanded'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

export default function Post({post, user,  setPeekUser, peekUserHandler}) {

    Axios.defaults.withCredentials = true;

    const [userProfile, setUserProfile] = useState({
        username: "user"
    })

    const [liked, setLiked] = useState(false);

    const [likesNumber, setLikesNumber] = useState(0);

    const [timeOfPosting, setTimeOfPosting] = useState('JUST NOW');

    const [addComment, setAddComment] = useState('');

    const [expandPost, setExpandPost] = useState(false);

    const [comments, setComments] = useState([]);


    const likeDislikeHandler = () => {
        Axios.put(`http://localhost:3001/api/posts/${post._id}/like`, {
            userId: user._id
        }).then((response) => {

            //setLiked(!liked)
            if(liked) {
                setLiked(false)
                setLikesNumber(likesNumber-1)}
            else {
                setLiked(true)
                setLikesNumber(likesNumber+1)}
            
        })
    }


    const addCommentHandler = () => {
       if(comments.length > 0) setComments([...comments, {value: addComment, userId: user._id}])
       else setComments([{value: addComment, userId: user._id}]);

        Axios.put(`http://localhost:3001/api/posts/${post._id}/comment`, {
            userId: user._id,
            value: addComment
        }).then((response) => {

             
        })
        setAddComment('')
    }


    useEffect(() => {

        if(post.comments.length > 0) setComments(post.comments);
       
        Axios.get(`http://localhost:3001/api/users/query/${post.userId}`)
        .then((response) => {         
            setUserProfile(response.data);
            if(post.likes.includes(user._id)) setLiked(true);
            setLikesNumber(post.likes.length);

         
            const date1 = new Date(post.createdAt);
            var time = new Date().getTime();
            var date2 = new Date(time);
            let difference = date2 - date1;
            difference /= 1000;



            if(difference < 60) setTimeOfPosting(Math.round(difference) + " SECONDS AGO")
            else {
                difference /= 60;
                if(difference < 60) setTimeOfPosting(Math.round(difference) + " MINUTES AGO")
                else{
                    difference /= 60;
                    if(difference < 24) setTimeOfPosting(Math.round(difference) + " HOURS AGO")
                    else{
                        difference /= 24;
                        if(difference < 7) setTimeOfPosting(Math.round(difference) + " DAYS AGO")
                        else{
                            difference /= 7;
                            if(difference < 4) setTimeOfPosting(Math.round(difference) + " WEEKS AGO")
                            else{
                                difference /= 4;
                                setTimeOfPosting(Math.round(difference) + " MONTHS AGO")
                            }
                        }
                    }               
                }
            }
        })
    }, [])


    return (
        <div className='post'>


         
                
                    { expandPost && <PostExpanded 
                    liked={liked} setLiked = {setLiked} 
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
                    />}
           
                    
            <div className="post-top">
                <div className="user">
                    <img className='user-img' src={process.env.REACT_APP_PULIC_FOLDER + userProfile.profilePicture} alt="" />             
                    <Link className='link-non-dec' to="../user">
                    <span onClick={(e) => peekUserHandler(e, userProfile.username)} className="user-username">{userProfile.username}</span>           
                    </Link>
                </div>
                <MoreHoriz className='post-more btn-icon' />
            </div>
            <div className="post-center">
                <img className='post-image' src={process.env.REACT_APP_PULIC_FOLDER + "/" + post.img} alt="" />
            </div>
            <div className="post-bottom">
                <div className="action-section">


                {liked ? 
                <button onClick={likeDislikeHandler} className='btn-icon'><svg aria-label="Unlike"  color="#ed4956" fill="#ed4956" height="24" role="img" viewBox="0 0 48 48" width="24"><path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg></button> 
                :
                <button onClick={likeDislikeHandler} className='btn-icon'><svg className='icon' width='24' height='24' ><path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938m0-2a6.04 6.04 0 00-4.797 2.127 6.052 6.052 0 00-4.787-2.127A6.985 6.985 0 00.5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 003.518 3.018 2 2 0 002.174 0 45.263 45.263 0 003.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 00-6.708-7.218z"></path></svg></button> 
                
                }
               <button onClick={() => {setExpandPost(true)}} className='btn-icon'><svg width='24' height='24' className='icon' ><path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22z" fill="none" stroke="currentColor" strokeWidth="2"></path></svg></button> 

               <button className='btn-icon'><svg width='24' height='24' className='icon' ><line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line><polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></polygon></svg></button>


               <button className='btn-icon'><svg width='24' height='24' className='icon' ><polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon></svg></button> 

                </div>
                <span className="likes">{ likesNumber } likes</span>
                <div className="comments-section">
                    <div className="comment">
                        
                        <p className="user-comment">
                        <span className="user">{userProfile.username}</span>
                            {post.desc}</p>
                    </div>
                   { post.comments.length > 0 && <div onClick={() => {setExpandPost(true)}} className="more-comments">View all {comments.length} comments</div>}
                </div>
                <div className="posting-time">{timeOfPosting}</div>
                <div className="add-comment-section">
                    <input onChange={(e) => {setAddComment(e.target.value)}} value={addComment} type="text" placeholder='Add a comment...' name="" id="add-comment" className="add-comment-input" />
                    
                    <button onClick={addCommentHandler} className="post-comment">Post</button>
                </div>
            </div>{/**POST BOTTOM */}
        </div>
    )
}
