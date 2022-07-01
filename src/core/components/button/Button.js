import PropTypes from 'prop-types';
import { transformClassName } from '../../common/Util';

import './Button.scss';

function getClasses(type, classes = '') {
  const classNames = `btn
  ${type === 'standard' || !type ? 'btn-standard' : ''}
  ${type === 'icon' ? 'btn-icon' : ''}
  ${classes}`;
  return transformClassName(classNames);
}

function Button(props) {
  return (
    <button {...props}
      className={getClasses(props.type, props.className)}
    >
      {props.children}
    </button>
  )
}

export default Button;

Button.propTypes = {
  className: PropTypes.string,
  type: PropTypes.oneOf(['standard', 'icon']),
  onClick: PropTypes.func,
};