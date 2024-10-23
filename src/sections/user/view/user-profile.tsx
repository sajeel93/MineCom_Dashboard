import { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Card } from '@mui/material';
import axiosInstance from 'src/utils/axios';

type ProfilePageProps = {
  userId: string; // Pass generated user ID from parent or API
  recommenderId: string; // Pass generated recommender ID from parent or API
};

export function ProfilePage() {
  // Form state
  const [email, setEmail] = useState('');
  const [residentialAddress, setResidentialAddress] = useState('');
  const [surname, setSurname] = useState('');
  const [name, setName] = useState('');
  const [username, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [recommenderId, setRecommenderId] = useState('');

  // Fetch user profile data from Strapi
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/users/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`, // Assuming token is stored in localStorage
          },
        });

        console.log(response, 'response');

        // Assuming the response contains user's profile data
        const profileData = response.data;

        // Populate the form fields with profile data
        setEmail(profileData.email);
        setResidentialAddress(profileData.residentialAddress || ''); // If residentialAddress is part of the user profile
        setSurname(profileData.surname || '');
        setName(profileData.name || '');
        setUserName(profileData.username || '');
        setUserId(profileData.id || '');
        setRecommenderId(profileData.recommenderId || '');
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []); // Runs on component mount

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = {
      email,
      residentialAddress,
      surname,
      name,
      username,
      id: userId,
      recommenderId,
    };

    try {
      // Send a PUT request to update user profile data
      const response = await axiosInstance.put(`/users/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
      });

      // Handle the response after the profile update
      console.log('Profile updated successfully:', response.data);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <Card sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" mb={3}>
        Profile Page
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* Email Field */}
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          margin="normal"
          disabled
        />

        {/* Residential Address Field */}
        <TextField
          label="Residential Address"
          value={residentialAddress}
          onChange={(e) => setResidentialAddress(e.target.value)}
          fullWidth
          margin="normal"
        />

        {/* Surname Field */}
        <TextField
          label="Surname"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          fullWidth
          required
          margin="normal"
        />

        {/* Name Field */}
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
          margin="normal"
        />

        {/* UserName Field */}
        <TextField
          label="UserName"
          value={username}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
          margin="normal"
        />

        {/* Auto-generated User ID and Recommender ID */}
        <Box display="flex" gap={2} mt={2}>
          <TextField
            label="Your ID"
            value={userId}
            fullWidth
            InputProps={{ readOnly: true }} // Read-only, auto-generated
            disabled
          />
          <TextField
            label="Your Recommender ID"
            value={recommenderId}
            fullWidth
            InputProps={{ readOnly: true }} // Read-only, auto-generated
            disabled
          />
        </Box>

        {/* Submit Button */}
        <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 3 }}>
          Submit
        </Button>
      </form>
    </Card>
  );
}
