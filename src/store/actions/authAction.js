export const signIn = (data) => {
    return (dispatch, getState, {getFirebase}) => {
        const firebase = getFirebase();
        const { email, password } = data.creds;
 
        firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
            dispatch({ type: 'SIGNIN_SUCCESS' });
            data.props.history.push('/');
        })
        .catch((error) => {
            dispatch({ 
                type: 'SIGNIN_ERROR', 
                payload: error.message, 
            });
        })
    }
}

export const signUp = (props) => {
    return (dispatch, getState, {getFirebase}) => {
        const firebase = getFirebase();
        const firestore = getFirebase().firestore();
        const randomTagNumber = Math.random().toString().slice(2,6);

        const { creds, push } = props;
        
        firebase
        .auth()
        .createUserWithEmailAndPassword(creds.email, creds.password)
        .then(async (response) => {
            await response.user.updateProfile({displayName: creds.username + '#' + randomTagNumber})
            await firestore.collection('users').doc(response.user.uid).set(
                {
                    name: creds.username,
                    usertag: creds.username + '#' + randomTagNumber,
                    createdAt: '',
                },
                { merge: true }
            )
            dispatch({ type: 'SIGNUP_PROFILE_UPDATE_SUCCESS' });
        })
        .then(() => {
            dispatch({ type: 'SIGNUP_SUCCESS' });
            push('/');
        })
        .catch((error) => {
            console.log(error)
            dispatch({ 
                type: 'SIGNUP_ERROR', 
                payload: error.message,
            });
        });
    }
}

export const signOut = () => {
    return (dispatch, getState, {getFirebase}) => {
        const firebase = getFirebase();

        firebase
        .auth()
        .signOut()
        .then(() => {
            dispatch({ type: 'SIGNOUT_SUCCESS' });
        })
        .catch((error) => {
            dispatch({ 
                type: 'SIGNOUT_ERROR', 
                payload: error.message,
            });
        });

    }
}

export const sendPasswordResetEmail = ({ email }) => {
    return (dispatch, getState, {getFirebase}) => {
        const firebase = getFirebase();
        
        firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then(() => {
            dispatch({ type: 'PASSWORD_RESET_EMAIL_SENT' });
        })
        .catch((error) => {
            dispatch({ 
                type: 'PASSWORD_RESET_EMAIL_ERROR', 
                payload: error.message,
            });
        })
    }
}