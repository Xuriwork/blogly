import React, { useContext, useRef, useState } from 'react';

import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';
import { useForm } from 'react-hook-form';

import NotyfContext from '../../context/NotyfContext';
import { DarkLightModeContext } from '../../context/DarkLightModeContext';

export const ReportPost = ({ postId, closeModalHandler }) => {
  const { theme } = useContext(DarkLightModeContext);
  const notyf = useContext(NotyfContext);
  const recaptchaRef = useRef();
  const { register, handleSubmit, reset, errors: formErrors } = useForm();
  const [errors, setErrors] = useState({});
  const [report, setReport] = useState({});

  const handleOnChange = (e) => setReport({...report, [e.target.name]: e.target.value});

  const handleSubmitReport = () => {
    const recaptchaValue = recaptchaRef.current.getValue();
    const date = new Date();
    const reportData = { postId, date, ...report };
    
    if (!recaptchaValue) return setErrors({ ...errors, recaptchaError: 'Complete the reCaptcha' });
    
    axios.post('/sendReportOnPost', reportData)
    .then(({data}) => {
      notyf.success(data);
      reset();
      closeModalHandler();
    })
    .catch((error) => {
      setErrors({ ...errors, serverError: error });
      console.log(error);
    });
  };

  return (
    <div className='modal-content report-post-component'>
      <form id='report-form'>
        <label>Post Id</label>
        <input type='text' disabled value={postId} />
        <div className='radio-group'>
          <div>
            <input
              type='radio'
              name='reportType'
              value='Violent content' 
              onChange={handleOnChange} 
              ref={register({ required: true })}
            />
            <label>Violent content</label>
          </div>
          <div>
            <input
              type='radio'
              name='reportType'
              value='Hateful content'
              onChange={handleOnChange} 
              ref={register({ required: true })}
            />
            <label>Hateful content</label>
          </div>
          <div>
            <input
              type='radio'
              name='reportType'
              value='Spam'
              onChange={handleOnChange} 
              ref={register({ required: true })}
            />
            <label>Spam</label>
          </div>
          <div>
            <input
              type='radio'
              name='reportType'
              value='Rude'
              onChange={handleOnChange} 
              ref={register({ required: true })}
            />
            <label>Rude</label>
          </div>
          <div>
            <input
              type='radio'
              name='reportType'
              value='Misleading content'
              onChange={handleOnChange} 
              ref={register({ required: true })}
            />
            <label>Misleading content</label>
          </div>
          <div>
            <input
              type='radio'
              name='reportType'
              value='Other'
              onChange={handleOnChange} 
              ref={register({ required: true })}
            />
            <label>Other</label>
          </div>
          { formErrors.reportType && <p className='error-message-text'>This field is required</p> }
        </div>
        <label>Message</label>
        <textarea 
          name='reportMessage' 
          onChange={handleOnChange} 
          ref={register({ required: true })}
        ></textarea>
        { formErrors.reportMessage && <p className='error-message-text'>Please describe the error</p> }
        <div style={{ marginTop: '10px' }}>
          <ReCAPTCHA
            sitekey='6LcCNPsUAAAAAGTmNvsoWiQ-f2FjeJarUl24PRE_'
            theme={theme}
            ref={recaptchaRef} 
          />
        </div>
        { errors.recaptchaError && <p className='error-message-text'>Please complete the captcha</p> }
        <button onClick={handleSubmit(handleSubmitReport)}>Send Feedback</button>
      </form>
    </div>
  );
};

export default ReportPost;
