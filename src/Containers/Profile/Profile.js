import React from 'react';
import { useForm } from 'react-hook-form';

import './Profile.css';
import ErrorSummary from '../../components/ErrorSummary/ErrorSummary';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';

const Profile = ({
  toggleModal,
  loadUser,
  user,
  setErrorMessage,
  toggleError,
}) => {
  const { register, errors, handleSubmit } = useForm();

  const onProfileSubmit = async (data) => {
    if (data.name === '') {
      data.name = user.name;
    }
    if (data.age === '') {
      data.age = user.age;
    }
    if (data.pet === '') {
      data.pet = user.pet;
    }

    const profileRes = await fetch(`http://localhost:3000/profile/${user.id}`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${window.sessionStorage.getItem('token')}`,
      },
      body: JSON.stringify({ formInput: data }),
    });

    if (!profileRes.ok) {
      setErrorMessage('There was an error editing your profile. Try again.');
      toggleError();
    }

    if (profileRes.status === 200 || profileRes.status === 304) {
      toggleModal();
      loadUser({ ...user, ...data });
    }
  };

  return (
    <div className="profile-modal">
      <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center bg-white">
        <main className="pa4 black-80 w-80">
          <img
            src="http://tachyons.io/img/logo.jpg"
            className="h3 w3 dib"
            alt="avatar"
          />
          <h1>{user.name}</h1>
          <h4>{`Images Submitted: ${user.entries}`}</h4>
          <p>{`Member Since: ${new Date(user.joined).toLocaleDateString()}`}</p>
          <hr />
          <form onSubmit={handleSubmit(onProfileSubmit)}>
            <Input
              label="Name"
              type="text"
              id="name"
              placeholder={user.name}
              register={register}
              onProfile
            />
            <Input
              label="Age"
              type="text"
              id="age"
              placeholder={user.age}
              register={register}
              onProfile
            />
            <Input
              label="Pet"
              type="text"
              id="pet"
              placeholder={user.pet}
              register={register}
              onProfile
            />
            <ErrorSummary errors={errors} />
            <div
              className="mt4"
              style={{ display: 'flex', justifyContent: 'space-evenly' }}
            >
              <Button label="Save" type="submit" primary />
              <button
                className="b pa2 grow pointer hover-white w-40 bg-light-red b--black-20"
                onClick={toggleModal}
              >
                Cancel
              </button>
            </div>
          </form>
        </main>
        <div className="modal-close" onClick={toggleModal}>
          &times;
        </div>
      </article>
    </div>
  );
};

export default Profile;
