import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar
} from '@mui/material';
// import { getCachedBankList } from '../../lib/db'; // Xóa dòng này
import UserLayout from '../../components/UserLayout';

export default function EditUser() {
  const [bank_code, setBankCode] = useState('');
  const [bank_account, setBankAccount] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch('/api/user/info', {
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
        if (res.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
        }
      }
    };

    fetchUserData();
  }, [router]);

  useEffect(() => {
    const fetchBanks = async () => {
      // Gọi API /api/banks thay vì gọi trực tiếp getCachedBankList
      const response = await fetch('/api/banks');
      if (response.ok) {
        const data = await response.json();
        setBanks(data);
      } else {
        setError('Failed to fetch banks.');
      }
    };

    fetchBanks();
  }, []);

  useEffect(() => {
    if (banks.length > 0 && bank_code) {
      const foundBank = banks.find((bank) => bank.bin === bank_code);
      setSelectedBank(foundBank);
    }
  }, [banks, bank_code]);

  const handleBankChange = (event) => {
    const newBankCode = event.target.value;
    setBankCode(newBankCode);
    const foundBank = banks.find((bank) => bank.code === newBankCode);
    setSelectedBank(foundBank);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const selectedBin = selectedBank ? selectedBank.bin : '';

    const response = await fetch('/api/user/edit', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bank_code: selectedBin, bank_account, name, password }),
    });

    if (response.ok) {
      alert('User information updated successfully!');
      router.push('/manage');
    } else {
      const data = await response.json();
      setError(data.error || 'Failed to update user information');
    }
  };

  return (
    <UserLayout>
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
            <FormControl fullWidth margin="normal">
              <InputLabel id="bank-label">Bank</InputLabel>
              <Select
                labelId="bank-label"
                id="bank"
                value={bank_code}
                label="Bank"
                onChange={handleBankChange}
              >
                {banks.map((bank) => (
                  <MenuItem key={bank.id} value={bank.code}>
                    {bank.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* Hiển thị logo và tên ngân hàng */}
            {selectedBank && (
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <Avatar
                  src={selectedBank.logo}
                  alt={selectedBank.name}
                  sx={{ width: 40, height: 40, mr: 2 }}
                />
                <Typography>{selectedBank.shortName || selectedBank.name}</Typography>
              </Box>
            )}
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
    </UserLayout>
  );
}