import React from 'react';

import './ErrorModal.css';

const ErrorModal = ({ errorMessage, toggleError }) => {
  return (
    <div className="error-modal">
      <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center bg-white">
        <main className="pa4 black-80 w-80">
          <h1>{errorMessage}</h1>
        </main>
        <div className="modal-close" onClick={toggleError}>
          &times;
        </div>
      </article>
    </div>
  );
};

export default ErrorModal;
