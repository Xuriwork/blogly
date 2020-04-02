import React from 'react';
import { Link } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { isLoaded } from 'react-redux-firebase';
import Loading from '../../helpers/Loading';
import moment from 'moment';

import ProfilePlaceHolder from '../../assets/images/user.svg';

export const Profile = (props, ownProps) => {
    const profile = useSelector(state => state.firebase.profile);

    if (!isLoaded(profile)) {
        return <Loading />
    }
    
    return (
        <div className='main'>
            <div className='profile-page-component'>
                <div className='upper-container'>
                    <div className='image-container'>
                        <img 
                          src={profile.profilePictureURL ?? ProfilePlaceHolder} 
                          alt='profile' 
                          className='profile-picture'
                        />
                    </div>
                </div>
                <div className='lower-container'>
                    <div>
                        <h3>{profile.usertag}</h3> 
                        <p style={{ marginBottom: '5px' }}>Joined on {moment(profile.createdAt.toDate()).format('LL')}</p>
                        <p style={{ width: '250px' }}>{profile.bio || 'No bio info'}</p>
                    </div>
                    <div>
                        <Link to='edit-profile'><button className='lower-hierarchy-button'>Edit profile</button></Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
      auth: state.firebase.auth,
    }
} 

export default connect(mapStateToProps)(Profile);