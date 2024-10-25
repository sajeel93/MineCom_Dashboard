// src/components/ContactDetails.tsx
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Avatar,
  Divider,
} from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
import axiosInstance from 'src/utils/axios';

// Define the type for the Contact data
interface Contact {
  email: string;
  telegramGroup: string;
  userId: string;
  recommendedId: string;
}

export default function ContactDetails() {
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch contact details using useCallback
  const fetchContact = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/contact?populate=*'); // Assuming endpoint for single-type contact
      const contactData = {
        email: response?.data?.data?.users_permissions_user?.email || '',
        telegramGroup: response?.data?.data?.TelegramGroup || '',
        userId: response?.data?.data?.users_permissions_user?.id || '',
        recommendedId: response?.data?.data?.users_permissions_user?.recommenderId || '',
      };
      setContact(contactData);
    } catch (err) {
      setError('Failed to load contact details');
    } finally {
      setLoading(false);
    }
  }, []);

  // useEffect to call fetchContact when the component mounts
  useEffect(() => {
    fetchContact();
  }, [fetchContact]);

  // Handling loading state
  if (loading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Handling error state
  // if (error) {
  //   return (
  //     <Box
  //       sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
  //     >
  //       <Typography variant="h6" color="error">
  //         {error}
  //       </Typography>
  //     </Box>
  //   );
  // }

  // Displaying contact details once loaded

  const getUserId = localStorage.getItem('userId');
  const getRecommenderId = localStorage.getItem('recommenderId');
  return (
    <Box sx={{ padding: 4 }}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              padding: 3,
              boxShadow: 4,
              backgroundColor: 'background.paper',
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      backgroundColor: 'primary.main',
                      color: 'white',
                      fontSize: 32,
                    }}
                  >
                    {contact?.email.charAt(0).toUpperCase()}
                  </Avatar>
                </Grid>
                <Grid item>
                  <Typography variant="h5" gutterBottom>
                    Contact Details
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body1" gutterBottom>
                <strong>Email:</strong> {contact?.email || 'minecom@minescom.net'}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Telegram Group:</strong>{' '}
                {contact?.telegramGroup || 'https://t.me/+W15FNJYs27ljMjZh'}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>User ID:</strong> {contact?.userId || getUserId}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Recommended ID:</strong> {contact?.recommendedId || getRecommenderId}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
