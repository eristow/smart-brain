import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import './Signin.css';
import ErrorSummary from '../ErrorSummary/ErrorSummary';

const Signin = ({ handleSignIn }) => {
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const { register, errors, handleSubmit } = useForm();

  const onSubmitSignIn = (data) => {
    handleSignIn(data.email, data.password);
    setShouldRedirect(true);
  };

  return (
    <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
      <main className="pa4 black-80">
        <div className="measure">
          <form onSubmit={handleSubmit(onSubmitSignIn)}>
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">Sign In</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email">
                  Email
                </label>
                <input
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 hover-black"
                  type="email"
                  name="email"
                  id="email"
                  ref={register({
                    required: { value: true, message: 'Email is required' },
                  })}
                />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">
                  Password
                </label>
                <input
                  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 hover-black"
                  type="password"
                  name="password"
                  id="password"
                  ref={register({
                    required: { value: true, message: 'Password is required' },
                  })}
                />
              </div>
            </fieldset>
            <div className="">
              <input
                // onClick={handleSubmit(onSubmitSignIn)}
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit"
                value="Sign in"
              />
            </div>
            <ErrorSummary errors={errors} />
          </form>
        </div>
      </main>
      {shouldRedirect && <Redirect to="/home" />}
    </article>
  );
};

export default Signin;
