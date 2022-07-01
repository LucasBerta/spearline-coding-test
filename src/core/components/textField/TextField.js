import PropTypes from 'prop-types';
import { transformClassName } from '../../common/Util';
import './TextField.scss';

function TextField(props) {
  const { className } = props;

  return (
    <input {...props}
      className={transformClassName(`text-field ${className}`)}
    />
  )
}

export default TextField;

TextField.propTypes = {
  value: PropTypes.any,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
};