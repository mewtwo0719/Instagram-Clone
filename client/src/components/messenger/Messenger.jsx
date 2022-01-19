import './messenger.css';
import {useEffect, useState, useRef} from "react"
import Axios from 'axios';

import Navbar from '../navbar/Navbar'
import ChatRooms from './ChatRooms/ChatRooms'
import Chat from './Chat/Chat'
import CreateRoom from '../create-room/CreateRoom'

import {io} from 'socket.io-client';


export default function Messenger({setCreatePostWindow, user}) {

    const [activeRoom, setActiveRoom] = useState(null)
    const [showCreateRoomWindow, setShowCreateRoomWindow] = useState(false);
    const socket = useRef();
    // const socket = useRef();

    useEffect(()=>{
        socket.current = io('ws://localhost:3002');
    }, [])


    return (
            <>
            <Navbar setCreatePostWindow={setCreatePostWindow} user={user} /> 

            {showCreateRoomWindow && <CreateRoom user={user} setShowCreateRoomWindow={setShowCreateRoomWindow}/>}
            <div className="messenger">
                <ChatRooms setShowCreateRoomWindow={setShowCreateRoomWindow}
                setActiveRoom={setActiveRoom} activeRoom={activeRoom} 
                user={user}
                socket={socket} />
                <Chat socket={socket} user={user} activeRoom={activeRoom}/>
               
            </div>
          
</>
    )
}
