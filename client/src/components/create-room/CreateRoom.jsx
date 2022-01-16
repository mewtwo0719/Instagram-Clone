import './createRoom.css'
import {useEffect, useState} from 'react'
import Axios from 'axios'

export default function CreateRoom({setShowCreateRoomWindow, user}) {
    Axios.defaults.withCredentials = true;

    const [allUsers, setAllUsers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([user._id])

    useEffect(() => {
        
        Axios.get(`http://localhost:3001/api/users/allusers`)
        .then((response) => {
            setAllUsers(response.data);
        })
    }, []);

    const createNewRoomHandler = () => {
        var secondUser = allUsers.find(function(e) {
            return e._id == selectedMembers[1];
          });

          console.log(secondUser)

        var groupChatName = "";
        for(let i = 1; i < selectedMembers.length; i++){
            var usr = allUsers.find(function(e) {
                return e._id == selectedMembers[i];
              });
            groupChatName += usr.username + ", "
        }
         
          
        Axios.post('http://localhost:3001/api/conversations', {
            members: selectedMembers,
            conversationImage:  selectedMembers.length == 2 ? "auto" : "/group_avatar.png",
            name:  selectedMembers.length == 2 ? "auto" : groupChatName,

        }).then(()=>{  window.location.reload();})

      
    }


    return (
        <div className='create-room'>
            <div className="create-room-wrapper">
                <div className="create-room-top">
                <svg onClick={()=>{setShowCreateRoomWindow(false)}} aria-label="Close" class="_8-yf5 " color="#262626" fill="#262626" height="18" role="img" viewBox="0 0 24 24" width="18"><polyline fill="none" points="20.643 3.357 12 12 3.353 20.647" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"></polyline><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" x1="20.649" x2="3.354" y1="20.649" y2="3.354"></line></svg>
                <h4>New Message</h4>
                <p 
                onClick={createNewRoomHandler}
                
                className='post-comment'>Next</p>
                </div>
                <div className="create-room-center">
                    <h4 htmlFor="">To: </h4>
                    <input className='add-people-to-room' type="text" name="" placeholder='Search...' id="" />
                </div>
                <div className="create-room-bottom">
                <h4>Suggested</h4>

                {
                         allUsers.map((u) => (
                            <label for={u._id} className="suggested-chat">
                 
                            <div onClick={()=>{
                                           // setActiveRoom(c)
                                        }} 
                                        
                                       
                                        className= "chat-room" 
                                         key={u._id}
                                        >                               
                                        <div className="chat-room-icon">
                                            <img src={process.env.REACT_APP_PULIC_FOLDER + u.profilePicture} alt="" />
                                        </div>
                                        <div className="chat-room-info">
                                            <div className="chat-room-name">{u.username}</div>
                                            <div className="chat-room-status">Active now</div>
                                        </div>                      
                            </div>
                            <input id={u._id} className='hidden-check' type="checkbox" name="" onChange={
                                (e) => {
                                    if(e.target.checked){
                                        setSelectedMembers([...selectedMembers, u._id])
                                    }else{
                                        setSelectedMembers(selectedMembers.filter(item => item != u._id))
                                    }
                                
                                }
                            } />
                            <div className="add-user-checkbox">
                            <svg aria-label="Toggle selection" class="_8-yf5 " color="#0095f6" fill="#0095f6" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M12.001.504a11.5 11.5 0 1011.5 11.5 11.513 11.513 0 00-11.5-11.5zm5.706 9.21l-6.5 6.495a1 1 0 01-1.414-.001l-3.5-3.503a1 1 0 111.414-1.414l2.794 2.796L16.293 8.3a1 1 0 011.414 1.415z"></path></svg>
                            </div>
                            </label>
                        ))

                    }

            </div>
        </div>
        </div>
    )
}
