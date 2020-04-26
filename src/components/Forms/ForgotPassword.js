import React from 'react';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Redirect } from 'react-router-dom';
import { sendPasswordResetEmail } from '../../store/actions/userActions';
import { ErrorCircle } from '@styled-icons/boxicons-solid/ErrorCircle';

export const ForgotPassword = React.memo((props) => {
  const { auth, errors, loading } = props;
  const { register, handleSubmit } = useForm();

  const sendPasswordResetEmail = (data) => {
    props.sendPasswordResetEmail(data);
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
      <form onSubmit={handleSubmit(sendPasswordResetEmail)}>
        <div>
          <label>Email Address</label>
          <input
            type='email'
            name='email'
            ref={register}
            style={{ marginBottom: '15px', width: '70%' }}
          />
          <button disabled={loading}>Send Recovery Email</button>
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

const mapDispatchToProps = (dispatch, store) => {
  dispatch({ type: 'CLEAR_ERRORS' });

  return {
    sendPasswordResetEmail: (email) => dispatch(sendPasswordResetEmail(email)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
