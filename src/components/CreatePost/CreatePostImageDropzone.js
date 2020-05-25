import React from 'react';
import { useDropzone } from 'react-dropzone';
import CloudUploadImage from '../../assets/images/cloud-upload-icon.svg';

export const PostImageDropzone = React.memo((props) => {
   const { getRootProps, getInputProps } = useDropzone();

   return (
      <div className='create-post-image-dropdown-component'>
         <div {...getRootProps()}>
            <img src={CloudUploadImage} alt='upload to cloud' />
            <p>Drag or drop files here</p>
            <input {...getInputProps()} />
            <p style={{ margin: '20px 0' }}>or</p>
            <button className='lower-hierarchy-button-color'>Browse Files</button>
         </div>
         <button></button>
      </div>
   );
});

export default PostImageDropzone;
