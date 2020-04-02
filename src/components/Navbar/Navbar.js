import React, { useState, useEffect, useContext } from 'react';
import { connect, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useFirestoreConnect } from 'react-redux-firebase';
import { signOut } from '../../store/actions/authAction';
import moment from 'moment';

import BellIcon from './BellIcon';
import Message from '../../assets/images/messagingicon.svg';
import ProfilePlaceHolder from '../../assets/images/user.svg';
import BloglyIcon from '../../assets/images/BloglyIcon.svg';
import HamburgerMenu from 'react-hamburger-menu';
import CheeseburgerMenu from 'cheeseburger-menu';
import { DarkLightModeContext } from '../../helpers/DarkLightModeContext';

const Navbar = (props) => {
  const [menu, setMenu] = useState(false);
  const handleToggleTheme = useContext(DarkLightModeContext);


  useEffect(() => {
    document.addEventListener('click', (event) => {

    if (event.target.matches('#mobile-link')) {
      setMenu(false);
      return;
    }

    return () => document.removeEventListener('click', event);
    }, false);
  });

  useFirestoreConnect([
    { collection: 'notifications', limit: 3, orderBy: ['timestamp', 'desc'] }
  ]);

  const auth = useSelector(state => state.firebase.auth);
  const profile = useSelector(state => state.firebase.profile);
  const notifications = useSelector(state => state.firestore.ordered.notifications);

  const signOut = () => {
    props.signOut();
    setMenu(false);
  };

  const openMenu = () => {
    setMenu(true)
  };

  const closeMenu = () => {
    setMenu(false)
  };

  return (
    <nav>
      <div className='mobile-nav'>
        <Link to='/'>
          <img className='site-logo' src={BloglyIcon} alt='Blogly Icon' />
        </Link>
        <HamburgerMenu
          isOpen={menu}
          menuClicked={openMenu}
          width={25}
          height={16}
          strokeWidth={2}
          rotate={0}
          color='var(--bg)'
          borderRadius={0}
          animationDuration={0.2}
        />
      </div>
      <Link to='/'>
        <img className='site-logo desktop' src={BloglyIcon} alt='Blogly Icon' />
      </Link>
      <div className='right-nav-bar desktop'>
          { 
            auth.isEmpty ? ( 
              <React.Fragment>
                <Link to='/sign-in'><button>Sign In</button></Link>
                <Link to='/sign-up' className='sign-up'><span>Sign Up</span></Link>
                <label id='switch' style={{ marginLeft: 20 }}>
                    <input type='checkbox' onChange={handleToggleTheme} id='slider' />
                    <span className='slider round'></span>
                </label>
              </React.Fragment>
             ) 
              : 
            <React.Fragment>
              <Link to='/create-post'><button>Create post</button></Link>
              <img src={Message} alt='Message Icon' style={{ marginRight: '30px' }} /> 
              <div className='dropdown'>
                <span>
                  <BellIcon 
                    width={30} 
                    numberOfNotifications={notifications?.length} 
                  />
                </span>
                <div className='dropdown-content' style={{ width: '220px', fontSize: '0.7em' }}>
                  {notifications?.map((notification) =>
                  <span key={notification.id} className='dropdown-items'>
                    {notification.author} {' '} {notification.content}<br/>
                    <span className='key-info'>{moment(notification.timestamp.toDate()).fromNow()}</span>
                  </span>
                  )}
                </div>
              </div>
              <div className='dropdown'>
                <img 
                  src={profile.profilePictureURL ?? ProfilePlaceHolder} 
                  alt='Profile' 
                  className='profile-picture'
                />
                <div className='dropdown-content'>
                  <Link to='/profile' className='dropdown-items key-info'>{'@'+auth.displayName}</Link>
                  <span className='dropdown-items'>
                    <label id='switch' style={{ marginLeft: -5 }}>
                      <input type='checkbox' onChange={handleToggleTheme} id='slider' />
                      <span className='slider round'></span>
                    </label>
                  </span>
                  <Link to='/profile' className='dropdown-items'>Profile</Link>
                  <Link to='/blogmarks' className='dropdown-items'>Blogmarks</Link>
                  <Link to='/settings' className='dropdown-items'>Settings</Link>
                  <span className='dropdown-items sign-out-link' onClick={signOut}>Sign Out</span>
                </div>
              </div>
            </React.Fragment>
          }
      </div>
      <CheeseburgerMenu 
        isOpen={menu}
        closeCallback={closeMenu} 
      >
        <div className='overlay-content'>
          { 
            auth.isEmpty ? 
              ( 
                <React.Fragment>
                  <label id='switch' style={{ marginBottom: '10px' }}>
                    <input type='checkbox' onChange={handleToggleTheme} id='mobile-slider' />
                    <span className='slider round'></span>
                  </label>
                  <Link to='/sign-in' id='mobile-link'>Sign In</Link>
                  <Link to='/sign-up' id='mobile-link'>Sign Up</Link>
                </React.Fragment> 
              ) : 
            <> 
              <img 
                src={profile.profilePictureURL ?? ProfilePlaceHolder} 
                alt='Profile' 
                className='profile-picture' 
                style={{ width: '80px' }}
              />
              <Link to='/profile' style={{ color: '#4e85eb' }} id='mobile-link'>{'@'+auth.displayName}</Link>
              <Link to='/profile' id='mobile-link'>Profile</Link>
              <Link to='/create-post' id='mobile-link'>Create post</Link>
              <Link to='/blogmarks' id='mobile-link'>Blogmarks</Link>
              <Link to='/settings' id='mobile-link'>Settings</Link>
              <span className='sign-out-link' id='mobile-link'>Sign Out</span>
            </>
          }
        </div>
      </CheeseburgerMenu>
    </nav>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOut())
  }
} 

export default connect(null, mapDispatchToProps)(Navbar);


