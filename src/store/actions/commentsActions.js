export const postComment = ({content, slug}) => {
    return (dispatch, getState, {getFirebase}) => {

        const firebase = getFirebase();
        const firestore = getFirebase().firestore();
        const username = getState().firebase.profile.username;
        const authorId = getState().firebase.auth.uid;
        const authorProfilePicture = getState().firebase.profile.userImageURL;

        const postCommentsRef = 
        firestore
        .collection('posts')
        .doc(slug)
        .collection('comments');

        const newComment = {
            author: username,
            authorId, 
            authorProfilePicture,
            content, 
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            authorRef: firestore.collection('users').doc(authorId),
        }

        postCommentsRef
        .add(newComment)
        .then(() => {
            dispatch({ type: 'POST_COMMENT_SUCCESS' });
        })
        .catch(error => {
            dispatch({ 
                type: 'POST_COMMENT_ERROR', 
                payload: error.message, 
            });
        })
            
        
    }
}

export const deleteComment = (props) => {
    return (dispatch, getState, {getFirebase}) => {
        const { commentId, slug } = props;
        const firestore = getFirebase().firestore();

        firestore
        .collection('posts')
        .doc(slug)
        .collection('comments')
        .doc(commentId)
        .delete()
        .then(() => {
            dispatch({ type: 'COMMENT_DELETION_SUCCESS' })
        })
        .catch(error => {
            dispatch({ 
                type: 'COMMENT_DELETION_ERROR', 
                payload: error.message,
            })
        });
    }
};