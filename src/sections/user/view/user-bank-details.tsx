import { useState, useEffect, useCallback } from 'react';
import axiosInstance from 'src/utils/axios';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Modal from '@mui/material/Modal'; // Import Modal
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData } from '../table-no-data';
import { BankTableRow } from '../bank-table-row';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import { NewUserForm } from './user-create';
import type { UserProps } from '../bank-table-row';

// ----------------------------------------------------------------------

export function UserBankData() {
  const table = useTable();

  const [users, setUsers] = useState<UserProps[]>([]);
  const [usersTransactrion, setUsersTransactrion] = useState<UserProps[]>([]);
  const [filterName, setFilterName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false); // Manage modal open state

  // Fetch users from the Strapi API
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        '/banks-data?populate=users_permissions_users.dashboard.deposits'
      );

      const transactionsRes = await axiosInstance.get('/banks-data?populate=transactions_forms');

      // Assuming response.data contains the structure with users and nested deposits data
      const usersWithDeposits = response?.data?.data?.map((user: UserProps) => ({
        ...user,
        dashboard:
          user.users_permissions_users?.filter((item: { dashboard: any }) => item?.dashboard) || [], // Access deposits
      }));

      setUsers(usersWithDeposits);

      const usersWithTransactions = transactionsRes?.data?.data[0]?.transactions_forms;
      setUsersTransactrion(usersWithTransactions);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initially fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Triggered after user is created to refetch the updated users list
  const handleUserCreated = () => {
    fetchUsers(); // Re-fetch users after a new user is created
  };

  // Handle deletion of a user
  const handleUserDeleted = useCallback((id: string) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  }, []);

  const dataFiltered: UserProps[] = applyFilter({
    inputData: users,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Bank Record
        </Typography>
      </Box>

      <Card>
        <UserTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            {loading ? (
              <Typography variant="body2">Loading...</Typography>
            ) : (
              <Table sx={{ minWidth: 800 }}>
                <UserTableHead
                  order={table.order}
                  orderBy={table.orderBy}
                  rowCount={users.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      users.map((user) => user.id)
                    )
                  }
                  headLabel={[
                    { id: 'recommenderId', label: 'Recommender ID' },
                    { id: 'balance', label: 'Balance' },
                    { id: 'deposit_amount', label: 'Deposit Amount' }, // New column for deposit amount
                    { id: 'deposit_date', label: 'Deposit Date' }, // New column for deposit date
                    { id: 'iban', label: 'IBAN' }, // New column for deposit date
                    { id: 'account_holder', label: 'Account Holder' }, // New column for deposit date
                  ]}
                />
                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <BankTableRow
                        key={row.id}
                        row={row}
                        usersTransactrion={usersTransactrion}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onUserDeleted={handleUserDeleted}
                      />
                    ))}

                  <TableEmptyRows
                    height={68}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, users.length)}
                  />

                  {notFound && <TableNoData searchQuery={filterName} />}
                </TableBody>
              </Table>
            )}
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={users.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      {/* Modal for New User Form */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            maxWidth: 400,
            mx: 'auto',
            mt: '10%',
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 2,
          }}
        >
          <NewUserForm
            open={openModal}
            onClose={() => setOpenModal(false)}
            onUserCreated={handleUserCreated}
          />
        </Box>
      </Modal>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
