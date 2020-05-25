import React from 'react';
import { Link } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { isLoaded } from 'react-redux-firebase';
import Loading from '../../../utils/Loading';
import dayjs from 'dayjs';

export const Profile = React.memo((props, ownProps) => {
  const profile = useSelector((state) => state.firebase.profile);

  if (!isLoaded(profile)) {
    return <Loading />;
  }

  return (
    <div className='profile-page-component'>
      <div className='upper-container'>
        <div className='image-container'>
          <img
            src={profile.userImageURL}
            alt='profile'
            className='profile-picture'
          />
        </div>
      </div>
      <div className='lower-container'>
        <div>
          <h3>{profile.usertag}</h3>
          <p style={{ marginBottom: '5px' }}>
            Joined on {dayjs(profile.createdAt.toDate()).format('DD-MM-YYYY')}
          </p>
          <p style={{ width: '250px' }}>{profile.bio || 'No bio info'}</p>
        </div>
        <div>
          <Link to='edit-profile'>
            <button className='lower-hierarchy-button'>Edit profile</button>
          </Link>
        </div>
      </div>
    </div>
  );
});

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
  };
};

export default connect(mapStateToProps)(Profile);
