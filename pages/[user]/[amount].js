import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import QRResult from '../../components/QRResult';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Divider,
  Paper,
} from '@mui/material';

export default function GenerateQR() {
  const router = useRouter();
  const { user, amount } = router.query;
  const [qrData, setQrData] = useState(null);
  const [bankCode, setBankCode] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankName, setBankName] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bankLogo, setBankLogo] = useState(null); // Thêm state bankLogo

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      setError(null);
      const res = await fetch(`/api/getUserData?user=${user}`);
      const data = await res.json();
      if (res.ok && data) {
        setBankCode(data.bank_code);
        setBankAccount(data.bank_account);

        const bankInfoRes = await fetch(`/api/banks?bankCode=${data.bank_code}`);
        if (bankInfoRes.ok) {
          const bankInfo = await bankInfoRes.json();
          setBankName(bankInfo.shortName || bankInfo.name);
          setBankLogo(bankInfo.logo); // Lấy logo từ bankInfo
        } else {
          setError('Failed to fetch bank info.');
        }
      } else {
        setError(data?.error || 'User not found.');
      }
      setIsLoading(false);
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    const generateQR = async () => {
      setIsLoading(true);
      setError(null);
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
          const errorData = await res.json();
          setError(errorData.error || 'Failed to generate QR code.');
        }
      }
      setIsLoading(false);
    };
    if (bankAccount && bankCode && amount) {
      generateQR();
    }
  }, [bankAccount, bankCode, amount]);

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={4} sx={{ p: 3, mt: 4, borderRadius: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
            Quét mã QR để thanh toán
          </Typography>

          <Box
            sx={{
              border: '1px solid #ccc',
              borderRadius: 2,
              p: 2,
              mb: 2,
              width: '100%',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              {/* Hiển thị logo ngân hàng */}
              {bankLogo ? (
                <img src={bankLogo} alt={bankName} width={80} />
              ) : isLoading ? (
                <CircularProgress size={24} />
              ) : (
                <Typography variant="body1">
                  {/* Thêm khoảng trắng để căn giữa */}
                  &nbsp; 
                </Typography>
              )}
            </Box>
            <Divider sx={{ mb: 2 }} />
            {isLoading ? (
              <CircularProgress sx={{ mt: 2 }} />
            ) : qrData ? (
              <QRResult qrData={qrData} />
            ) : (
              <Typography>Đang tạo mã QR...</Typography>
            )}
            <Divider sx={{ mt: 2 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Tên chủ TK:
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {user ? user.toUpperCase() : ''}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="subtitle2" color="textSecondary">
                Số tài khoản:
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {bankAccount}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="subtitle2" color="textSecondary">
                Số tiền:
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {parseFloat(amount).toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
              <Typography variant="caption" color="textSecondary">
                {bankName && `(${bankName})`}
              </Typography>
            </Box>
          </Box>

          {/* Hiển thị lỗi nếu có */}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Typography variant="caption" color="textSecondary" align="center">
            Mở ứng dụng ngân hàng quét mã QR
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}