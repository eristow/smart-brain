import React from 'react';
import ReactDOM from 'react-dom';

import './Modal.css';

const Modal = ({ children, className = 'root-portal', el = 'div' }) => {
  const [container] = React.useState(document.createElement(el));

  container.classList.add(className);

  React.useEffect(() => {
    document.body.appendChild(container);
    return () => {
      document.body.removeChild(container);
    };
  }, [container]);

  return ReactDOM.createPortal(children, container);
};

export default Modal;
