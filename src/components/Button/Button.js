import React from 'react';

const Button = ({ label, type, primary }) => {
  let className = '';
  if (primary) {
    className = 'b pa2 grow pointer hover-white w-40 bg-light-blue b--black-20';
  } else {
    className =
      'b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib';
  }

  return <input className={className} type={type} value={label} />;
};

export default Button;
