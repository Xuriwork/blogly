import { customAlphabet } from 'nanoid/non-secure';
import axios from 'axios';
import { CREATE_POST_SUCCESS, SET_ERRORS } from '../types';
import { isEmpty } from '../../utils/validators';

export const createPost = (post) => {
  return (dispatch, getState, { getFirebase }) => {
    const firestore = getFirebase().firestore();
    const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 12);

    if (isEmpty(post.title || post.slug || post.body || post.coverImageURL)) {
        return dispatch({ type: SET_ERRORS, payload: 'Fields must not be empty' });
    }

    const slugify = post.title
      .toLowerCase()
      .trim()
      .replace(/&/g, '-and-')
      .replace(/[\s\W-]+/g, '-');

    const createSlug = () => {
      const slugId = nanoid();
      return `${slugify}-${slugId}`;
    };

    const slug = createSlug();

    const newPost = {
      slug,
      title: post.title,
      body: post.body,
      coverImageURL: post.coverImageURL,
      coverImageAlt: post.coverImageAlt,
    };

    axios.post('/create-post', newPost).then((res) => {
      dispatch({ type: CREATE_POST_SUCCESS, payload: res.data });
    });

    firestore
      .collection('posts')
      .doc(slug)
      .set(newPost)
      .then(() => {
        dispatch({ type: CREATE_POST_SUCCESS });
      })
      .catch((error) => {
        console.log(error);
        console.log(error.message);
        dispatch({
          type: SET_ERRORS,
          payload: error.message,
        });
      });
  };
};

export const handleUploadCoverImage = (props) => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();
    const { imageData, setProgress, setCoverImageURL } = props;

    const postImageRef = firebase
      .storage()
      .ref(`blog_posts_images`)
      .child(imageData.name)
      .put(imageData);

    postImageRef.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        dispatch({ type: 'UPLOAD_POST_IMAGE_FAILED', payload: error.message });
      },
      () => {
        firebase
          .storage()
          .ref(`blog_posts_images`)
          .child(imageData.name)
          .getDownloadURL()
          .then((url) => {
            setCoverImageURL(url);
          });
        dispatch({ type: 'UPLOAD_POST_IMAGE_SUCCESS' });
      }
    );
  };
};
