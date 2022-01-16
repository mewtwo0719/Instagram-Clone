import './exploreProfile.css'
import Axios from 'axios';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

export default function ExploreProfile({sgUser, peekUserHandler}) {
    return (
        <div className='explore-profile'>
                <img className="profile-img" src={process.env.REACT_APP_PULIC_FOLDER + sgUser.profilePicture} alt="" />

            <div className="name-info">
            <Link className='link-non-dec' to="../user">
                    <div onClick={(e) => peekUserHandler(e, sgUser.username)} className="name">{sgUser.username}</div>           
                    </Link>
              
                <div className="info">New to Instagram</div>
            </div>
        </div>
    )
}
