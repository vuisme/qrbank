import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import QRResult from '../../components/QRResult';
import { Container, Typography } from '@mui/material';

export default function GenerateQR() {
  const router = useRouter();
  const { user, amount } = router.query;
  const [qrData, setQrData] = useState(null);
  const [bankCode, setBankCode] = useState('');
  const [bankAccount, setBankAccount] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const res = await fetch(`/api/getUserData?user=${user}`);
      const data = await res.json();
      if (data) {
        setBankCode(data.bank_code);
        setBankAccount(data.bank_account);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    const generateQR = async () => {
      if (bankAccount && bankCode && amount) {
        const res = await fetch('/api/qr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bankAccount,
            bankCode,
            amount: parseFloat(amount),
          }),
        });

        if (res.ok) {
          const { qrImage } = await res.json();
          setQrData(qrImage);
        } else {
          console.error('Failed to generate QR code.');
        }
      }
    };
    if (bankAccount && bankCode && amount) {
      generateQR();
    }
  }, [bankAccount, bankCode, amount]);

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Generate QR Code for {user}
      </Typography>
      <Typography variant="h6" component="h2" gutterBottom>
        Amount: {amount}
      </Typography>
      {qrData ? <QRResult qrData={qrData} /> : <Typography>Loading...</Typography>}
    </Container>
  );
}