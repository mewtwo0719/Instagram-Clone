import './chatRooms.css';
import {useEffect, useState, useRef} from "react"
import Axios from 'axios';
import {io} from 'socket.io-client';

export default function ChatRooms({user, activeRoom, setActiveRoom, setShowCreateRoomWindow, socket}) {



    Axios.defaults.withCredentials = true;

    const [conversations, setConversations] = useState([]);
    const [chatRoomId, setChatRoomId] = useState("0");
    const [allChatMembers, setAllChatMembers] = useState([]);
    const [conversationStatus, setConversationStatus] = useState([])



    useEffect(()=> {
        if(activeRoom) setChatRoomId(activeRoom._id)

        
    },[activeRoom])

    useEffect(()=>{
        if(socket.current){ socket.current.on('receive_message', (data) => {
            console.log(data)
                for(let i = 0; i < conversations.length; i++){
                    if(conversations._id == data.room){
                        conversations[i].status = data.message; 
                        setConversations(conversations)
                    }
                }})}
    }, [conversations])

    useEffect(() => {
            Axios.get(`http://localhost:3001/api/conversations/${user._id}`)
            .then((response) => 
            {setConversations(response.data.sort((p1, p2) => {
                    return new Date(p2.updatedAt) - new Date(p1.updatedAt)}));

            //  socket.current.emit("rooms", conversations)
            //  console.log(conversations)
            })        
       
      }, [user])

      useEffect(() => {
        let chatRooms = [];

        for(let i = 0; i < conversations.length; i++){
            chatRooms.push(conversations[i]._id)
        }
        if(chatRooms.length){socket.current.emit("join_rooms", chatRooms)}

       let chatMembers = []
        for(let i = 0; i < conversations.length; i++){
            if(conversations[i].name == "auto")
            {chatMembers.push(conversations[i].members[1])
            chatMembers.push(conversations[i].members[0])
            
                if(conversations[i].members[0] != user._id){
                    Axios.get(`http://localhost:3001/api/users/query/${conversations[i].members[0]}`).then((response) => {
                        console.log(response.data)
                        conversations[i].conversationImage = response.data.profilePicture
                        conversations[i].name = response.data.username
                    })
                }

                else if(conversations[i].members[1] != user._id){
                    Axios.get(`http://localhost:3001/api/users/query/${conversations[i].members[1]}`).then((response) => {
                        conversations[i].conversationImage = response.data.profilePicture
                        conversations[i].name = response.data.username
                    })
                }



        }
        }


        if(chatMembers.length > 0){
        Axios.post(`http://localhost:3001/api/users/commenters`, {commentersIds:chatMembers})
        .then((response) => {
            setAllChatMembers(response.data);
        })}
       

      }, [conversations])

    return (
        <div className='chat-rooms'>
            <div className="chat-rooms-top">
                <div className="user">
                    <span>{user.username}</span>
                    <svg aria-label="Down Chevron Icon" class="_8-yf5 " color="#262626" fill="#262626" height="20" role="img" viewBox="0 0 24 24" width="20"><path d="M21 17.502a.997.997 0 01-.707-.293L12 8.913l-8.293 8.296a1 1 0 11-1.414-1.414l9-9.004a1.03 1.03 0 011.414 0l9 9.004A1 1 0 0121 17.502z"></path></svg>
                </div>
                <div onClick={() => {setShowCreateRoomWindow(true)}} className="new-post">
                <svg aria-label="New Message" class="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M12.202 3.203H5.25a3 3 0 00-3 3V18.75a3 3 0 003 3h12.547a3 3 0 003-3v-6.952" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path><path d="M10.002 17.226H6.774v-3.228L18.607 2.165a1.417 1.417 0 012.004 0l1.224 1.225a1.417 1.417 0 010 2.004z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="16.848" x2="20.076" y1="3.924" y2="7.153"></line></svg>
                </div>
            </div>
            <div className="chat-rooms-main">

                        {
                         conversations.map((c) => (
                           
                            <div onClick={()=>{
                                setActiveRoom(c)
                            }} 
                            
                            className= {chatRoomId === c._id ? "chat-room chat-room-active" : "chat-room"}  

                            key={c._id}>                               
                            <div className="chat-room-icon">
                             {c.conversationImage == "auto" ?
                                  <img src={process.env.REACT_APP_PULIC_FOLDER + "/default_avatar.jpg"} alt="" />:
                                  <img src={process.env.REACT_APP_PULIC_FOLDER + c.conversationImage} alt="" />
                                 }
                                 <div className="active-now"></div>
                            </div>
                            <div className="chat-room-info">
                                <div className="chat-room-name">{c.name}</div>
                                <div key={c._id + "dasdsa"} className="chat-room-status">{c.status}</div>
                            </div>
                        </div>

                        ))
                         }

            </div>
        </div>
    )
}
