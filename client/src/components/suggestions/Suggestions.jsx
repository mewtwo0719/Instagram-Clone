import './suggestions.css'
import Axios from 'axios';
import {useEffect, useState} from 'react';

import ExploreProfile from '../explore-profile/ExploreProfile';

export default function Suggestions({user, peekUserHandler}) {

    Axios.defaults.withCredentials = true;

        const followUser = (s, e)=>{

            Axios.put(`http://localhost:3001/api/users/${s._id}/follow`, {
                userId: user._id
            }).then(response => {
                e.target.innerHTML = "Followed"
                
            })         
        }
        const [suggestedUsers, setSuggestedUsers] = useState([])
    
        useEffect(() => {
            Axios.get(`http://localhost:3001/api/users/suggestions/${user._id}`)
            .then((response) => {
            setSuggestedUsers(response.data)
            })
        }, [user])

        

    return (
        <div className='suggestions'>
                <h4>Suggestions For You</h4>

                {
                         suggestedUsers.map((s) => (
                          
                <div className="suggestion">
                <ExploreProfile peekUserHandler={peekUserHandler} sgUser={s}/>
                <span
                onClick={(e) => followUser(s, e)}
                
                >Follow</span>
                </div>

                        ))

                    }

        </div>
    )
}
