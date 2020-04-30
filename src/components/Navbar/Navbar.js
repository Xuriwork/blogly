import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { signOut } from '../../store/actions/userActions';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import BellIcon from './BellIcon';
import Message from '../../assets/images/messagingicon.svg';
import BloglyIcon from '../../assets/images/BloglyIcon.svg';
import HamburgerMenu from 'react-hamburger-menu';
import CheeseburgerMenu from 'cheeseburger-menu';
import { DarkLightModeContext } from '../../utils/DarkLightModeContext';

dayjs.extend(relativeTime);

export const Navbar = React.memo((props) => {
  const { auth, notifications } = props;
  const [mobileMenu, setMobileMenu] = useState(false);
  const handleToggleTheme = useContext(DarkLightModeContext);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    const slider = document.getElementById('slider');
    const mobileSlider = document.getElementById('mobile-slider');

    if (theme === 'dark-mode') {
      if (slider) {
        slider.checked = true;
      }
      if (mobileSlider) {
        mobileSlider.checked = true;
      }
    }

    document.addEventListener(
      'click',
      (event) => {
        if (event.target.matches('#mobile-link')) {
          setMobileMenu(false);
          return;
        }

        return () => document.removeEventListener('click', event);
      },
      false
    );
  });

  const signOut = () => {
    props.signOut();
    setMobileMenu(false);
  };

  const closeMenu = () => {
    setMobileMenu(false);
  };

  const toggleMobile = () => {
    setMobileMenu(!mobileMenu);
  };

  return (
    <nav>
      <div className='mobile-nav'>
        <Link to='/' aria-label='home'>
          <img className='site-logo' src={BloglyIcon} alt='Blogly Icon' />
        </Link>
        <HamburgerMenu
          isOpen={mobileMenu}
          menuClicked={toggleMobile}
          width={25}
          height={16}
          strokeWidth={2}
          rotate={0}
          color='var(--bg)'
          borderRadius={0}
          animationDuration={0.2}
        />
      </div>
      <Link to='/' aria-label='home'>
        <img className='site-logo desktop' src={BloglyIcon} alt='Blogly Icon' />
      </Link>
      <div className='right-nav-bar desktop'>
        {auth.isEmpty ? (
          <React.Fragment>
            <Link to='/sign-in'>
              <button>Sign In</button>
            </Link>
            <Link to='/sign-up' className='sign-up'>
              <span>Sign Up</span>
            </Link>
            <label htmlFor='slider' className='switch' style={{ marginLeft: 20 }}>
              <input type='checkbox' id='slider' aria-label='slider' onChange={handleToggleTheme} />
              <span className='slider round'></span>
            </label>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Link to='/create-post'>
              <button>Create post</button>
            </Link>
            <img
              src={Message}
              alt='Message Icon'
              style={{ marginRight: '30px' }}
            />
            <div className='dropdown'>
              <span>
                <BellIcon
                  width={30}
                  numberOfNotifications={notifications?.length}
                />
              </span>
              <div
                className='dropdown-content'
                style={{ width: '220px', fontSize: '0.7em' }}>
                {notifications?.map((notification) => (
                  <span key={notification.id} className='dropdown-items'>
                    {notification.author} {notification.content}
                    <br />
                    <span className='key-info'>
                      {dayjs(notification.timestamp.toDate()).fromNow()}
                    </span>
                  </span>
                ))}
              </div>
            </div>
            <div className='dropdown'>
              <img
                src={auth.photoURL}
                alt='Profile'
                className='profile-picture'
              />
                <div className='dropdown-content'>
                  <Link to='/profile' className='dropdown-items key-info'>
                    {'@' + auth.displayName}
                  </Link>
                  <span className='dropdown-items'>
                    <label htmlFor='slider' className='switch' style={{ marginLeft: -5 }}>
                      <input
                        type='checkbox' 
                        id='slider' 
                        aria-label='slider'
                        onChange={handleToggleTheme}
                      />
                      <span className='slider round'></span>
                    </label>
                  </span>
                  <Link to='/profile' className='dropdown-items'>
                    Profile
                  </Link>
                  <Link to='/blogmarks' className='dropdown-items'>
                    Blogmarks
                  </Link>
                  <Link to='/settings' className='dropdown-items'>
                    Settings
                  </Link>
                  <span
                    className='dropdown-items sign-out-link'
                    onClick={signOut}>
                    Sign Out
                  </span>
                </div>
            </div>
          </React.Fragment>
        )}
      </div>
      <CheeseburgerMenu isOpen={mobileMenu} closeCallback={closeMenu}>
        <div className='mobile-overlay-content'>
          {auth.isEmpty ? (
            <React.Fragment>
              <label htmlFor='mobile-slider' className='switch' style={{ marginBottom: 10 }}>
                <input
                  type='checkbox'
                  id='mobile-slider' 
                  aria-label='mobile-slider'
                  onChange={handleToggleTheme}
                />
                <span className='slider round'></span>
              </label>
              <Link to='/sign-in' id='mobile-link'>
                Sign In
              </Link>
              <Link to='/sign-up' id='mobile-link'>
                Sign Up
              </Link>
            </React.Fragment>
          ) : (
            <>
              <img
                src={auth.photoURL}
                alt='Profile'
                className='profile-picture'
                style={{ width: '80px' }}
              />
              <Link to='/profile' style={{ color: '#4e85eb' }} id='mobile-link'>
                {'@' + auth.displayName}
              </Link>
              <Link to='/profile' id='mobile-link'>
                Profile
              </Link>
              <Link to='/create-post' id='mobile-link'>
                Create post
              </Link>
              <Link to='/blogmarks' id='mobile-link'>
                Blogmarks
              </Link>
              <Link to='/settings' id='mobile-link'>
                Settings
              </Link>
              <span
                className='sign-out-link'
                id='mobile-link'
                onClick={signOut}>
                Sign Out
              </span>
            </>
          )}
        </div>
      </CheeseburgerMenu>
    </nav>
  );
});

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    user: state.userReducer,
    notifications: state.userReducer.notifications,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOut()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
