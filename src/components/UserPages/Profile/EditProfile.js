import React from 'react';
import { Link } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';

import { useFirebase, isLoaded } from 'react-redux-firebase';
import { useForm } from 'react-hook-form';
import FileUploader from 'react-firebase-file-uploader';

import { updateProfileInfo, uploadProfilePicture } from '../../../store/actions/profileActions';
import Loading from '../../../utils/Loading';

import { Upload } from '@styled-icons/heroicons-outline/Upload';

export const EditProfile = React.memo((props) => {
    const { auth } = props;

    const firebase = useFirebase();
    const currentUser = auth.uid;
    const userStorageRef = firebase.storage().ref(`users/${currentUser}/user_profile_picture`);
    const profile = useSelector(state => state.firebase.profile);
    const { register, handleSubmit } = useForm();

    const save = (profileInfo) => {
        props.updateProfileInfo(profileInfo);
    };

    const handleUploadProfilePicture = async (imageName) => {
        await props.uploadProfilePicture({imageName, userStorageRef});
    };

    const handleSelectProfilePicture = () => {
        const fileInput = document.getElementById('imageInput');
        fileInput.click();
    };
    
    if (!isLoaded(profile)) {
        return <Loading />
    };

    return (
            <div className='profile-page-component'>
                <div className='upper-container'>
                    <div className='image-container'>
                        <img 
                            src={profile.userImageURL} 
                            alt='profile' 
                            className='profile-picture'
                        />
                    </div>
                </div>
                <div className='lower-container'>
                    <div>
                        <input type='text' name='name' disabled placeholder={auth.displayName} />
                        <textarea 
                            type='text' 
                            name='bio' 
                            placeholder='bio' 
                            defaultValue={profile.bio}
                            ref={register}
                        />
                        <FileUploader
                            accept='image/png, image/jpeg'
                            name='photo'
                            randomizeFilename
                            maxHeight={90}
                            maxWidth={90}
                            storageRef={userStorageRef}
                            onUploadSuccess={handleUploadProfilePicture} 
                            id='imageInput' 
                            hidden='hidden'
                        /> 
                        <div>
                            <button 
                                onClick={handleSelectProfilePicture} 
                                className='lower-hierarchy-button-color' 
                                style={{ width: '100%' }}
                            >
                                <Upload size='20' title='Upload profile picture button' style={{ marginRight: '5px' }} />
                                Upload Profile Picture
                            </button>
                        </div>
                    </div>
                    <div>
                        <button onClick={handleSubmit(save)} style={{ marginRight: '10px' }}>Save</button>
                        <Link to='profile'><button className='lower-hierarchy-button-color'>Back to profile</button></Link>
                    </div>
                </div>
            </div>
    )
});

const mapStateToProps = (state) => {
    return {
      auth: state.firebase.auth,
    }
} 

const mapDispatchToProps = (dispatch) => {
    return {
        updateProfileInfo: (profileInfo) => dispatch(updateProfileInfo(profileInfo)),
        uploadProfilePicture: (image) => dispatch(uploadProfilePicture(image)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);