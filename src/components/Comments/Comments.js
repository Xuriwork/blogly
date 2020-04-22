import React from 'react';
import { ErrorCircle } from '@styled-icons/boxicons-solid/ErrorCircle';
import { Error } from '@styled-icons/boxicons-solid/Error';
import ProfilePlaceHolder from '../../assets/images/user.svg';
import { Modal } from '../../utils/Modal';
import Loading from '../../utils/Loading';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export const Comments = React.memo((props) => {

  const { loading, auth, comments, back, register, handleSubmit, postTitle, commentError, postComment, deleteComment } = props;

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='comments-component'>
      {commentError !== null ? (
        <span className='error-message'>
          <ErrorCircle size='30' style={{ marginRight: 5 }} />
          {commentError}
        </span>
      ) : null}
      <div
        className='long-container'
        onClick={back}
        style={{ cursor: 'pointer', height: '50px' }}>
        Commenting on the post: {postTitle}
      </div>
      <div className='long-container' style={{ padding: '10px 0' }}>
        <div>
          <img
            src={auth.isEmpty ? ProfilePlaceHolder : auth.photoURL}
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
      {comments.map((comment) => (
        <div
          key={comment.commentId}
          className='long-container'
          style={{ padding: '15px 0' }}>
          <div style={{ height: '30px' }}>
            <img
              src={comment.commentData.authorProfilePicture}
              alt='Profile'
              className='profile-picture'
            />

            <div
              className='commentMetadata'
              style={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyItems: 'center',
              }}>
              <span className='usertag-span'>{comment.commentData.author}</span>
              <span>
                {dayjs(comment.commentData.createdAt?.toDate()).fromNow()}
              </span>
            </div>
          </div>
          <span className='commentText-span'>
            {comment.commentData.content}
          </span>
          <span
            className='commentText-span'
            style={{ justifyContent: 'flex-end' }}>
            {auth.uid === comment.commentData.authorId ? (
              <Modal
                buttonActionClassName='delete-button'
                visibleButtonClassName='delete-button'
                modalContentHeaderBackgroundColor='#fa4949'
                title='Confirm'
                modalContent='Are you sure you want to delete this comment?'
                emoji={
                  <Error
                    size='30'
                    color='#f53d3d'
                    style={{ marginRight: 10 }}
                  />
                }
                buttonActionName='Delete' 
                commentId={comment.commentId}
                authorId={comment.commentData.authorId}
                buttonAction={deleteComment}
              />
            ) : null}
          </span>
        </div>
      ))}
    </div>
  );
});

export default Comments;
