import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getFormattedDate } from '../../core/common/Util';
import Button from "../../core/components/button/Button";
import TextField from '../../core/components/textField/TextField';
import useUserTable from './UserTable.hook';
import './UserTable.scss';

function isFirstPage(currentPage) {
  return currentPage < 2;
}

function isLastPage(currentPage, totalRecords, pageSize) {
  const totalPages = lastPage(totalRecords, pageSize);
  return currentPage >= totalPages;
}

function lastPage(totalRecords, pageSize) {
  return Math.ceil(totalRecords / pageSize);
}

function formatUsers(users = []) {
  return users.map(user => {
    return {
      uuid: user.login.uuid,
      fullName: `${user.name.first} ${user.name.last}`,
      location: `${user.location.city}, ${user.location.country}`,
      registered: user.registered.date,
      phone: user.phone,
      picture: user.picture.thumbnail,
    };
  });
}

// Components
function Pagination({ totalRecords, currentPage, pageSize, onPreviousPage, onNextPage }) {
  const from = totalRecords > 0 ? ((currentPage - 1) * pageSize) + 1 : 0;
  const to = currentPage * pageSize < totalRecords ? currentPage * pageSize : totalRecords;

  return (
    <div className='pagination' role='navigation'>
      <span className='pagination--info'>
        {from} - {to} of {totalRecords}
      </span>
      <Button disabled={isFirstPage(currentPage)} type='icon' className='pagination--navigate-left' onClick={onPreviousPage}>
        <span className="material-symbols-outlined">keyboard_arrow_left</span>
      </Button>
      <Button disabled={isLastPage(currentPage, totalRecords, pageSize)} type='icon' className='pagination--navigate-right' onClick={onNextPage}>
        <span className="material-symbols-outlined">keyboard_arrow_right</span>
      </Button>
    </div>
  );
}

function Sort({ item = {}, sortBy = {}, onSort }) {
  function isSortingByAnotherAttr() {
    return !!sortBy.attr && sortBy.attr !== item.attr;
  }

  function isSortingByOrder(order) {
    return sortBy.attr === item.attr && sortBy.order === order;
  }

  return (
    <div className='sort' onClick={onSort}>
      <span className={`material-symbols-outlined sort-asc${isSortingByOrder('desc') || isSortingByAnotherAttr() ? ' inactive' : ''}`}>
        arrow_drop_up
      </span>
      <span className={`material-symbols-outlined sort-desc${isSortingByOrder('asc') || isSortingByAnotherAttr() ? ' inactive' : ''}`}>
        arrow_drop_down
      </span>
    </div>
  );
}

