import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import axios from 'axios';

import Navbar from './components/Navbar/Navbar';
import HomeContainer from './components/Home/HomeContainer';
import PostContainer from './components/Post/PostContainer';
import CommentsContainer from './components/Comments/CommentsContainer';
import CreatePostContainer from './components/CreatePost/CreatePostContainer';
import NotFound from './components/NotFound';
import SignIn from './components/Forms/SignIn';
import SignUp from './components/Forms/SignUp';
import ForgotPassword from './components/Forms/ForgotPassword';
import BlogmarksContainer from './components/UserPages/Blogmarks/BlogmarksContainer';
import UserPostsContainer from './components/UserPages/UserPosts/UserPostsContainer';
import Profile from './components/UserPages/Profile/Profile';
import EditProfile from './components/UserPages/Profile/EditProfile';
import Settings from './components/Settings';

import { createBrowserHistory } from 'history';
import { UserIsAuthenticated } from './utils/ProtectedRoutes';

import 'notyf/notyf.min.css';
import './App.scss';

axios.defaults.baseURL = 'https://us-central1-blogly-xuri.cloudfunctions.net/api';

export const App = () => {
  const history = createBrowserHistory();

  return (
    <>
      <Router history={history}>
        <Navbar />
        <main>
          <Switch>
            <Route exact path='/' component={HomeContainer} />
            <Route path='/sign-in' component={SignIn} />
            <Route path='/sign-up' component={SignUp} />
            <Route path='/create-post' component={UserIsAuthenticated(CreatePostContainer)} />
            <Route path='/profile' component={UserIsAuthenticated(Profile)} />
            <Route path='/edit-profile' component={UserIsAuthenticated(EditProfile)}/>
            <Route path='/404' component={NotFound} />
            <Route path='/p/:postId/comments' component={CommentsContainer} />
            <Route path='/settings' component={UserIsAuthenticated(Settings)} />
            <Route path='/blogmarks' component={UserIsAuthenticated(BlogmarksContainer)} />
            <Route path='/my-posts' component={UserIsAuthenticated(UserPostsContainer)} />
            <Route path='/p/:postId' exact component={PostContainer} />
            <Route path='/forgot-password' component={ForgotPassword} />
            <Route path='*' exact={true} component={NotFound} />
          </Switch>
        </main>
      </Router>
    </>
  );
};

export default App;