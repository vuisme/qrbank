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
import { generateQRCodeData, getQRFromCache } from '../../lib/api'; // Import getQRFromCache

export default function GenerateQR() {
  const router = useRouter();
  const { user, amount } = router.query;
  const [qrData, setQrData] = useState(null);
  const [bankCode, setBankCode] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankName, setBankName] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bankLogo, setBankLogo] = useState(null);
  const [numericAmount, setNumericAmount] = useState(0);

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
          setNumericAmount(parseAmount(cachedData.amount)); // Sử dụng amount từ cache
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

          const bankInfoRes = await fetch(
            `/api/banks?bankCode=${data.bank_code}`
          );
          if (bankInfoRes.ok) {
            const bankInfo = await bankInfoRes.json();
            setBankName(bankInfo.shortName || bankInfo.name);
            setBankLogo(bankInfo.logo);
          } else {
            setError('Failed to fetch bank info.');
          }

          // Chuyển đổi amount string thành số và tạo QR code ngay sau khi có thông tin user
          const numAmount = parseAmount(amount);
          setNumericAmount(numAmount);
          if (data.bank_account && data.bank_code) {
            const qrRes = await fetch('/api/qr', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                bankAccount: data.bank_account,
                bankCode: data.bank_code,
                amount: numAmount,
                user,
                userName: data.name,
                bankName: bankInfo.shortName || bankInfo.name,
                bankLogo: bankInfo.logo,
              }),
            });

            if (qrRes.ok) {
              const { qr_code_data } = await qrRes.json();
              setQrData(qr_code_data);
            } else {
              const errorData = await qrRes.json();
              setError(errorData.error || 'Failed to generate QR code.');
            }
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
          <Typography
            component="h1"
            variant="h5"
            sx={{ fontWeight: 'bold', mb: 2 }}
          >
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
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1,
              }}
            >
              {/* Hiển thị logo ngân hàng */}
              {bankLogo ? (
                <img src={bankLogo} alt={bankName} width={80} />
              ) : isLoading ? (
                <CircularProgress size={24} />
              ) : (
                <Typography variant="body1">&nbsp;</Typography>
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
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mt: 1,
              }}
            >
              <Typography variant="subtitle2" color="textSecondary">
                Tên chủ TK:
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {userName ? userName.toUpperCase() : ''}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="subtitle2" color="textSecondary">
                Số tài khoản:
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {bankAccount}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="subtitle2" color="textSecondary">
                Số tiền:
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {/* Sử dụng numericAmount ở đây */}
                {numericAmount.toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mt: 1,
              }}
            >
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