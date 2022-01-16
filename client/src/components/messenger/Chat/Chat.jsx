import './chat.css'
import {useEffect, useState, useRef} from "react"
import Axios from 'axios';

export default function Chat({user, activeRoom, socket}) {

    Axios.defaults.withCredentials = true;

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [newMessage, setNewMessage] = useState('')
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    
    const sendMessageHandler = () => {
        if(messages.length > 0) setMessages([...messages, {text: message, sender: user._id}])
        else setMessages([{text: message, sender: user._id}]);

        socket.current.emit("send_message", {message: message, room:activeRoom._id })
 
         Axios.post("http://localhost:3001/api/messages", {
            sender: user._id,
            text: message,
            conversationId: activeRoom._id
         }).then((response) => {
 
              
         })
         setMessage('')
     }
     useEffect(() => {
        scrollToBottom()
      }, [messages]);
    
     useEffect(() => {
      if(activeRoom) { if(newMessage.room  == activeRoom._id){
         if(messages.length > 0) setMessages([...messages, {text: newMessage.message, sender: "dadada"}])
         else setMessages([{text: newMessage.message, sender: "datata"}]);}}
     }, [newMessage])

    useEffect(() => {

       if(socket.current){ socket.current.on('receive_message', (data) => {
        setNewMessage(data)
        })}

           if(activeRoom) {Axios.get(`http://localhost:3001/api/messages/${activeRoom._id}`)
            .then((response) => 
            
            {setMessages(    
                response.data.sort((p1, p2) => {
                    return new Date(p1.createdAt) - new Date(p2.createdAt);
                  })

                );})  }  else console.log("there are no messages in: " + activeRoom)    
       
      }, [activeRoom])


    return (
        <div className='chat'>
            <div className="chat-top">


           {activeRoom && <div className="chat-room">
                    <div className="chat-room-icon">
                        <img src={process.env.REACT_APP_PULIC_FOLDER + activeRoom.conversationImage} alt="" />
                    </div>
                    <div className="chat-room-info">
                        <div className="chat-room-name">{activeRoom.name}</div>
                        <div className="chat-room-status">Active now</div>
                    </div>
                </div>}

                <svg aria-label="View Thread Details" class="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><circle cx="12.001" cy="12.005" fill="none" r="10.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle><circle cx="11.819" cy="7.709" r="1.25"></circle><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="10.569" x2="13.432" y1="16.777" y2="16.777"></line><polyline fill="none" points="10.569 11.05 12 11.05 12 16.777" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polyline></svg>

            </div>
            <div className="chat-center">
                    {
                         messages.map((m) => (
                            <div key={m._id}
                            
                           className= {m.sender == user._id ? "message users-message" : "message"}>
                                {m.text}
                        </div>
                        ))

                    }
            <div ref={messagesEndRef} />
            </div>{/**CHAT CENTER */}

            <div className="chat-bottom">
                <div className="message-input">
                <svg aria-label="Emoji" class="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M15.83 10.997a1.167 1.167 0 101.167 1.167 1.167 1.167 0 00-1.167-1.167zm-6.5 1.167a1.167 1.167 0 10-1.166 1.167 1.167 1.167 0 001.166-1.167zm5.163 3.24a3.406 3.406 0 01-4.982.007 1 1 0 10-1.557 1.256 5.397 5.397 0 008.09 0 1 1 0 00-1.55-1.263zM12 .503a11.5 11.5 0 1011.5 11.5A11.513 11.513 0 0012 .503zm0 21a9.5 9.5 0 119.5-9.5 9.51 9.51 0 01-9.5 9.5z"></path></svg>
                    <input value={message} 
                    onChange={(e)=>{setMessage(e.target.value)}}
                    placeholder='Message...' className='msg-input' type="text" name="" id="" />
                    {
                        message == '' ?
                        <><svg aria-label="Add Photo or Video" class="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M6.549 5.013A1.557 1.557 0 108.106 6.57a1.557 1.557 0 00-1.557-1.557z" fill-rule="evenodd"></path><path d="M2 18.605l3.901-3.9a.908.908 0 011.284 0l2.807 2.806a.908.908 0 001.283 0l5.534-5.534a.908.908 0 011.283 0l3.905 3.905" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></path><path d="M18.44 2.004A3.56 3.56 0 0122 5.564h0v12.873a3.56 3.56 0 01-3.56 3.56H5.568a3.56 3.56 0 01-3.56-3.56V5.563a3.56 3.56 0 013.56-3.56z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
                    <svg aria-label="Like" class="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938m0-2a6.04 6.04 0 00-4.797 2.127 6.052 6.052 0 00-4.787-2.127A6.985 6.985 0 00.5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 003.518 3.018 2 2 0 002.174 0 45.263 45.263 0 003.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 00-6.708-7.218z"></path></svg></>
                    :
                    <button onClick={sendMessageHandler}  className="post-comment">Send</button>
                    }
               </div>
            </div>

        </div>
    )
}
