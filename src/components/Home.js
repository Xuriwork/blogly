import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { useFirestore } from 'react-redux-firebase';
import Loading from '../helpers/Loading';
import IronImage from 'react-image-lazy-load-component';
import PostImagePlaceholderLightMode from '../assets/images/LazyLoadPlaceholderLightMode.png';
import PostImagePlaceholderDarkMode from '../assets/images/LazyLoadPlaceholderDarkMode.png';
import ProfilePlaceHolder from '../assets/images/user.svg';

const Home = () => {
  const firestore = useFirestore();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [authorInfo, setAuthorInfo] = useState(null);
 
  useEffect(() => {

    const listener = firestore
    .collection('posts')
    .orderBy('createdAt', 'desc')
    .onSnapshot(snapshot => {
      let _posts = [];
      snapshot.forEach(postSnapshot => {
        _posts.push(postSnapshot.data())
      });
      setPosts(_posts);

      _posts.forEach(post => {
        post
        .authorRef
        .get()
        .then(snapshot => {
          setAuthorInfo(snapshot.data());
          setLoading(false);
        })
      })
    }, (error) => {
        console.error(error);
    });

    return () => listener();

  }, [firestore])


  const PostImagePlaceholder = () => {
  const theme = localStorage.getItem('theme');

    switch (theme) {
      case 'dark-mode' : 
        return PostImagePlaceholderDarkMode;
      case 'light-mode' : 
        return PostImagePlaceholderLightMode;
      default : 
        return PostImagePlaceholderLightMode;
    }
  }

  if (loading) {
    return <Loading />
  };
  
  return (
    <div className='main'>
      <div className='home-component'>
      {posts && posts.map(post => (
          <span key={post.slug}>
            <Link to={`/p/${post.slug}`}>
            <section className='card'>
              <IronImage 
                src={post.coverImageURL} 
                alt={post.coverImageAlt} 
                placeholder={PostImagePlaceholder()} 
              />
              <div className='card-content'>
                <span className='card-title'>
                  {post.title}<br />
                  <span 
                    style={{ 
                    fontSize: '0.7em', 
                    textTransform: 'uppercase', 
                    fontWeight: '100' 
                  }}>{moment(post.createdAt?.toDate()).fromNow()}</span>
                </span>
                <p 
                  style={{ 
                    fontSize: '0.9em', 
                    marginBottom: '15px' 
                  }}>
                  {`${post.body.substring(0, 100)}...`}
                </p>
                <span className='usertag-span-home'>
                  <img 
                    src={authorInfo.profilePictureURL ?? ProfilePlaceHolder} 
                    alt='Profile' 
                    className='profile-picture' 
                  />
                  {post.author}
                </span>
              </div>
            </section>
            </Link>
          </span>
        ))}
      </div>
    </div>
  );
};

export default Home;