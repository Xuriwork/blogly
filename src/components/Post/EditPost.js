import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import JoditEditor from 'jodit-react';

export const EditPost = React.memo((props) => {
  const { handleSubmit, register, errors } = useForm();
  const [, setBodyContent] = useState('');

  const config = {
    readonly: false,
  };

  return (
    <>
      <>
        <div className='post-component'>
          <div>
            <img
              src={props.post.coverImageURL}
              alt={props.post.coverImageAlt}
              placeholder={props.Placeholder}
            />
          </div>
          <div className='post-content'>
            <button onClick={props.backToPost}>Back to Post</button>
            <input
              name='title'
              type='text'
              defaultValue={props.post.title}
              ref={register({ required: true, minLength: 5, maxLength: 150 })}
            />
            <JoditEditor
              name='body'
              ref={register({ required: true, minLength: 20 })}
              value={post.body}
              config={config}
              tabIndex={1}
              onBlur={(newContent) => setBodyContent(newContent)}
            />
          </div>
        </div>
      </>
    </>
  );
});
