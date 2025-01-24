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
  Avatar,
} from '@mui/material';

export default function EditMember() {
  const [bank_code, setBankCode] = useState('');
  const [bank_account, setBankAccount] = useState('');
  const [usertype, setUsertype] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (isAdminLoggedIn !== 'true') {
      router.push('/admin/login');
    }

    const fetchMember = async () => {
      if (id) {
        const response = await fetch(`/api/admin/get_member?userid=${id}`);
        if (response.ok) {
          const data = await response.json();
          // Giữ nguyên giá trị bank_code, không cập nhật tự động
          setBankCode(data.bank_code);
          setBankAccount(data.bank_account);
          setUsertype(data.usertype);

          // Tìm ngân hàng tương ứng với bin đã lưu
          const bankInfoRes = await fetch(`/api/banks`);
          if (bankInfoRes.ok) {
            const banksData = await bankInfoRes.json();
            setBanks(banksData);
            const foundBank = banksData.find((bank) => bank.bin === data.bank_code);
            setSelectedBank(foundBank);
          } else {
            setError('Failed to fetch bank info.');
          }
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to fetch member');
        }
      }
    };

    fetchMember();
  }, [id, router]);

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

    // Lấy bin từ selectedBank
    const selectedBin = selectedBank ? selectedBank.bin : '';

    const response = await fetch('/api/admin/edit_member', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userid: id,
        bank_code: selectedBin, // Sử dụng bin thay vì bank_code
        bank_account,
        usertype,
        password,
      }),
    });

    if (response.ok) {
      alert('Member updated successfully!');
      router.push('/admin/members');
    } else {
      const errorData = await response.json();
      setError(errorData.error || 'Failed to update member');
    }
  };

  const handleBankChange = (event) => {
    const bankCode = event.target.value;
    setBankCode(bankCode);
    const foundBank = banks.find((bank) => bank.code === bankCode);
    setSelectedBank(foundBank);
  };

  return (
    <AdminLayout>
      <Container maxWidth="sm">
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Member: {id}
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
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
            fullWidth
            name="password"
            label="Password (leave blank to keep unchanged)"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
            Update Member
          </Button>
        </Box>
      </Container>
    </AdminLayout>
  );
}