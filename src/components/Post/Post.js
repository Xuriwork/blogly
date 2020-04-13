import React, { useState, useEffect } from 'react';
import { compose } from 'redux';
import { useSelector, connect } from 'react-redux';
import { useFirestore, firestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import { Redirect, Link } from 'react-router-dom';

import IronImage from 'react-image-lazy-load-component';
import Loading from '../../utils/Loading';
import PostImagePlaceholderLightMode from '../../assets/images/LazyLoadPlaceholderLightMode.png';
import PostImagePlaceholderDarkMode from '../../assets/images/LazyLoadPlaceholderDarkMode.png';
import { PostMoreActionsModal } from './PostMoreActionsModal';

const Post = (props) => {
  
  const { auth, post } = props;

  const [authorInfo, setAuthorInfo] = useState(null);
  const [numberOfComments, setNumberOfComments] = useState(0);
  const [loading, setLoading] = useState(true);
  const firestore = useFirestore();

  const currentPost = useSelector(({ firestore: { ordered } }) => ordered.posts);

  useEffect(() => {
    if (post) {

      const listener = firestore
      .collection('posts')
      .doc(post.slug)
      .collection('comments')
      .onSnapshot((snapshot) => {
        let _comments = [];
        snapshot.forEach(commentSnapshot => {
          _comments.push(commentSnapshot.data());
        });
        setNumberOfComments(_comments.length);
      }, (error) => {
          console.log(error);
      });

      post
      .authorRef
      .get()
      .then(snapshot => {
        setAuthorInfo(snapshot.data());
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
      })

      return () => listener();
    }
  }, [post, firestore])

  const PostImagePlaceholder = () => {
    const theme = localStorage.getItem('theme');

      switch (theme) {
        case 'dark-mode' : 
          return PostImagePlaceholderDarkMode;
        case 'light-mode' : 
          return PostImagePlaceholderLightMode;
        default : 
          return PostImagePlaceholderDarkMode;
      }
  };

  if (!isLoaded(currentPost)) {
    return <Loading />
  };
  
  if (isEmpty(post)) {
    return <Redirect to='/404' />;
  };

  if (loading) {
    return <Loading />
  };

  return (
    <div className='main'>
      <section>
        <div className='post-component'>
          <div>
            <IronImage 
              src={post.coverImageURL} 
              alt={post.coverImageAlt} 
              placeholder={PostImagePlaceholder()} 
            />
          </div>
          <div className='post-content'>
            <h1>{post.title}</h1>
            <div className='author-post-details'>
               <img 
                  src={authorInfo.userImageURL} 
                  alt='Profile' 
                  className='profile-picture'
                />
                <span className='usertag-span'>{authorInfo.username}</span>
                {
                  auth.uid === post.authorId ?
                  null : (<button>Follow</button>)
                }
                <PostMoreActionsModal />
            </div>
            <em>{post.datePretty}</em>
            <p>{post.body}</p>
          </div>
        </div>
        <hr />
        <Link 
          to={`/p/${post.slug}/comments`} 
          className='long-container long-container-post' 
        >
          See comments ({numberOfComments})
        </Link>
      </section>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  const slug = ownProps.match.params.slug;
  const posts = state.firestore.data.posts;
  const post = posts ? posts[slug] : null;
  
  return {
    auth: state.firebase.auth,
    post: post,
  }
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect((props) => [
    {collection: 'posts', doc: props.slug}
  ])
)(Post);