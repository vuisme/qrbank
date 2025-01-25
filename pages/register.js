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
  FormHelperText,
} from '@mui/material';

export default function Register() {
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [error, setError] = useState('');
  const [banks, setBanks] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchBanks = async () => {
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Regex mật khẩu (ít nhất 8 ký tự, có chữ và số)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        'Password must be at least 8 characters and include both letters and numbers.'
      );
      return;
    }

    // Kiểm tra tất cả các trường bắt buộc đã được điền
    if (!userid || !password || !email || !name || !bankCode || !bankAccount) {
        setError('Please fill in all required fields.');
        return;
      }

    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userid,
        password,
        email,
        name,
        bank_code: bankCode,
        bank_account: bankAccount,
      }),
    });

    if (response.ok) {
      alert('Registration successful. Please login.');
      router.push('/login');
    } else {
      const data = await response.json();
      setError(data.error || 'Registration failed.');
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
          Register
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
          <FormHelperText>
            Định dạng liên kết tạo mã QR là:{' '}
            <a href={`https://qr.vutn.net/${userid}/100k`} target="_blank" rel="noopener noreferrer">
              https://qr.vutn.net/{userid}/100k
            </a>
          </FormHelperText>
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
          <FormHelperText>
            Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ và số.
          </FormHelperText>
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormHelperText>
            Vui lòng nhập chính xác email để nhận thông báo.
          </FormHelperText>
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
          <FormHelperText>
            Họ tên đầy đủ (sẽ hiển thị khi tạo QR code).
          </FormHelperText>
          <FormControl fullWidth margin="normal">
            <InputLabel id="bank-code-label">Bank</InputLabel>
            <Select
              labelId="bank-code-label"
              id="bank-code"
              value={bankCode}
              label="Bank"
              onChange={(e) => setBankCode(e.target.value)}
            >
              {banks.map((bank) => (
                <MenuItem key={bank.id} value={bank.code}>
                  {bank.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            required
            fullWidth
            id="bank_account"
            label="Bank Account"
            name="bank_account"
            value={bankAccount}
            onChange={(e) => setBankAccount(e.target.value)}
          />
          <FormHelperText>
            Nhập chính xác số tài khoản để tạo mã QR.
          </FormHelperText>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Register
          </Button>
        </Box>
      </Box>
    </Container>
  );
}