import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useRouter } from 'next/router';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';

export default function AddMember() {
  const [userid, setUserid] = useState('');
  const [bank_code, setBankCode] = useState('');
  const [bank_account, setBankAccount] = useState('');
  const [usertype, setUsertype] = useState('free');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (isAdminLoggedIn !== 'true') {
      router.push('/admin/login');
    }
  }, [router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch('/api/admin/add_member', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userid,
        bank_code,
        bank_account,
        usertype,
        password,
      }),
    });

    if (response.ok) {
      alert('Member added successfully!');
      // Reset form
      setUserid('');
      setBankCode('');
      setBankAccount('');
      setUsertype('free');
      setPassword('');
    } else {
      const errorData = await response.json();
      setError(errorData.error || 'Failed to add member');
    }
  };

  return (
    <AdminLayout>
      <Container maxWidth="sm">
        <Typography variant="h4" component="h1" gutterBottom>
          Add Member
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="userid"
            label="User ID"
            name="userid"
            value={userid}
            onChange={(e) => setUserid(e.target.value)}
          />
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
          <FormControl fullWidth margin="normal">
            <InputLabel id="usertype-label">User Type</InputLabel>
            <Select
              labelId="usertype-label"
              id="usertype"
              value={usertype}
              label="User Type"
              onChange={(e) => setUsertype(e.target.value)}
            >
              <MenuItem value="free">Free</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
            </Select>
          </FormControl>
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
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
            Add Member
          </Button>
        </Box>
      </Container>
    </AdminLayout>
  );
}