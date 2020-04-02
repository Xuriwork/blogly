import React from 'react';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Redirect } from 'react-router-dom';
import { signIn, sendPasswordResetEmail } from '../../store/actions/authAction';
import { ErrorCircle } from '@styled-icons/boxicons-solid/ErrorCircle';

const SignIn = (props) => {
    const { auth, authError } = props;
    
    const { register, handleSubmit } = useForm();

    const handleSignIn = async (creds) => {
        await props.signIn({creds, props});
    }

    const sendPasswordResetEmail = (data) => {
        props.sendPasswordResetEmail(data);
    }

    if (!auth.isEmpty) {
        return <Redirect to='/' />
    }

    return (
        <div className='signin-component'>
            <form onSubmit={handleSubmit(handleSignIn)}>
                <div>
                    { 
                        authError ? (
                        <span className='error-message'>
                            <ErrorCircle size='30' title='error' style={{ marginRight: 5 }} />
                            {authError}
                        </span> ) : null
                    }
                    <label>Email Address</label>
                    <input type='email' name='email_address' ref={register} />
                    <label>Password</label>
                    <input type='password' name='password' ref={register} />
                    <span style={{ marginBottom: '15px', width: '70%' }}>
                        <p>Forget your password? {' '}
                            <span 
                                style={{ 
                                    fontWeight: 'bold', 
                                    color: '#f55353', 
                                    cursor: 'pointer'
                                }} 
                                onClick={handleSubmit(sendPasswordResetEmail)}
                            >
                                Click here
                            </span>
                        </p>
                    </span>
                    <button>Sign In</button>
                </div>
            </form>
        </div>
    )
}

const mapStateToProps = (state) => {

    return {
        authError: state.auth.authError,
        auth: state.firebase.auth,
    }
}

const mapDispatchToProps = (dispatch, store) => {

    dispatch({ type: 'RESET' });

    return {
        signIn: (creds) => dispatch(signIn(creds)),
        sendPasswordResetEmail: (email_address) => dispatch(sendPasswordResetEmail(email_address))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);