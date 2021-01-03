import React from 'react';

const Input = ({
  label,
  type,
  id,
  placeholder,
  required,
  register,
  onProfile,
}) => {
  return (
    <>
      <label className="db fw6 lh-copy f6" htmlFor={id}>
        {label}
      </label>
      <input
        className={
          onProfile
            ? 'pa2 ba w-100'
            : 'pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 hover-black'
        }
        type={type}
        name={id}
        id={id}
        placeholder={placeholder}
        ref={register({
          ...(required && {
            required: { value: true, message: `${label} is required` },
          }),
        })}
      />
    </>
  );
};

export default Input;
