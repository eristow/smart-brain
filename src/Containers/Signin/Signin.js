import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import './Signin.css';
import ErrorSummary from '../../components/ErrorSummary/ErrorSummary';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';

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
              <Button label="Sign In" type="submit" />
            </div>
          </form>
        </div>
      </main>
      {shouldRedirect && <Redirect to="/home" />}
    </article>
  );
};

export default Signin;
