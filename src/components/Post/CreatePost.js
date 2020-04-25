import React from 'react';
import JoditEditor from 'jodit-react';
import { Modal } from '../../utils/Modal';
import { Progress } from 'react-sweet-progress';
import { ErrorCircle } from '@styled-icons/boxicons-solid/ErrorCircle';
import 'react-sweet-progress/lib/style.css';

export const CreatePost = React.memo((props) => {

  const { 
    errorMessage, 
    errors, 
    formErrors, 
    register, 
    progress, 
    selectImageFile, 
    selectedImageName, 
    handleSelectCoverImage, 
    handleUploadCoverImage,
    handlePublishPost,
    bodyContent,
    setBodyContent,
    theme
  } = props;

  const config = {
    readonly: false,
    height: 350,
    theme,
    buttons: [
      'source', 
      'bold', 
      'strikethrough', 
      'underline', 
      'italic', 
      'ul',
      'ol',
      'outdent',
      'indent',
      'fontsize',
      'brush',
      'undo',
      'redo',
      'selectall',
      'cut',
      'copy',
      'paste',
      'fullsize',
      'about'
    ],
    toolbarAdaptive: false,
  };

  return (
    <>
      {errors !== null ? (
        <span className='error-message'>
          <ErrorCircle size='30' title='error' style={{ marginRight: 5 }} />
          {errors}
        </span>
      ) : null}
      {errorMessage !== null ? (
        <span className='error-message'>
          <ErrorCircle size='30' title='error' style={{ marginRight: 5 }} />
          {errorMessage}
        </span>
      ) : null}
      {(formErrors?.body?.type === 'required' ||
        formErrors?.coverImageAlt?.type === 'required' ||
        formErrors?.title?.type === 'required') && (
        <p className='error-message'>
          <ErrorCircle size='30' title='error' style={{ marginRight: 5 }} />
          All fields are required
        </p>
      )}
      <div className='create-post-component'>
        {formErrors?.title?.type === 'maxLength' && (
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
            <span>{selectedImageName}</span>
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
          buttonAction={handlePublishPost}
        />
      </div>
    </>
  );
});

export default CreatePost;
