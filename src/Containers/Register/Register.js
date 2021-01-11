import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import './Register.css';
import ErrorSummary from '../../components/ErrorSummary/ErrorSummary';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';

const Register = ({ handleSignIn, setErrorMessage, toggleError }) => {
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const { register, errors, handleSubmit } = useForm();

  const onSubmitRegister = async (data) => {
    const registerRes = await fetch('http://localhost:3000/register', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        name: data.name,
      }),
    });

    if (!registerRes.ok) {
      setErrorMessage('There was an error registering. Try again.');
      toggleError();
    }

    const user = await registerRes.json();
    if (user.id) {
      const profilePicRes = await fetch(
        `https://fn5rmn7o9l.execute-api.us-east-1.amazonaws.com/profileSet`,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageUrl:
              'https://thumbs.dreamstime.com/b/default-avatar-profile-image-vector-social-media-user-icon-potrait-182347582.jpg',
            key: `${user.id}_profile_pic.png`,
          }),
        }
      );

      if (!profilePicRes.ok) {
        setErrorMessage('There was an error with your profile pic. Try again.');
        toggleError();
      }

      if (profilePicRes.status === 200 || profilePicRes.status === 304) {
        await handleSignIn(data.email, data.password);
        setShouldRedirect(true);
      }
    }
  };

  return (
    <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
      <main className="pa4 black-80">
        <div className="measure">
          <form onSubmit={handleSubmit(onSubmitRegister)}>
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">Register</legend>
              <div className="mt3">
                <Input
                  label="Name"
                  type="text"
                  id="name"
                  required
                  register={register}
                />
              </div>
              <div className="mt3">
                <Input
                  label="Email"
                  type="email"
                  id="email"
                  required
                  register={register}
                />
              </div>
              <div className="mv3">
                <Input
                  label="Password"
                  type="password"
                  id="password"
                  required
                  register={register}
                />
              </div>
              <ErrorSummary errors={errors} />
            </fieldset>
            <div>
              <Button label="Register" type="submit" />
            </div>
          </form>
        </div>
      </main>
      {shouldRedirect && <Redirect to="/home" />}
    </article>
  );
};

export default Register;
