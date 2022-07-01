import './App.scss';
import { SnackbarContainer } from './core/components/snackbar/Snackbar';
import Topbar from './core/components/topbar/Topbar';
import User from './features/user/User';

function App() {
  return (
    <div className="app">
      <SnackbarContainer />
      <Topbar />
      <div className='content'>
        <User />
      </div>
    </div>
  );
}

export default App;
