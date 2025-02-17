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
  const [bankCode, setBankCode] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [usertype, setUsertype] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const tokenAdmin = localStorage.getItem('tokenAdmin');
    if (!tokenAdmin) {
      router.push('/admin/login');
      return;
    }

    const fetchData = async () => {
      try {
        const banksResponse = await fetch('/api/banks');
        if (!banksResponse.ok) throw new Error('Failed to fetch banks.');
        const banksData = await banksResponse.json();
        setBanks(banksData);

        if (id) {
          const memberResponse = await fetch(`/api/admin/get_member?userid=${id}`, {
            headers: { Authorization: `Bearer ${tokenAdmin}` },
          });
          if (!memberResponse.ok) throw new Error('Failed to fetch member data.');

          const data = await memberResponse.json();
          setBankAccount(data.bank_account);
          setUsertype(data.usertype);
          setName(data.name);

          const foundBank = banksData.find((bank) => bank.bin === data.bank_code);
          if (foundBank) {
            setSelectedBank(foundBank);
            setBankCode(foundBank.code);
          } else {
            console.error('Bank not found for the given bank_code');
          }
        }
      } catch (error) {
        console.error(error);
        setError(error.message);
      }
    };

    fetchData();
  }, [id, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const tokenAdmin = localStorage.getItem('tokenAdmin');
    if (!tokenAdmin) {
      router.push('/admin/login');
      return;
    }

    const bankBin = selectedBank ? selectedBank.bin : '';

    const dataToSubmit = {
      userid: id,
      bank_code: bankBin,
      bank_account: bankAccount,
      usertype,
      password,
      name,
    };
    console.log('Data to submit:', dataToSubmit); // Log data

    const response = await fetch('/api/admin/edit_member', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenAdmin}`,
      },
      body: JSON.stringify(dataToSubmit), // Truyền data đã log
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
    const newBankCode = event.target.value;
    setBankCode(newBankCode);
    const foundBank = banks.find((bank) => bank.code === newBankCode);
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
              value={bankCode}
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
            value={bankAccount}
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
            id="name"
            label="Name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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