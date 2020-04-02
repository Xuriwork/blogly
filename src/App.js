import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import './App.scss';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar/Navbar';
import Home from './components/Home';
import Post from './components/Post/Post';
import Comments from './components/Comments/Comments';
import CreatePost from './components/Post/CreatePost';
import NotFound from './components/NotFound';
import SignIn from './components/Forms/SignIn';
import SignUp from './components/Forms/SignUp';
import Profile from './components/Profile/Profile';
import EditProfile from './components/Profile/EditProfile';
import Settings from './components/Settings';

import { createBrowserHistory } from 'history';
import { UserIsAuthenticated } from './helpers/ProtectedRoutes';

const App = (props) => {

  const history = createBrowserHistory();
  toast.configure({ pauseOnHover: false });

    return (
          <>

            <Router history={history}>
            <Navbar />
              <Switch>
                <Route exact path='/' component={Home} />
                <Route path='/sign-in' component={SignIn} />
                <Route path='/sign-up' component={SignUp} />
                <Route path='/create-post' component={UserIsAuthenticated(CreatePost)} />
                <Route path='/profile' component={UserIsAuthenticated(Profile)} />
                <Route path='/edit-profile' component={UserIsAuthenticated(EditProfile)} />
                <Route path='/404' component={NotFound} />
                <Route path='/:slug/comments' component={Comments} />
                <Route path='/settings' component={UserIsAuthenticated(Settings)} />
                <Route path='/p/:slug' exact component={Post} />
                <Route path='*' exact={true} component={NotFound} />
              </Switch>
            </Router>

          </>
    );
}


  export default App;