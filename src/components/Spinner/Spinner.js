import React from 'react';
// import spinnerGif from '../../assets/Spinner.gif'

const Spinner = ({ children, active, text }) => {
  return (
    <>
      {active ? (
        <div>
          {/* <img src={spinnerGif} alt="spinner" /> */}
          <h1>{text}</h1>
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default Spinner;
