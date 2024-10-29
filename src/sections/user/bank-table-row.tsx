import { useState, useCallback, useEffect } from 'react';
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
  const [filteredDeposits, setFilteredDeposits] = useState<any[]>([]); // Store filtered deposits

  const { dashboard } = row;

  useEffect(() => {
    const filteredDepositsList: any[] = [];

    dashboard?.forEach(
      (item: {
        recommenderId: string;
        dashboard: { balance: number; deposits: Array<{ amount: number; deposit_date: string }> };
      }) => {
        item?.dashboard?.deposits?.forEach(
          (deposit: { amount: number; deposit_date: string }, depositIndex: number) => {
            // Get the matching transaction for this specific recommenderId
            const matchingTransaction = usersTransactrion?.find(
              (transaction: { recommenderId: string }) =>
                transaction?.recommenderId === item?.recommenderId
            );

            // Push each deposit to the list, even if there is no matching transaction
            filteredDepositsList.push({
              deposit,
              depositIndex, // Add the depositIndex explicitly
              item, // User information
              matchingTransaction: matchingTransaction || null, // Use null if no matching transaction
            });
          }
        );
      }
    );

    // Update the filtered deposits state once
    setFilteredDeposits(filteredDepositsList);
  }, [dashboard, usersTransactrion]);

  return (
    <>
      {/* Iterate over the filtered deposits and render table rows */}
      {filteredDeposits.map(({ deposit, item, matchingTransaction }, depositIndex) => (
        <TableRow hover tabIndex={-1} role="checkbox" selected={selected} key={depositIndex}>
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
      ))}
    </>
  );
}
