import { customAlphabet } from 'nanoid/non-secure';

export const createPost = (post) => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();
    const firestore = getFirebase().firestore();
    const profile = getState().firebase.profile;
    const author = profile.name;
    const authorId = getState().firebase.auth.uid;
    const authorProfilePictureURL = getState().firebase.auth.photoURL;
    const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 12);

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
      author,
      authorId,
      authorProfilePictureURL,
      title: post.title,
      slug,
      coverImageURL: post.coverImageURL,
      coverImageAlt: post.coverImageAlt,
      body: post.body,
      createdAt: new Date(),
    };

    firestore
      .collection('posts')
      .doc(`${slugify}`)
      .set(newPost)
      .then(() => {
        dispatch({ type: 'CREATE_POST_SUCCESS' });
      })
      .catch((error) => {
        dispatch({
          type: 'CREATE_POST_ERROR',
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
      .ref(`blog_posts_images/${props.newPost.slug}`)
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
          .ref(`blog_posts_images/${props.newPost.slug}`)
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
