import { useState, useEffect } from 'react';
import { Box, Grid, Typography, Card } from '@mui/material';
import axiosInstance from 'src/utils/axios';
import DepositForm from './depositForm';
import WithdrawalForm from './withdrawalForm';

export default function TransactionPage() {
  const [userId, setUserId] = useState('');
  const [recommenderId, setRecommenderId] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/users/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`, // Assuming token is stored in localStorage
          },
        });

        // Assuming the response contains user's profile data
        const profileData = response.data;

        setUserId(profileData.id || '');
        setRecommenderId(profileData.recommenderId || '');
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        <h1 style={{ padding: 0, margin: 0 }}>Deposit & Withdrawal Page</h1>
        <h4 style={{ marginTop: 0 }}>
          User ID: {userId} <br /> Recommender ID: {recommenderId}
        </h4>
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Card sx={{ padding: 4 }}>
            <DepositForm />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ padding: 4 }}>
            <WithdrawalForm />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
