import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Redirect } from 'react-router-dom';
import { signUp } from '../../store/actions/userActions';
import { ErrorCircle } from '@styled-icons/boxicons-solid/ErrorCircle';

export const SignUp = React.memo((props) => {
  const { auth, history } = props;
  const { register, handleSubmit, watch, errors } = useForm();
  const password = useRef({});
  password.current = watch('password', '');

  const handleSignUp = async (creds) => {
    await props.signUp({ creds, history });
  };

  if (!auth.isEmpty) {
    return <Redirect to='/' />;
  }

  return (
    <div className='signin-component'>
      {props.errors ? (
        <span className='error-message'>
          <ErrorCircle size='30' title='error' style={{ marginRight: 5 }} />
          {props.errors}
        </span>
      ) : null}
      <form className='signup-form' onSubmit={handleSubmit(handleSignUp)}>
        <div>
          <label>Username</label>
          <input
            type='text'
            name='username'
            ref={register({
              required: {value: true, message: 'Username is required'},
              minLength: 4,
              maxLength: 20,
              pattern: /^[a-z0-9_-]{3,25}$/i,
            })}
          />
          <span className='error-span'>
            {errors.username && errors.username.message}
          </span>
          <label>Email Address</label>
          <input type='email' name='email' ref={register({ required: {value: true, message: 'Email Address is required'} })} />
          <span className='error-span'>
            {errors.email && errors.email.message}
          </span>
          <label>Password</label>
          <input
            type='password'
            name='password'
            ref={register({ 
              required: {value: true, message: 'Password is required'}, 
              minLength: { value: 8, message: 'Password must be at least 8 characters' } 
              })}
          />
          <span className='error-span'>
            {errors.password && errors.password.message}
          </span>
          <label>Confirm Password</label>
          <input
            type='password'
            name='confirmPassword'
            ref={register({
              required: {value: true, message: 'Confirm Password is required'},
              validate: (value) =>
                value === password.current || 'Passwords do not match',
            })}
          />
          <span className='error-span'>
            {errors.confirmPassword && errors.confirmPassword.message}
          </span>
          <button style={{ marginTop: '15px' }}>
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
});

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    errors: state.uiReducer.errors,
    loading: state.uiReducer.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  dispatch({ type: 'CLEAR_ERRORS' });

  return {
    signUp: (creds) => dispatch(signUp(creds)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
