import React from 'react';
import { ErrorMessage } from '@hookform/error-message';

import './ErrorSummary.css';

const ErrorSummary = ({ errors }) => {
  if (Object.keys(errors).length === 0) {
    return null;
  }
  return (
    <div className="error-summary">
      {Object.keys(errors).map((fieldName) => (
        <ErrorMessage
          errors={errors}
          name={fieldName}
          as="div"
          key={fieldName}
        />
      ))}
    </div>
  );
};

export default ErrorSummary;
