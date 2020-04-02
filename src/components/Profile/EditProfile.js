import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { connect, useSelector } from 'react-redux';
import { useFirebase, isLoaded } from 'react-redux-firebase';
import FileUploader from 'react-firebase-file-uploader';
import { updateProfileInfo, uploadProfilePicture } from '../../store/actions/updateProfileActions';

import { Upload } from '@styled-icons/heroicons-outline/Upload';
import Loading from '../../helpers/Loading';
import ProfilePlaceHolder from '../../assets/images/user.svg';

export const EditProfile = (props) => {
    const { auth } = props;

    const firebase = useFirebase();
    const currentUser = auth.uid;
    const userStorageRef = firebase.storage().ref(`user_profile_pictures/${currentUser}`);
    const profile = useSelector(state => state.firebase.profile);
    const { register, handleSubmit } = useForm();

    const save = (profileInfo) => {
        props.updateProfileInfo(profileInfo);
    };

    const handleUploadProfilePicture = async imageData => {
        await props.uploadProfilePicture({imageData, currentUser, userStorageRef});
    };

    const handleImageUpload = () => {
        const fileInput = document.getElementById('imageInput');
        fileInput.click();
    };
    
    if (!isLoaded(profile)) {
        return <Loading />
    };

    return (
        <div className='main'>
            <div className='profile-page-component'>
                <div className='upper-container'>
                    <div className='image-container'>
                        <img 
                            src={profile.profilePictureURL ?? ProfilePlaceHolder} 
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
                            storageRef={userStorageRef}
                            onUploadSuccess={handleUploadProfilePicture} 
                            id='imageInput' 
                            hidden='hidden'
                        /> 
                        <div>
                            <button onClick={handleImageUpload} className='lower-hierarchy-button-color'>
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
        </div>
    )
}

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