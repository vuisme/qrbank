import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
} from '@mui/material';

export default function Login() {
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { redirect } = router.query;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userid, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      // Chuyển hướng đến trang /manage hoặc trang redirect
      router.push(redirect || '/manage');
    } else {
      const data = await response.json();
      setError(data.error || 'Login failed.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="userid"
            label="User ID"
            name="userid"
            autoFocus
            value={userid}
            onChange={(e) => setUserid(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
}