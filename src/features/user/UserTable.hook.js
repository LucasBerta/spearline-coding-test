import { getFormattedDate, lookUpObjectValue } from "../../core/common/Util";

export default function useUserTable() {
  function paginate(_users, page, pageSize) {
    const sliceStart = (page - 1) * pageSize;
    const sliceEnd = sliceStart + pageSize;
    const filteredUsers = _users.slice(sliceStart, sliceEnd);
    return filteredUsers;
  }

  function sortUsers(_users = [], sortBy) {
    return _users.sort((a, b) => {
      const isDate = sortBy.attr === 'registered';
      const _a = lookUpObjectValue(a, sortBy.attr, isDate);
      const _b = lookUpObjectValue(b, sortBy.attr, isDate);
      if (sortBy.order === 'asc') {
        if (_a < _b) return -1;
        if (_a > _b) return 1;
        return 0;
      }
      if (_b < _a) return -1;
      if (_b > _a) return 1;
      return 0
    });
  }

  function filterUsers(_users, search = {}) {
    return _users.filter(user => {
      const _user = { ...user, registered: getFormattedDate(new Date(user.registered)) };
      const attrs = Object.keys(search);
      let includeResult = true;

      for (let i = 0; i < attrs.length; i++) {
        if (!lookUpObjectValue(_user, attrs[i]).toLowerCase().includes(search[attrs[i]].toLowerCase())) {
          includeResult = false;
          break;
        }
      }
      return includeResult;
    });
  }

  return {
    paginate,
    sortUsers,
    filterUsers,
  };
}