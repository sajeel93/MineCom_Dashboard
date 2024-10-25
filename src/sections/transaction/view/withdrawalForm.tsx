import { Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import axiosInstance from 'src/utils/axios'; // Your Axios setup
import { useNavigate } from 'react-router-dom';

export default function WithdrawalForm() {
  const [iban, setIban] = useState('');
  const [bic, setBic] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const navigate = useNavigate();

  const getRecommenderId = localStorage.getItem('recommenderId');

  const handleWithdrawalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const reqData = {
      data: {
        iban,
        bic,
        bank_name: bankName,
        account_holder_name: accountHolderName,
        recommenderId: getRecommenderId,
        type: 'withdrawal',
      },
    };
    try {
      await axiosInstance.post('/transactions-forms', reqData);
      alert('Withdrawal request sent successfully');
      navigate('/');
    } catch (error) {
      console.error('Error submitting withdrawal:', error);
      alert('Failed to submit withdrawal request');
    }
  };

  return (
    <Box component="form" onSubmit={handleWithdrawalSubmit}>
      <Typography variant="h5" gutterBottom>
        Withdrawal
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
      <TextField
        fullWidth
        label="BIC"
        variant="outlined"
        margin="normal"
        value={bic}
        onChange={(e) => setBic(e.target.value)}
        required
      />
      <TextField
        fullWidth
        label="Bank Name"
        variant="outlined"
        margin="normal"
        value={bankName}
        onChange={(e) => setBankName(e.target.value)}
        required
      />
      <TextField
        fullWidth
        label="Account Holder Full Name"
        variant="outlined"
        margin="normal"
        value={accountHolderName}
        onChange={(e) => setAccountHolderName(e.target.value)}
        required
      />
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Submit Withdrawal
      </Button>
    </Box>
  );
}
