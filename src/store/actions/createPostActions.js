export const createPost = (post) => {
    return (dispatch, getState, { getFirebase }) => {
        const firebase = getFirebase();
        const firestore = getFirebase().firestore();
        const profile = getState().firebase.profile;
        const author = profile.name;
        const authorId = getState().firebase.auth.uid;

        const slugify = post.title.toLowerCase().trim().replace(/&/g, '-and-').replace(/[\s\W-]+/g, '-');

        const newPost = {
            author: author, 
            authorId, 
            authorRef: firestore.collection('users').doc(authorId),
            title: post.title,
            slug: slugify,
            coverImageURL: post.coverImageURL,
            coverImageAlt: post.coverImageAlt,
            body: post.body,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
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
        })
    }
};

export const handleUploadCoverImage = (props) => {
    return (dispatch, getState, { getFirebase }) => {
        const firebase = getFirebase();
        const { imageData, setProgress, setCoverImageURL } = props;

        const postImageRef = 
        firebase
        .storage()
        .ref('blog_posts_images')
        .child(imageData.name)
        .put(imageData);

        postImageRef.on('state_changed', (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setProgress(progress);
        }, (error) => {
            dispatch({ type: 'UPLOAD_POST_IMAGE_FAILED', payload: error.message })
        }, () => {
            firebase
            .storage()
            .ref('blog_posts_images')
            .child(imageData.name)
            .getDownloadURL()
            .then(url => {
                setCoverImageURL(url)})
                dispatch({ type: 'UPLOAD_POST_IMAGE_SUCCESS' })
        });
    }
}