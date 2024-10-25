import { Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import axiosInstance from 'src/utils/axios'; // Your Axios setup
import { useNavigate } from 'react-router-dom';

export default function DepositForm() {
  const [iban, setIban] = useState('');
  const navigate = useNavigate();
  const getRecommenderId = localStorage.getItem('recommenderId');

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const reqData = {
      data: {
        iban,
        recommenderId: getRecommenderId,
        type: 'deposit',
      },
    };

    try {
      await axiosInstance.post('/transactions-forms', reqData);
      alert('Deposit request sent successfully');
      navigate('/');
    } catch (error) {
      console.error('Error submitting deposit:', error);
      alert('Failed to submit deposit request');
    }
  };

  return (
    <Box component="form" onSubmit={handleDepositSubmit}>
      <Typography variant="h5" gutterBottom>
        Deposit
      </Typography>
      <TextField
        fullWidth
        label="IBAN"
        variant="outlined"
        margin="normal"
        value={iban}
        onChange={(e) => setIban(e.target.value)}
        required
      />
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Submit Deposit
      </Button>
    </Box>
  );
}
