import { useState, useCallback } from 'react';
import axiosInstance from 'src/utils/axios';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type UserProps = {
  [x: string]: any;
  id: string;
  username: string;
  name: string;
  email: string;
  status: string;
  company: string;
  avatarUrl: string;
  confirmed: boolean;
  recommenderId: string;
};

type UserTableRowProps = {
  row: UserProps;
  usersTransactrion: any;
  selected: boolean;
  onSelectRow: () => void;
  onUserDeleted: (id: string) => void;
};

export function BankTableRow({
  row,
  selected,
  usersTransactrion,
  onSelectRow,
  onUserDeleted,
}: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const { dashboard } = row;

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  console.log(usersTransactrion, 'usersTransactrion');

  const handleDeleteUser = useCallback(async () => {
    try {
      await axiosInstance.delete(`/users/${row.id}`); // Delete user by id from Strapi
      onUserDeleted(row.id); // Call the parent method to update the user list
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      handleClosePopover(); // Close the popover after action
    }
  }, [row.id, onUserDeleted, handleClosePopover]);

  // Create a closure to hold the last displayed transaction ID
  let lastDisplayedTransactionId: number | null = null;

  return (
    <>
      {/* Iterate over dashboard items */}
      {dashboard?.map(
        (item: {
          recommenderId: string;
          dashboard: { balance: number; deposits: Array<{ amount: number; deposit_date: string }> };
        }) =>
          // Iterate over each deposit and display it in a new line
          item?.dashboard?.deposits?.map(
            (deposit: { amount: number; deposit_date: string }, depositIndex: number) => {
              // Match the recommenderId with usersTransactrion to find iban and account_holder_name
              const matchingTransaction = usersTransactrion?.find(
                (transaction: { recommenderId: string; id: number }) =>
                  transaction.recommenderId === item.recommenderId &&
                  transaction.id !== lastDisplayedTransactionId // Ensure we don't match the last displayed transaction
              );

              console.log(matchingTransaction, 'matchingTransaction');
              console.log(lastDisplayedTransactionId, 'lastDisplayedTransactionId');

              // Only display the row if a matching transaction is found
              if (!matchingTransaction) return null;

              // Update lastDisplayedTransactionId
              lastDisplayedTransactionId = matchingTransaction.id;

              return (
                <TableRow
                  hover
                  tabIndex={-1}
                  role="checkbox"
                  selected={selected}
                  key={depositIndex}
                >
                  <TableCell padding="checkbox">
                    <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
                  </TableCell>

                  {/* Display RecommenderId */}
                  <TableCell>{item.recommenderId}</TableCell>

                  {/* Display Balance */}
                  <TableCell component="th" scope="row">
                    <Box gap={2} display="flex" alignItems="center">
                      {item.dashboard.balance}
                    </Box>
                  </TableCell>

                  {/* Display Deposit Amount */}
                  <TableCell>{deposit.amount}</TableCell>

                  {/* Display Deposit Date */}
                  <TableCell>{deposit.deposit_date}</TableCell>

                  {/* Display IBAN */}
                  <TableCell>{matchingTransaction?.iban || '-'}</TableCell>

                  {/* Display Account Holder Name */}
                  <TableCell>{matchingTransaction?.account_holder_name || '-'}</TableCell>
                </TableRow>
              );
            }
          )
      )}
    </>
  );
}
