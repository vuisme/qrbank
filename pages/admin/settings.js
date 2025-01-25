import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useRouter } from 'next/router';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
} from '@mui/material';

export default function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [apiServer, setApiServer] = useState('');
  const [error, setError] = useState(''); // Thêm state error
  const router = useRouter();

  useEffect(() => {
    const tokenAdmin = localStorage.getItem('tokenAdmin');
    if (!tokenAdmin) {
      router.push('/admin/login');
    }

    const fetchSettings = async () => {
      const res = await fetch('/api/admin/get_settings', {
        headers: {
          Authorization: `Bearer ${tokenAdmin}`, // Gửi token trong header
        },
      });
      if (res.ok) {
        const data = await res.json();
        setApiKey(data.api_key || '');
        setApiServer(data.api_server || '');
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to fetch settings'); // Cập nhật state error
      }
    };

    fetchSettings();
  }, [router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch('/api/admin/update_settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenAdmin}` },
      body: JSON.stringify({ apiKey, apiServer }),
    });

    if (response.ok) {
      const data = await response.json();
      alert(data.message);
    } else {
      const errorData = await response.json();
      setError(errorData.error || 'Failed to update settings'); // Cập nhật state error
    }
  };

  return (
    <AdminLayout>
      <Container maxWidth="sm">
        <Typography variant="h4" component="h1" gutterBottom>
          Settings
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="apiKey"
            label="API Key"
            name="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="apiServer"
            label="API Server"
            name="apiServer"
            value={apiServer}
            onChange={(e) => setApiServer(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
            Save
          </Button>
        </Box>
      </Container>
    </AdminLayout>
  );
}