import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
} from '@mui/material';
import { useEffect, useState } from 'react';
import axiosInstance from 'src/utils/axios';

// Define the interface for the expected structure of userData
interface Dashboard {
  balance: number;
  deposits: {
    deposit_date: string;
    amount: number;
  }[];
}

interface UserData {
  id: number;
  recommenderId: string | null;
  dashboard: Dashboard;
}

export default function DashboardUser() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axiosInstance.get(
          '/users/me?populate[dashboard][populate]=deposits',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwt')}`, // Assuming token is stored in localStorage
            },
          }
        );

        const userAllData = response.data;
        setUserData(userAllData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setErrorMsg('Failed to load user data');
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (errorMsg) return <div>{errorMsg}</div>;

  const { balance, deposits } = userData?.dashboard || { balance: 0, deposits: [] };

  // Calculate the total amount of deposits
  const totalAmount = deposits.reduce((total, dep) => total + dep.amount, 0);

  return (
    <Box
      sx={{
        padding: 3,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Card sx={{ width: '80%', padding: 3 }}>
        <CardContent>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <Typography variant="h5" gutterBottom>
                Dashboard
              </Typography>

              {/* User Balance */}
              <Typography variant="h6">
                Your Balance: <strong>{balance || '0.00'}$</strong>
              </Typography>
            </div>
            <div>
              {/* User ID and Recommender ID */}
              <Box sx={{ marginTop: 3 }}>
                <Typography variant="body1">
                  <strong>User ID:</strong> {userData?.id || 'N/A'}
                </Typography>
                <Typography variant="body1">
                  <strong>Recommender ID:</strong> {userData?.recommenderId || 'N/A'}
                </Typography>
              </Box>
            </div>
          </div>

          {/* Deposits Table */}
          <TableContainer component={Paper} sx={{ marginTop: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Serial No</TableCell> {/* Added Serial No Column */}
                  <TableCell>Deposit Date</TableCell>
                  <TableCell>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {deposits.length > 0 ? (
                  deposits.map((dep, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell> {/* Display Serial Number */}
                      <TableCell>{dep.deposit_date || 'N/A'}</TableCell>
                      <TableCell>{dep.amount || '0.00'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3}>No deposits found</TableCell>{' '}
                    {/* Updated colSpan to 3 */}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Display Total Amount */}
          <Typography variant="h6" sx={{ marginTop: 2 }}>
            Total Deposit Amount: <strong>{totalAmount.toFixed(2)}$</strong>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
