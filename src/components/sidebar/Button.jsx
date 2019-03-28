import React from 'react';
import PropTypes from 'prop-types';


function Button({ classes, handler = () => {}, title = 'button' }) {
  return <div className={`button ${classes}`}>
    <span href="#" onClick={handler}>{title}</span>
  </div>;
}

Button.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
};
export default Button;