///////////////////////////////////////////////////
function UserTable({ users = [], pageSize = 20, handleOnDelete }) {
  const [allFilteredUsers, setAllFilteredUsers] = useState([]);
  const [visibleUsers, setVisibleUsers] = useState([]);
  const [search, setSearch] = useState({ fullName: '', location: '', registered: '', phone: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState({ attr: '', order: '' });
  const [totalPaginationRecords, setTotalPaginationRecords] = useState(allFilteredUsers.length);
  const userTableHook = useRef(useUserTable()).current;

  const tableConfig = [
    { label: 'Name', attr: 'fullName', sort: 'name', sortIconPosition: 'right', searchable: true },
    { label: 'Location', attr: 'location', sort: 'location', sortIconPosition: 'right', searchable: true },
    { label: 'Registered', attr: 'registered', sort: 'registered', sortIconPosition: 'left', searchable: true },
    { label: 'Phone', attr: 'phone', searchable: true },
    { label: 'Picture', attr: 'picture' },
    { label: 'Actions' },
  ];

  const paginate = useCallback((_users, page) => {
    return userTableHook.paginate(_users, page, pageSize);
  }, [pageSize, userTableHook]);

  const sortUsers = useCallback((_users = []) => {
    return userTableHook.sortUsers(_users, sortBy);
  }, [sortBy, userTableHook]);

  const filterUsers = useCallback((_users, search = {}) => {
    return userTableHook.filterUsers(_users, search);
  }, [userTableHook]);

  const getPaginatedUsers = useCallback((userList = [], page = 1, search = {}) => {
    let _users = [...userList];
    _users = filterUsers(_users, search);
    _users = sortUsers(_users);
    const paginatedUsers = paginate(_users, page);
    const _totalPaginationRecords = _users.length;

    setAllFilteredUsers(_users);
    setVisibleUsers(paginatedUsers);
    setTotalPaginationRecords(_totalPaginationRecords);

    if (lastPage(_totalPaginationRecords, pageSize) > 0 && currentPage > lastPage(_totalPaginationRecords, pageSize)) {
      setCurrentPage(lastPage(_totalPaginationRecords, pageSize));
    }

  }, [sortUsers, filterUsers, paginate, currentPage, pageSize]);

  useEffect(() => {
    getPaginatedUsers(formatUsers(users), currentPage, search);
  }, [getPaginatedUsers, users, currentPage, search, pageSize]); // Automatically refresh users when search, page or sort changes.

  // Handlers
  function handleOnPreviousPage() {
    if (!isFirstPage(currentPage)) {
      setCurrentPage(currentPage - 1);
    }
  }

  function handleOnNextPage() {
    if (!isLastPage(currentPage, totalPaginationRecords, pageSize)) {
      setCurrentPage(currentPage + 1);
    }
  }

  function handleOnSort(item) {
    let order = 'asc';
    const isSameAttrAsPrevious = sortBy.attr === item.attr;
    if (isSameAttrAsPrevious) {
      order = sortBy.order === 'asc' ? 'desc' : 'asc';
    }
    setCurrentPage(1);
    setSortBy({ attr: item.attr, order });
  }

  function handleOnChangeSearch(e, attr) {
    const value = e.target.value;
    setCurrentPage(1);
    setSearch({ ...search, [attr]: value });
  }

  return (
    <>
      <div className='table-container'>
        <table className='table'>
          <thead className='header'>
            <tr className='header--labels'>
              {tableConfig.map(item => (
                <th key={item.label} className={`header--${item.label.toLowerCase()}`}>
                  {!!item.sort && item.sortIconPosition === 'right' && <span>{item.label}</span>}
                  {!!item.sort && <Sort item={{ ...item }} sortBy={sortBy} onSort={() => handleOnSort(item)} />}
                  {(!item.sort || (!!item.sort && item.sortIconPosition === 'left')) && <span>{item.label}</span>}
                </th>
              ))}
            </tr>
            <tr className='header--filter'>
              {tableConfig.map(item => (
                <th key={item.label} className={`search`}>
                  {item.searchable &&
                    <TextField
                      placeholder={`Search ${item.label}`}
                      className={item.attr}
                      value={search[item.attr]}
                      onChange={e => handleOnChangeSearch(e, item.attr)}
                    />
                  }
                </th>
              ))}
            </tr>
          </thead>

          <tbody className='users'>
            {visibleUsers.map(user => (
              <tr key={user.uuid} className='user'>
                <td className='user--name'>{user.fullName}</td>
                <td className='user--location'>{user.location}</td>
                <td className='user--registered'>{getFormattedDate(user.registered)}</td>
                <td className='user--phone'>{user.phone}</td>
                <td className='user--thumbnail'><img src={user.picture} alt='Thumbnail' /></td>
                <td className='user--actions'>
                  <Button
                    className='user--actions--delete'
                    type='icon'
                    onClick={() => handleOnDelete(users.find(u => u.login.uuid === user.uuid))}
                  ><span className="material-symbols-outlined">close</span></Button>
                </td>
              </tr>
            ))}
            {visibleUsers.length === 0 &&
              <tr className='no-results'><td colSpan='100%'><span>Oops! We couldn't find any user. Review your search and try again :)</span></td></tr>
            }
          </tbody>
        </table>
      </div>
      <Pagination
        totalRecords={totalPaginationRecords}
        currentPage={currentPage}
        pageSize={pageSize}
        onPreviousPage={handleOnPreviousPage}
        onNextPage={handleOnNextPage}
      />
    </>
  );
}

export default UserTable;
export { isFirstPage, isLastPage };

UserTable.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  pageSize: PropTypes.number,
  handleOnDelete: PropTypes.func.isRequired,
};

Pagination.propTypes = {
  totalRecords: PropTypes.number,
  currentPage: PropTypes.number,
  pageSize: PropTypes.number,
  onPreviousPage: PropTypes.func,
  onNextPage: PropTypes.func,
};