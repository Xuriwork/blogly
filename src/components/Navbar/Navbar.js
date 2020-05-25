import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import HamburgerMenu from 'react-hamburger-menu';
import CheeseburgerMenu from 'cheeseburger-menu';

import { signOut } from '../../store/actions/userActions';
import { DarkLightModeContext } from '../../context/DarkLightModeContext';

import BellIcon from './BellIcon';
import SearchComponent from './SearchComponent';

import BloglyIcon from '../../assets/images/BloglyIcon.svg';

dayjs.extend(relativeTime);

export const Navbar = React.memo(({ auth, notifications, signOut }) => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const { handleToggleTheme } = useContext(DarkLightModeContext);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    const slider = document.getElementById('slider');
    const mobileSlider = document.getElementById('mobile-slider');

    if (theme === 'dark-mode') {
      if (slider) slider.checked = true;
      if (mobileSlider) mobileSlider.checked = true;
    };

    document.addEventListener('click', (event) => {
      if (event.target.matches('#mobile-link')) setMobileMenu(false);
      return () => document.removeEventListener('click', event);
    },false);
  });

  const handleSignOut = () => {
    signOut();
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
      </div>
      <div className='hidden-desktop'>
        <div className='hamburger-menu-container'>
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
      </div>
      <Link to='/' aria-label='home'>
        <img className='site-logo desktop' src={BloglyIcon} alt='Blogly Icon' />
      </Link>
      <SearchComponent />
      <div className='right-nav-bar desktop'>
        {auth.isEmpty ? (
          <React.Fragment>
            <Link to='/sign-in' className='button'>Sign In</Link>
            <Link to='/sign-up' className='sign-up'>Sign Up</Link>
            <label
              htmlFor='slider'
              className='switch'
              style={{ marginLeft: 20 }}
            >
              <input
                type='checkbox'
                id='slider'
                aria-label='slider'
                onChange={handleToggleTheme}
              />
              <span className='slider round'></span>
            </label>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Link to='/create-post' style={{ marginRight: '30px' }}>
              <button>Create post</button>
            </Link>
            <div className='dropdown'>
              <span>
                <BellIcon
                  width={30}
                  numberOfNotifications={notifications?.length}
                />
              </span>
              <div
                className='dropdown-content'
                style={{ width: '220px', fontSize: '0.7em' }}
              >
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
                  <label
                    htmlFor='slider'
                    className='switch'
                    style={{ marginLeft: '-5px' }}
                  >
                    <input
                      type='checkbox'
                      id='slider'
                      aria-label='slider'
                      onChange={handleToggleTheme}
                    />
                    <span className='slider round'></span>
                  </label>
                </span>
                <Link to='/create-post' className='dropdown-items'>
                  Create Post
                </Link>
                <Link to='/profile' className='dropdown-items'>
                  Profile
                </Link>
                <Link to='/blogmarks' className='dropdown-items'>
                  Blogmarks
                </Link>
                <Link to='/my-posts' className='dropdown-items'>
                  My posts
                </Link>
                <Link to='/settings' className='dropdown-items'>
                  Settings
                </Link>
                <span
                  className='dropdown-items sign-out-link'
                  onClick={handleSignOut}
                >
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
              <label
                htmlFor='mobile-slider'
                className='switch'
                style={{ marginBottom: 10 }}
              >
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
                onClick={handleSignOut}
              >
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
