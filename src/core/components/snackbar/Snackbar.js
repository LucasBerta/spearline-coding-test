import reactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import './Snackbar.scss';

function SnackbarContainer() {
  return (
    <div id='snackbar-container'></div>
  );
}

function Snackbar({ message = '' }) {
  const [domReady, setDomReady] = useState(false);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    setDomReady(true);
    const timeout = setTimeout(() => {
      setExpired(true);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [setDomReady, setExpired]);

  return domReady && !expired ? reactDOM.createPortal(
    < div className='snackbar' >
      <span>{message}</span>
    </ div>,
    document.getElementById('snackbar-container')
  ) : null;
}

export default Snackbar;
export { SnackbarContainer };

Snackbar.propTypes = {
  message: PropTypes.string.isRequired
};