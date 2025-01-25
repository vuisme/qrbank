import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useRouter } from 'next/router';
import { TextField, Button, Container, Typography, Box, Alert } from '@mui/material';

export default function DeleteMember() {
  const [userid, setUserid] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const tokenAdmin = localStorage.getItem('tokenAdmin');
    if (!tokenAdmin) {
      router.push('/admin/login');
    }
  }, [router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch('/api/admin/delete_member', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenAdmin}`, // Gửi token trong header
      },
      body: JSON.stringify({ userid }),
    });

    if (response.ok) {
      alert('Member deleted successfully!');
      setUserid('');
    } else {
      const errorData = await response.json();
      setError(errorData.error || 'Failed to delete member');
    }
  };

  return (
    <AdminLayout>
      <Container maxWidth="sm">
        <Typography variant="h4" component="h1" gutterBottom>
          Delete Member
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
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
            Delete Member
          </Button>
        </Box>
      </Container>
    </AdminLayout>
  );
}