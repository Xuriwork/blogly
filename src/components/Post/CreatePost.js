import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
  createPost,
  handleUploadCoverImage,
} from '../../store/actions/postActions';

import JoditEditor from 'jodit-react';
import { Modal } from '../../utils/Modal';
import { useForm } from 'react-hook-form';
import { Progress } from 'react-sweet-progress';
import { ErrorCircle } from '@styled-icons/boxicons-solid/ErrorCircle';

import 'react-sweet-progress/lib/style.css';
import 'rodal/lib/rodal.css';

export const CreatePost = (props) => {
  const { handleSubmit, register, errors } = useForm();
  const [errorMessage, setErrorMessage] = useState(null);
  const [coverImageURL, setCoverImageURL] = useState('');
  const [bodyContent, setBodyContent] = useState('');
  const [imageData, setImageData] = useState('');
  const [progress, setProgress] = useState(0);

  const config = {
    readonly: false,
  };

  const selectImageFile = () => {
    const fileInput = document.getElementById('coverImageInput');
    fileInput.click();
  };

  const handleSelectCoverImage = (e) => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      setImageData(image);
    }
  };

  const handleUploadCoverImage = () => {
    if (!imageData) return;
    props.handleUploadCoverImage({
      imageData,
      setProgress,
      setCoverImageURL,
      setErrorMessage,
    });
  };

  const createPost = (data) => {
    if (coverImageURL === '') {
      setErrorMessage("Don't forget to upload a cover image");
      return;
    }
    props.createPost({ coverImageURL, ...data });
    props.history.push('/');
  };

  return (
    <main className='main'>
      {props.errors !== null ? (
        <span className='error-message'>
          <ErrorCircle size='30' title='error' style={{ marginRight: 5 }} />
          {props.errors}
        </span>
      ) : null}
      {errorMessage !== null ? (
        <span className='error-message'>
          <ErrorCircle size='30' title='error' style={{ marginRight: 5 }} />
          {errorMessage}
        </span>
      ) : null}
      {(errors?.body?.type === 'required' ||
        errors?.coverImageAlt?.type === 'required' ||
        errors?.title?.type === 'required') && (
        <p className='error-message'>
          <ErrorCircle size='30' title='error' style={{ marginRight: 5 }} />
          All fields are required
        </p>
      )}
      <div className='create-post-component'>
        <h1>Create a new post</h1>
        {errors?.title?.type === 'maxLength' && (
          <p className='error-message'>
            <ErrorCircle size='30' title='error' style={{ marginRight: 5 }} />
            Title must be under 90 characters
          </p>
        )}
        <label htmlFor='title'>
          Title <span>Required</span>
        </label>
        <input
          name='title'
          type='text'
          ref={register({ required: true, minLength: 5, maxLength: 150 })}
        />
        <label className='upload-label'>
          <div style={{ marginBottom: '15px' }}>
            <button
              onClick={selectImageFile}
              className='select-image-file-button'>
              Select Cover Image
            </button>
            <span>{imageData.name}</span>
          </div>
          <input
            name='coverImageInput'
            type='file'
            id='coverImageInput'
            accept='image/png, image/jpeg'
            hidden='hidden'
            onChange={handleSelectCoverImage}
            ref={register}
          />
          <button onClick={handleUploadCoverImage} className='upload-image'>
            Upload Cover Image
          </button>
          <Progress
            percent={progress}
            theme={{
              default: {
                symbol: '📘',
                color: '#e2dddd',
              },
              active: {
                symbol: '📘',
                color: '#28c7fa',
              },
              success: {
                symbol: '📗',
                color: '#a7ff83',
              },
              error: {
                symbol: '📕',
                color: '#d72323',
              },
            }}
            style={{ marginTop: '10px' }}
          />
        </label>
        <label htmlFor='cover-image-alt-field'>
          Cover image description <span>Required</span>
        </label>
        <input
          name='coverImageAlt'
          type='text'
          ref={register({ required: true })}
        />
        <label htmlFor='body-field'>
          Body <span>Required</span>
        </label>
        <div className='input-width'>
          <JoditEditor
            name='body'
            ref={register({ required: true, minLength: 20 })}
            value={bodyContent}
            config={config}
            tabIndex={1}
            onBlur={(newContent) => setBodyContent(newContent)}
          />
        </div>
        <Modal
          buttonActionClassName='approve-button'
          modalContentHeaderBackgroundColor='#23d48a'
          visibleButtonStyle={{ marginTop: 40 }}
          title='Confirm'
          modalContent='Confirmation to publish this blog post to the world.'
          buttonActionName='Create'
          buttonAction={handleSubmit(createPost)}
        />
      </div>
    </main>
  );
};

const mapStateToProps = (state) => {
  return {
    errors: state.uiReducer.errors,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleUploadCoverImage: (imageData) =>
      dispatch(handleUploadCoverImage(imageData)),
    createPost: (post) => dispatch(createPost(post)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreatePost);
