import { useEffect, useState } from 'react';
import Snackbar from '../../core/components/snackbar/Snackbar';
import { fetchUsers } from './User.api';
import './User.scss';
import UserChart from './UserChart';
import UserTable from './UserTable';

function User() {
  const [allUsers, setAllUsers] = useState([]);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const pageSize = 20;

  useEffect(() => {
    fetchUsers({ results: 500 }).then(response => { // Will be calling twice at start in production in reason of strict mode.
      setAllUsers(response.data.results);
    }).catch(err => {
      showSnack(err?.response?.data?.error);
    });
  }, []);

  function showSnack(message) {
    setSnackOpen(false);
    setTimeout(() => {
      setSnackMessage(message);
      setSnackOpen(true);
    });
  }

  function handleOnDelete(user) {
    let _users = allUsers.filter(u => u.login.uuid !== user.login.uuid);
    if (_users.length < allUsers.length) {
      showSnack(`User ${user.fullName} deleted successfully!`);
    }
    setAllUsers(_users);
  }

  return (
    <div>
      <h2 className='title'>Most frequent users</h2>
      <h4 className='subtitle'>Below are our most frequent users in the last month</h4>

      <UserTable
        users={allUsers}
        pageSize={pageSize}
        handleOnDelete={handleOnDelete}
      />

      <UserChart users={allUsers} />

      {snackOpen && <Snackbar message={snackMessage} />}
    </div>
  )
}

export default User;