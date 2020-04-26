import React from 'react';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Redirect, Link } from 'react-router-dom';
import { signIn } from '../../store/actions/userActions';
import { ErrorCircle } from '@styled-icons/boxicons-solid/ErrorCircle';

export const SignIn = React.memo((props) => {
  const { auth, errors, history, loading } = props;
  const { register, handleSubmit } = useForm();

  const handleSignIn = async (creds) => {
    await props.signIn({ creds, history });
  };

  if (!auth.isEmpty) {
    return <Redirect to='/' />;
  }

  return (
    <div className='signin-component'>
      {errors ? (
        <span className='error-message'>
          <ErrorCircle size='30' title='error' style={{ marginRight: 5 }} />
          {errors}
        </span>
      ) : null}
      <form onSubmit={handleSubmit(handleSignIn)}>
        <div>
          <label>Email Address</label>
          <input type='email' name='email' ref={register} />
          <label>Password</label>
          <input type='password' name='password' ref={register} />
          <span style={{ marginBottom: '15px', width: '70%' }}>
            <p>
              Forget your password?{' '}
              <Link
                to='/forgot-password'
                style={{
                  fontWeight: 'bold',
                  color: '#f55353',
                  cursor: 'pointer',
                }}>
                Click here
              </Link>
            </p>
          </span>
          <button disabled={loading}>Sign In</button>
        </div>
      </form>
    </div>
  );
});

const mapStateToProps = (state) => {
  return {
    errors: state.uiReducer.errors,
    auth: state.firebase.auth,
    loading: state.uiReducer.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  dispatch({ type: 'CLEAR_ERRORS' });

  return {
    signIn: (creds) => dispatch(signIn(creds)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
