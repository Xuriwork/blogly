import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Redirect } from "react-router-dom";
import { signUp } from '../../store/actions/authAction';
import { ErrorCircle } from '@styled-icons/boxicons-solid/ErrorCircle';

const SignUp = (props) => {
    const { auth, authError } = props;
    const { register, handleSubmit, watch, errors} = useForm();
    const password = useRef({});
    password.current = watch("password", "");

    const handleSignUp = async (creds) => {
        await props.signUp({creds, push: props.history.push});
    } 

    if (!auth.isEmpty) {
        return <Redirect to='/' />
    }

    return (
        <div className='signin-component'>
            <form className='signup-form' onSubmit={handleSubmit(handleSignUp)}>
                <div>
                    { 
                        authError ? (
                        <span className='error-message'>
                            <ErrorCircle size='30' title='error' style={{ marginRight: 5 }} />
                            {authError}
                        </span> ) : null
                    }
                    {errors.password_confirm && <p className='error-message'>
                        <ErrorCircle size='30' title='error' style={{ marginRight: 5 }} />
                        {errors.password_confirm.message}
                    </p>}
                    <label>Usertag</label>
                    <input 
                        type='text' 
                        name='name' 
                        ref={register({ required: true, minLength: 4, maxLength: 20 })} />
                    <label>Email Address</label>
                    <input type='email' name='email' ref={register} />
                    <label>Password</label>
                    <input 
                        type='password' 
                        name='password' 
                        ref={register({ required: true, minLength: 8 })}
                    />
                    <label>Confirm Password</label>
                    <input 
                        type='password' 
                        name='password_confirm' 
                        ref={register({
                            validate: (value) => 
                                value === password.current || 'Passwords do not match'
                        })} />
                        
                    <button style={{ marginTop: '15px' }}>Sign Up</button>
                </div>
            </form>
        </div>
    )
}

const mapStateToProps = (state) => {
    console.log(state)
    return {
        authError: state.auth.authError,
        auth: state.firebase.auth,
    }
}

const mapDispatchToProps = (dispatch) => {

    dispatch({ type: 'RESET' });

    return {
        signUp: (creds) => dispatch(signUp(creds)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
