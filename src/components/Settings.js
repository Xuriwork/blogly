import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, connect } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';
import FileUploader from 'react-firebase-file-uploader';
import { Twitter } from '@styled-icons/boxicons-logos/Twitter';
import { Github } from '@styled-icons/boxicons-logos/Github';
import { Upload } from '@styled-icons/heroicons-outline/Upload';
import { updateSettings } from '../store/actions/settingsActions';
import { uploadProfilePicture } from '../store/actions/profileActions';
import { DarkLightModeContext } from '../utils/DarkLightModeContext';

export const Settings = (props) => {
    const { auth } = props;
    const { register, handleSubmit } = useForm();
    const profile = useSelector(state => state.firebase.profile);
    const handleToggleTheme = useContext(DarkLightModeContext);

    const userStorageRef = useFirebase().storage().ref(`user_profile_pictures/${auth.uid}`);

      useEffect(() => {

      const theme = localStorage.getItem('theme');
      const slider = document.getElementById('settings-slider');

      if (theme === 'dark-mode') {
        if (slider) {
            slider.checked = true;
        }
      }
    })

    const handleUpdateSettings = async (settingsInfo) => {
        await props.updateSettings(settingsInfo);
    }

    const handleUploadProfilePicture = async (imageName) => {
        await props.uploadProfilePicture({imageName, userStorageRef});
    };

    const handleSelectProfilePicture = () => {
        const fileInput = document.getElementById('imageInput');
        fileInput.click();
    };

    return (
        <div className='main'>
            <div className='settings-component'>
                <div>
                    <div className='profile-picture-section'>
                        <img 
                            src={profile.userImageURL} 
                            alt='profile' 
                            className='profile-picture'
                        />
                        <FileUploader
                            accept='image/png, image/jpeg' 
                            name='photo' 
                            filename={auth.uid}
                            storageRef={userStorageRef}
                            onUploadSuccess={handleUploadProfilePicture} 
                            id='imageInput' 
                            hidden='hidden'
                        /> 
                        <button onClick={handleSelectProfilePicture}>
                            <Upload size='20' title='Upload profile picture button' style={{ marginRight: '5px' }} />
                            Upload new picture
                        </button>
                        <button className='delete-button'>Remove photo</button>
                    </div>
                    <span style={{ marginBottom: 10 }}>
                        <label style={{ marginRight: 10 }}>Dark Mode</label>
                        <label id='switch'>
                            <input type='checkbox' id='settings-slider' onChange={handleToggleTheme} />
                            <span className='slider round'></span>
                        </label>
                    </span>
                    <label>Email</label>
                    <input type='text' name='email' defaultValue={profile.email} ref={register} />
                    <label>Name</label>
                    <input type='text' name='name' defaultValue={profile.username} ref={register} />
                    <label>Usertag</label>
                    <input type='text' name='usertag' disabled defaultValue={profile.usertag} />
                    <label>Bio</label>
                    <textarea name='bio' ref={register} defaultValue={profile.bio}  />
                    <span>Let the world know who you are.</span>
                    <h3>Online presence</h3>
                    <hr />
                    <label>Personal website</label>
                    <input type='text' name='personalWebsite' defaultValue={profile?.personalWebsite} ref={register} />
                    <label>Online portfolio</label>
                    <input type='text' name='onlinePortfolio' defaultValue={profile?.onlinePortfolio} ref={register} />
                    <div className='buttons-container'>
                        <button style={{ backgroundColor: '#444444' }}>
                            <Github 
                                size='20' 
                                title='Connect to Github' 
                            />
                            Connect to Github
                        </button>
                        <button style={{ backgroundColor: '#1DA1F2' }}>
                            <Twitter 
                                size='20' 
                                title='Connect to Twitter'
                            />
                            Connect to Twitter
                        </button>
                    </div>
                    <hr />
                    <button className='save-profile-button' onClick={handleSubmit(handleUpdateSettings)}>Save Profile</button>
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
        updateSettings: (updateSettingsInfo) => dispatch(updateSettings(updateSettingsInfo)),
        uploadProfilePicture: (image) => dispatch(uploadProfilePicture(image)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
