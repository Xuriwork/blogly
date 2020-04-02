export const postComment = (props) => {
    return (dispatch, getState, {getFirebase}) => {
        const { formData, slug, reset } = props;

        const firebase = getFirebase();
        const firestore = getFirebase().firestore();
        const name = getState().firebase.profile.name;
        const authorId = getState().firebase.auth.uid;

        const postCommentsRef = 
        firestore
        .collection('posts')
        .doc(slug)
        .collection('comments');

        const newComment = {
            author: name,
            authorId, 
            content: formData.content, 
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            authorRef: firestore.collection('users').doc(authorId),
        }

        postCommentsRef
        .add(newComment)
        .then(() => {
            reset();
            dispatch({ type: 'POST_COMMENT_SUCCESS' })
        })
        .catch(error => {
            dispatch({ 
                type: 'POST_COMMENT_ERROR', 
                payload: error.message, 
            });
            reset({ content: formData.content });
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