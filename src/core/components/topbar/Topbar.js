import { useEffect, useState } from 'react';
import './Topbar.scss';

function Topbar() {
  const [visible, setVisible] = useState(true);

  function handleOnScroll() {
    if (!visible && window.scrollY < 80) {
      setVisible(true);
    } else if (visible && window.scrollY > 80) {
      setVisible(false);
    }
  }

  useEffect(() => {
    document.addEventListener('scroll', handleOnScroll);
    return () => document.removeEventListener('scroll', handleOnScroll);
  });

  return (
    <div className={`topbar ${!visible ? 'invisible' : ''}`}>
      <div className='logo'></div>
      <div className='menu'></div>
    </div>
  )
}

export default Topbar;