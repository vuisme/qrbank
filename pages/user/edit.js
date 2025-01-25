import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
} from '@mui/material';

export default function EditUser() {
  const [bank_code, setBankCode] = useState('');
  const [bank_account, setBankAccount] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch('/api/getUserData', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setBankCode(data.bank_code);
        setBankAccount(data.bank_account);
        setName(data.name);
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to fetch user data');
      }
    };

    fetchUserData();
  }, [router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const response = await fetch('/api/user/edit', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bank_code, bank_account, name, password }),
    });

    if (response.ok) {
      alert('User information updated successfully!');
    } else {
      const data = await response.json();
      setError(data.error || 'Failed to update user information');
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
          Edit User Information
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="bank_code"
            label="Bank Code"
            name="bank_code"
            value={bank_code}
            onChange={(e) => setBankCode(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="bank_account"
            label="Bank Account"
            name="bank_account"
            value={bank_account}
            onChange={(e) => setBankAccount(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Full Name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            name="password"
            label="New Password (leave blank to keep unchanged)"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Update Information
          </Button>
        </Box>
      </Box>
    </Container>
  );
}