import React, { useEffect, useState } from 'react';
import Home  from './Home';
import { useFirestore } from 'react-redux-firebase';
import PostImagePlaceholderLightMode from '../../assets/images/LazyLoadPlaceholderLightMode.png';
import PostImagePlaceholderDarkMode from '../../assets/images/LazyLoadPlaceholderDarkMode.png';

export const HomeContainer = () => {
  const firestore = useFirestore();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = firestore
      .collection('posts')
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        (snapshot) => {
          let _posts = [];
          snapshot.forEach((postSnapshot) => {
            _posts.push(postSnapshot.data());
          });
          setPosts(_posts);
          setLoading(false);
        },
        (error) => {
          console.error(error);
        }
      );
    return () => unsubscribe();
  }, [firestore]);

  const PostImagePlaceholder = () => {
    const theme = localStorage.getItem('theme');

    switch (theme) {
      case 'dark-mode':
        return PostImagePlaceholderDarkMode;
      case 'light-mode':
        return PostImagePlaceholderLightMode;
      default:
        return PostImagePlaceholderLightMode;
    }
  };

  return (
    <Home loading={loading} posts={posts} PostImagePlaceholder={PostImagePlaceholder} />
  );
};

export default HomeContainer;