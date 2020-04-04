import React, { useEffect, useState, useContext } from 'react';
import { postComment, deleteComment } from '../../store/actions/commentsActions';
import { connect, useSelector } from 'react-redux';
import { useFirestore } from 'react-redux-firebase';
import { useForm } from 'react-hook-form';
import moment from 'moment';
import NotyfContext from '../../helpers/NotyfContext';
import { ErrorCircle } from '@styled-icons/boxicons-solid/ErrorCircle';
import { Error } from  '@styled-icons/boxicons-solid/Error';

import { Modal } from '../../helpers/Modal';
import ProfilePlaceHolder from '../../assets/images/user.svg';

import Loading from '../../helpers/Loading';

export const Comments = (props) => {

    const { auth, match, history, commentError } = props;
    const slug = match.params.slug;
    const firestore = useFirestore();
    const profile = useSelector(state => state.firebase.profile);
    const notyf = useContext(NotyfContext);

    const { register, handleSubmit, reset } = useForm();

    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {

        const listener = 
        firestore
        .collection('posts')
        .doc(slug)
        .collection('comments')
        .orderBy('createdAt', 'desc')
        .onSnapshot((snapshot) => {
            let _comments = [];
            snapshot.forEach(commentSnapshot => {
                const thisComment = commentSnapshot.data();
                _comments.push({commentData: thisComment, commentId: commentSnapshot.id});
            });
            setComments(_comments);
            setLoading(false);
        }, (error) => {
            console.log(error);
        });

        return () => listener();
    
    }, [firestore, slug]);

    const postComment = async ({ content }) => {
        if (auth.isEmpty) {
            notyf.error('You are not authenticated 😕');
            return;
        }
        await props.postComment({content, slug});
        reset();
    };

    const deleteComment = (commentId, authorId) => {
        const currentUserId = auth.uid;
        const commentUserId = authorId;

        if (!comments) {
            return;
        }

        if (currentUserId !== commentUserId) {
            notyf.error('That\'s not your comment')
            return;
        }

        props.deleteComment({commentId, authorId, slug});  
    };

    const back = () => {
        history.push(`/p/${slug}`);
    };

    if (loading) {
        return <Loading />;
    };

    return (
        <div className='main' style={{ width: '600px', maxWidth: '90%' }}>
            { 
                commentError !== null ? (
                <span className='error-message'>
                    <ErrorCircle size='30' style={{ marginRight: 5 }} />
                    {commentError}
                </span> ) : null
            }
            <div className='long-container' onClick={back} style={{ cursor: 'pointer', height: '50px' }}>
                Commenting on the post: {slug}
            </div>
            <div className='long-container' style={{ padding: '10px 0' }}>
                <div>
                    <img 
                        src={profile.profilePictureURL ?? ProfilePlaceHolder} 
                        alt='Profile' 
                        className='profile-picture' 
                    />
                    <span className='usertag-span'>{auth?.displayName}</span>
                </div>
                <div>
                    <form onSubmit={handleSubmit(postComment)}>
                        <textarea 
                            name='content'
                            rows='3' 
                            disabled={!auth.uid}
                            style={{ margin: '10px 0' }}
                            placeholder='Add to the conversation!'
                            ref={register({ required: true, minLength: 3 })}
                        /> 
                        <span style={{ width: '90%' }}>
                            <button>Comment</button>
                        </span>
                    </form>
                </div>
            </div>
            {comments.map((comment) =>
            <div key={comment.commentId} className='long-container' style={{ padding: '15px 0' }}>
                <div style={{ height: '30px' }}>
                    <img 
                        src={comment.commentData.authorProfilePicture ?? ProfilePlaceHolder} 
                        alt='Profile' 
                        className='profile-picture'
                    />

                    <div className='commentMetadata' style={{ flexDirection: 'column', alignItems: 'flex-start', justifyItems: 'center' }}>
                        <span className='usertag-span'>{comment.commentData.author}</span>
                        <span>{moment(comment.commentData.createdAt?.toDate()).fromNow()}</span>
                    </div>
                </div>
                <span className='commentText-span'>
                    {comment.commentData.content}
                </span>
                <span className='commentText-span' style={{ justifyContent: 'flex-end' }}>
                    { 
                        auth.uid === comment.commentData.authorId ?
                        (
                            <Modal 
                                buttonActionClassName='delete-button' 
                                visibleButtonClassName='delete-button'
                                modalContentHeaderBackgroundColor='#fa4949'
                                title='Confirm' 
                                modalContent='Are you sure you want to delete this comment?' 
                                emoji={<Error size='30' color='#f53d3d' style={{ marginRight: 10 }} />}
                                buttonActionName='Delete'
                                buttonAction={() => deleteComment(comment.commentId, comment.commentData.authorId)}
                            />
                        ) : null
                    }
                </span>
            </div>
            )}
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
  return {
    postComment: (comment) => dispatch(postComment(comment)),
    deleteComment: (commentToDelete) => dispatch(deleteComment(commentToDelete)) 
  }
} 

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        commentError: state.commentsReducer.commentError,
    }
} 

export default connect(mapStateToProps, mapDispatchToProps)(Comments);
