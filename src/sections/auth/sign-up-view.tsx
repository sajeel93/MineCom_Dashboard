import { useState, useCallback } from 'react';
import axiosInstance from 'src/utils/axios';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';

export function SignUpView() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  // Check password strength
  const checkPasswordStrength = (pass: string) => {
    if (pass.length < 7) {
      setPasswordStrength('Weak');
    } else {
      setPasswordStrength('Strong');
    }
  };

  // Handle sign up using the custom axios instance
  const handleSignUp = useCallback(async () => {
    setLoading(true);
    setError('');

    // Password validation regex: at least 8 characters, one uppercase, one lowercase
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    // Basic validation for password confirmation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Check if password matches the required format
    if (!passwordRegex.test(password)) {
      setError(
        'Password must be at least 8 characters long and contain at least one uppercase and one lowercase letter'
      );
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post('/users', {
        username,
        email,
        password,
        role: 2,
        confirmed: true,
      });

      // Save JWT token and user info after successful registration
      const { jwt, user } = response.data;

      localStorage.setItem('jwt', jwt);
      localStorage.setItem('userId', user?.id);
      localStorage.setItem('tokenIssueTime', Date.now().toString());

      // Redirect to the sign-in page after sign up
      router.push('/sign-in');
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.error?.message
          ? err.response.data.error.message
          : 'Sign up failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [username, email, password, confirmPassword, router]);

  const renderForm = (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <TextField
        fullWidth
        name="username"
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      />

      <TextField
        fullWidth
        name="email"
        label="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      />

      <TextField
        fullWidth
        name="password"
        label="Password"
        value={password}
        onChange={(e) => {
          const passValue = e.target.value; // Rename here to avoid conflict
          setPassword(passValue);
          checkPasswordStrength(passValue); // Check password strength
        }}
        InputLabelProps={{ shrink: true }}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />
      {/* Password Strength Indicator */}
      <Typography
        variant="caption"
        color={passwordStrength === 'Strong' ? 'success.main' : 'error.main'}
      >
        Password Strength: {passwordStrength}
      </Typography>

      <TextField
        fullWidth
        name="confirmPassword"
        label="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        InputLabelProps={{ shrink: true }}
        type={showConfirmPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                <Iconify icon={showConfirmPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      {error && (
        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        loading={loading}
        onClick={handleSignUp}
      >
        Sign up
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Sign up</Typography>
        <Typography variant="body2" color="text.secondary">
          Already have an account?
          <Link href="/sign-in" variant="subtitle2" sx={{ ml: 0.5 }}>
            Sign in
          </Link>
        </Typography>
      </Box>

      {renderForm}
    </>
  );
}
