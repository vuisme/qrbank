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
  Avatar,
} from '@mui/material';
import UserLayout from '../../components/UserLayout';
import Meta from '../../components/Meta';

export default function EditUser() {
  const [bankCode, setBankCode] = useState(''); // Sử dụng bankCode thay thế
  const [bankAccount, setBankAccount] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Thêm state confirmPassword
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

        // Fetch bank information after fetching user data
        if (data.bank_code) {
          const banksResponse = await fetch('/api/banks');
          if (banksResponse.ok) {
            const banksData = await banksResponse.json();
            setBanks(banksData);
            const foundBank = banksData.find(bank => bank.bin === data.bank_code);
            setSelectedBank(foundBank);
          } else {
            setError('Failed to fetch banks.');
          }
        }
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
    if (banks.length > 0 && bankCode) {
      const foundBank = banks.find((bank) => bank.bin === bankCode);
      setSelectedBank(foundBank);
    }
  }, [banks, bankCode]);

  const handleBankChange = (event) => {
    const newBankCode = event.target.value;
    setBankCode(newBankCode);
    const foundBank = banks.find((bank) => bank.code === newBankCode);
    setSelectedBank(foundBank);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    // Kiểm tra mật khẩu
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Regex mật khẩu (ít nhất 8 ký tự, có chữ và số)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (password && !passwordRegex.test(password)) {
      setError('Password must be at least 8 characters and include both letters and numbers.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Chỉ lấy bin nếu selectedBank tồn tại
    const selectedBin = selectedBank ? selectedBank.bin : '';

    const response = await fetch('/api/user/edit', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        bank_code: selectedBin, // Gửi bin
        bank_account: bankAccount, // Chỉ gửi bank_account khi được phép chỉnh sửa
        name,
        password,
      }),
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
      <Meta
        title="Cập nhật thông tin tài khoản gửi mã QR Thần Tốc - MãQR.TOP"
        description= "Cập nhật thông tin Công cụ Tạo và Gửi mã QR với số tiền tùy chọn cực kỳ nhanh chóng"
        keywords="quản lý, manage, quét mã qr, thanh toán, vietqr, ngân hàng, chuyển tiền, qr code, maqr"
        ogTitle="C ập nhật thông tin tài khoản Gửi mã QR Thần Tốc - MãQR.TOP"
        ogDescription="Trang cập nhật thông tin Công cụ Tạo và Gửi mã QR với số tiền tùy chọn cực kỳ nhanh chóng"
        ogImage="/qr-code-animation.gif"
        ogUrl="https://maqr.top/user/edit"
      />
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
                value={bankCode}
                label="Bank"
                onChange={handleBankChange}
                disabled={!!bankCode} // Disable nếu đã có bankCode
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

            {/* Thông báo nếu đã có bank_code và bank_account */}
            {bankCode && bankAccount && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Liên hệ với admin để thay đổi thông tin ngân hàng vì lý do bảo mật.
              </Alert>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              id="bank_account"
              label="Bank Account"
              name="bank_account"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              disabled={!!bankCode} // Disable nếu đã có bankCode
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
              label="New Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              margin="normal"
              fullWidth
              name="confirmPassword"
              label="Confirm New Password"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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