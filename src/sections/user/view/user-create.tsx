import { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import axiosInstance from 'src/utils/axios'; // Ensure axios instance is correctly imported

interface Role {
  id: number;
  name: string;
}

interface NewUserFormProps {
  open: boolean;
  onClose: () => void;
  onUserCreated: () => void; // Callback to refresh the user list or perform an action after user creation
}

export function NewUserForm({ open, onClose, onUserCreated }: NewUserFormProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<number | string>(''); // Initially empty, will hold role ID
  const [recommenderId, setRecommenderId] = useState('');
  const [isVerified, setIsVerified] = useState<boolean>(false); // New state for isVerified
  const [roles, setRoles] = useState<Role[]>([]); // Holds fetched roles from Strapi

  // Fetch roles from Strapi
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axiosInstance.get('/users-permissions/roles'); // Adjust endpoint if necessary
        setRoles(response?.data?.roles); // Assuming the response format is an array of roles
      } catch (error) {
        console.error('Failed to fetch roles:', error);
      }
    };

    fetchRoles();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await axiosInstance.post('/users', {
        username,
        email,
        password,
        role, // Send the role ID instead of the name
        recommenderId,
        confirmed: isVerified, // Include isVerified in the request
      });
      onUserCreated();
      onClose();
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New User</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
          />
          <TextField
            margin="dense"
            label="Password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
          />
          <TextField
            select
            margin="dense"
            label="Role"
            fullWidth
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            {roles?.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="Recommender ID"
            fullWidth
            value={recommenderId}
            onChange={(e) => setRecommenderId(e.target.value)}
            required
          />

          {/* New isVerified field */}
          <FormControl component="fieldset" margin="dense">
            <FormLabel component="legend">Is Verified</FormLabel>
            <RadioGroup
              row
              value={isVerified.toString()}
              onChange={(e) => setIsVerified(e.target.value === 'true')}
            >
              <FormControlLabel value="true" control={<Radio />} label="True" />
              <FormControlLabel value="false" control={<Radio />} label="False" />
            </RadioGroup>
          </FormControl>

          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" color="primary">
              Create User
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
