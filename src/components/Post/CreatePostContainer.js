import React, { useState, useEffect } from 'react';
import { CreatePost } from './CreatePost';
import { connect } from 'react-redux';
import Resizer from 'react-image-file-resizer';
import { useForm } from 'react-hook-form';
import {
  createPost,
  handleUploadCoverImage,
} from '../../store/actions/postActions';

export const CreatePostContainer = React.memo((props) => {
  const { handleSubmit, register, errors } = useForm();
  const [errorMessage, setErrorMessage] = useState(null);
  const [coverImageURL, setCoverImageURL] = useState(null);
  const [bodyContent, setBodyContent] = useState('');
  const [image, setImage] = useState(null);
  const [selectedImageName, setSelectedImageName] = useState(null);
  const [progress, setProgress] = useState(0);
  const [theme, setTheme] = React.useState('');

  useEffect(() => {
    const localStorageTheme = localStorage.getItem('theme');
    if (localStorageTheme) {
      if (localStorageTheme === 'dark-mode') {
        setTheme('dark');
      }
    }
  }, [theme])

  const selectImageFile = () => {
    const fileInput = document.getElementById('coverImageInput');
    fileInput.click();
  };

  const dataURItoBlob = (dataURI) => {
    if (typeof dataURI !== 'string') {
      throw new Error('Invalid argument: dataURI must be a string');
    }
    dataURI = dataURI.split(',');
    var type = dataURI[0].split(':')[1].split(';')[0],
      byteString = atob(dataURI[1]),
      byteStringLength = byteString.length,
      arrayBuffer = new ArrayBuffer(byteStringLength),
      intArray = new Uint8Array(arrayBuffer);
    for (var i = 0; i < byteStringLength; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }
    return new Blob([intArray], {
      type: type,
    });
  };

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        700,
        700,
        'JPEG',
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        'base64'
      );
    });

  const handleSelectCoverImage = async (event) => {
    if (event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImageName(file.name);
      const uri = await resizeFile(file);
      const image = await dataURItoBlob(uri);
      setImage(image);
    }
  };

  const handleUploadCoverImage = () => {
    if (!image) return;
    props.handleUploadCoverImage({
      image,
      setProgress,
      setCoverImageURL,
      setErrorMessage,
    });
  };

  const createPost = (data) => {
    if (coverImageURL === null) {
      setErrorMessage("Don't forget to upload a cover image");
      return;
    }
    props.createPost({ coverImageURL, ...data });
    props.history.push('/');
  };

  const handlePublishPost = handleSubmit(createPost);

  return (
    <CreatePost
      errorMessage={errorMessage}
      formErrors={errors}
      errors={props.errors} 
      register={register}
      handlePublishPost={handlePublishPost}
      progress={progress}
      selectImageFile={selectImageFile}
      selectedImageName={selectedImageName}
      handleSelectCoverImage={handleSelectCoverImage}
      handleUploadCoverImage={handleUploadCoverImage}
      bodyContent={bodyContent}
      setBodyContent={setBodyContent}
      theme={theme}
    />
  );
});

const mapStateToProps = (state) => {
  return {
    errors: state.uiReducer.errors,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleUploadCoverImage: (imageData) => dispatch(handleUploadCoverImage(imageData)),
    createPost: (post) => dispatch(createPost(post)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreatePostContainer);
