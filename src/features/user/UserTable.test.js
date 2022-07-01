import { render, fireEvent, screen } from '@testing-library/react';
import userListMock from './User.mock.json';
import UserTable from './UserTable';

describe('UserTable component', () => {
  let component = render();
  const onDelete = jest.fn(user => null);

  beforeEach(() => {
    component = render(<UserTable users={userListMock} pageSize={2} handleOnDelete={onDelete} />);
  });

  afterEach(() => {
    component.unmount();
  });

  it('it should render the table', () => {
    const titleElement = component.queryByRole('table');
    expect(titleElement).toBeInTheDocument();
  });

  it('should contain 4 table rows', () => { // 2 body rows for results + 2 header rows
    const rows = component.queryAllByRole('row');
    expect(rows.length).toBe(4);
  });

  describe('Filter', () => {
    it('should display a msg when there is no result for the filter', async () => {
      const nameFilterInput = component.queryByPlaceholderText('Search Name');
      const searchName = userListMock[3].name.first + 'fail';

      fireEvent.change(nameFilterInput, { target: { value: searchName.toLowerCase() } });

      const rows = component.queryAllByRole('row');
      const tbody = component.queryAllByRole('rowgroup')[1];
      let noResultRow = tbody.querySelector('.no-results');

      expect(rows.length).toBe(3);
      expect(noResultRow.textContent).toContain(`Oops! We couldn't find any user. Review your search and try again :)`);
    });

    it('should contain only the names as per Name filter', async () => {
      const nameFilterInput = component.queryByPlaceholderText('Search Name');
      const searchName = userListMock[3].name.first;

      fireEvent.change(nameFilterInput, { target: { value: searchName.toLowerCase() } });

      const rows = component.queryAllByRole('row');
      const tbody = component.queryAllByRole('rowgroup')[1];
      let user = tbody.querySelector('.user--name');

      expect(rows.length).toBe(3);
      expect(user.textContent).toContain(userListMock[3].name.first);
    });

    it('should contain only the location as per Location filter', () => {
      const locationFilterInput = component.queryByPlaceholderText('Search Location');
      const searchLocation = userListMock[3].location.city;

      fireEvent.change(locationFilterInput, { target: { value: searchLocation.toLowerCase() } });

      const rows = component.queryAllByRole('row');
      const tbody = component.queryAllByRole('rowgroup')[1];
      let user = tbody.querySelector('.user--location');

      expect(rows.length).toBe(3);
      expect(user.textContent).toContain(userListMock[3].location.city);
    });

    it('should contain only the name as per Registered filter', () => {
      const registeredFilterInput = component.queryByPlaceholderText('Search Registered');
      const searchRegistered = '04/05/2015'; // userListMock[3] formatted date

      fireEvent.change(registeredFilterInput, { target: { value: searchRegistered.toLowerCase() } });

      const rows = component.queryAllByRole('row');
      const tbody = component.queryAllByRole('rowgroup')[1];
      let user = tbody.querySelector('.user--name');

      expect(rows.length).toBe(3);
      expect(user.textContent).toContain(userListMock[3].name.first);
    });

    it('should contain only the phone as per Phone filter', () => {
      const phoneFilterInput = component.queryByPlaceholderText('Search Phone');
      const searchPhone = userListMock[2].phone;

      fireEvent.change(phoneFilterInput, { target: { value: searchPhone.toLowerCase() } });

      const rows = component.queryAllByRole('row');
      const tbody = component.queryAllByRole('rowgroup')[1];
      let user = tbody.querySelector('.user--phone');

      expect(rows.length).toBe(3);
      expect(user.textContent).toContain(userListMock[2].phone);
    });
  });

  describe('Sort', () => {
    it('should sort by name order asc and desc', () => {
      const sortNameButton = component.queryAllByRole('row')[0].querySelector('th.header--name div.sort');
      fireEvent.click(sortNameButton);

      const rows = component.queryAllByRole('row');
      const tbody = component.queryAllByRole('rowgroup')[1];
      let [user1, user2] = tbody.querySelectorAll('.user--name');
      expect(rows.length).toBe(4);
      expect(user1.textContent).toContain(userListMock[2].name.first);
      expect(user2.textContent).toContain(userListMock[0].name.first);

      fireEvent.click(sortNameButton);
      [user1, user2] = tbody.querySelectorAll('.user--name');
      expect(rows.length).toBe(4);
      expect(user1.textContent).toContain(userListMock[3].name.first);
      expect(user2.textContent).toContain(userListMock[4].name.first);
    });

    it('should sort by location order asc and desc', () => {
      const sortLocationButton = component.queryAllByRole('row')[0].querySelector('th.header--location div.sort');
      fireEvent.click(sortLocationButton);

      const rows = component.queryAllByRole('row');
      const tbody = component.queryAllByRole('rowgroup')[1];
      let [user1, user2] = tbody.querySelectorAll('.user--location');
      expect(rows.length).toBe(4);
      expect(user1.textContent).toContain(userListMock[1].location.city);
      expect(user2.textContent).toContain(userListMock[4].location.city);

      fireEvent.click(sortLocationButton);
      [user1, user2] = tbody.querySelectorAll('.user--location');
      expect(rows.length).toBe(4);
      expect(user1.textContent).toContain(userListMock[0].location.city);
      expect(user2.textContent).toContain(userListMock[2].location.city);
    });

    it('should sort by registered order asc and desc', () => {
      const sortLocationButton = component.queryAllByRole('row')[0].querySelector('th.header--registered div.sort');
      fireEvent.click(sortLocationButton);

      const rows = component.queryAllByRole('row');
      const tbody = component.queryAllByRole('rowgroup')[1];
      let [user1, user2] = tbody.querySelectorAll('.user--registered');
      expect(rows.length).toBe(4);
      expect(user1.textContent).toContain('17/11/2005');
      expect(user2.textContent).toContain('03/08/2008');

      fireEvent.click(sortLocationButton);
      [user1, user2] = tbody.querySelectorAll('.user--registered');
      expect(rows.length).toBe(4);
      expect(user1.textContent).toContain('26/11/2017');
      expect(user2.textContent).toContain('04/05/2015');
    });
  });

  describe('Delete', () => {
    it('should call the onDelete fn with the respective user as parameter', () => {
      const deleteButton = component.queryAllByRole('rowgroup')[1].querySelector('button.user--actions--delete');

      fireEvent.click(deleteButton);

      expect(onDelete).toHaveBeenCalledWith(userListMock[0]);
    });
  });

  describe('Pagination', () => {
    it('should display the correct page', () => {
      const pagination = component.queryByRole('navigation');
      const previousButton = pagination.querySelector('.pagination--navigate-left');
      const nextButton = pagination.querySelector('.pagination--navigate-right');
      let currentPage = pagination.querySelector('.pagination--info');

      expect(currentPage.textContent).toBe('1 - 2 of 5');

      fireEvent.click(nextButton);
      expect(currentPage.textContent).toBe('3 - 4 of 5');

      fireEvent.click(nextButton);
      expect(currentPage.textContent).toBe('5 - 5 of 5');

      fireEvent.click(previousButton);
      expect(currentPage.textContent).toBe('3 - 4 of 5');

      fireEvent.click(previousButton);
      expect(currentPage.textContent).toBe('1 - 2 of 5');
    });
  });
});