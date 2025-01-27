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
import { generateQRCodeData, getQRFromCache } from '../../lib/api';

// Xóa import Redis ở đây

export default function GenerateQR() {
  const router = useRouter();
  const { user, amount } = router.query;
  const [qrData, setQrData] = useState(null);
  const [bankCode, setBankCode] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankName, setBankName] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Bắt đầu với false
  const [bankLogo, setBankLogo] = useState(null);

  // Hàm chuyển đổi chuỗi amount thành số
  const parseAmount = (amountStr) => {
    if (!amountStr) return 0;

    const multiplier = {
      k: 1000,
      m: 1000000,
      // Có thể thêm các đơn vị khác (ví dụ: b cho billion)
    };

    const lowerCaseAmount = amountStr.toLowerCase();
    const lastChar = lowerCaseAmount.slice(-1);

    if (multiplier[lastChar]) {
      const numPart = parseFloat(lowerCaseAmount.slice(0, -1));
      return numPart * multiplier[lastChar];
    } else {
      return parseFloat(amountStr);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Tạo key cho Redis
      const redisKey = `${user}:${amount}`;

      try {
        // Thử lấy dữ liệu từ Redis
        const cachedData = await getQRFromCache(redisKey);
        if (cachedData) {
          setQrData(cachedData.qrData);
          setBankName(cachedData.bankName);
          setBankLogo(cachedData.bankLogo);
          setBankAccount(cachedData.bankAccount);
          setUserName(cachedData.userName);
          setIsLoading(false);
          return; // Kết thúc nếu lấy được từ cache
        }

        // Nếu không có trong cache, fetch từ API
        const res = await fetch(`/api/getUserData`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: user }),
        });
        const data = await res.json();
        if (res.ok && data) {
          setBankCode(data.bank_code);
          setBankAccount(data.bank_account);
          setUserName(data.name);

          const bankInfoRes = await fetch(`/api/banks?bankCode=${data.bank_code}`);
          if (bankInfoRes.ok) {
            const bankInfo = await bankInfoRes.json();
            setBankName(bankInfo.shortName || bankInfo.name);
            setBankLogo(bankInfo.logo);
          } else {
            setError('Failed to fetch bank info.');
          }
        } else {
          setError(data?.error || 'User not found.');
        }
      } catch (error) {
        console.error(error);
        setError('Failed to load data.');
      } finally {
        setIsLoading(false);
      }
    };

    if (user && amount) {
      fetchData();
    }
  }, [user, amount]);

  useEffect(() => {
    const generateQR = async () => {
      setIsLoading(true);
      setError(null);
      if (bankAccount && bankCode && amount) {
        // Chuyển đổi amount string thành số
        const numericAmount = parseAmount(amount);

        try {
          const res = await fetch('/api/qr', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              bankAccount,
              bankCode,
              amount: numericAmount,
              user,
              amount,
            }),
          });

          if (res.ok) {
            const { qr_code_data } = await res.json();
            setQrData(qr_code_data);
          } else {
            const errorData = await res.json();
            setError(errorData.error || 'Failed to generate QR code.');
          }
        } catch (error) {
          console.error(error);
          setError(error.message || 'Failed to generate QR code.');
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
            Quét Mã QR Để Thanh Toán
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
                {userName ? userName.toUpperCase() : ''}
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
                {parseAmount(amount).toLocaleString('vi-VN', {
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
            Cung cấp bởi VuTN.net
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}