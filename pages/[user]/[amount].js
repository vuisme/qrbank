import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import QRResult from '../../components/QRResult';
import { Container, Typography, Box, CircularProgress, Alert } from '@mui/material';

export default function GenerateQR() {
  const router = useRouter();
  const { user, amount } = router.query;
  const [qrData, setQrData] = useState(null);
  const [bankCode, setBankCode] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankName, setBankName] = useState(''); // Thêm state bankName
  const [error, setError] = useState(null); // Thêm state error
  const [isLoading, setIsLoading] = useState(true); // Thêm state isLoading

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true); // Bắt đầu loading
      setError(null); // Reset lỗi
      const res = await fetch(`/api/getUserData?user=${user}`);
      const data = await res.json();
      if (res.ok && data) {
        setBankCode(data.bank_code);
        setBankAccount(data.bank_account);

        // Lấy thông tin ngân hàng từ bankCode
        const bankInfoRes = await fetch(`/api/bankInfo?bankCode=${data.bank_code}`);
        if (bankInfoRes.ok) {
          const bankInfo = await bankInfoRes.json();
          setBankName(bankInfo.shortName || bankInfo.name);
        } else {
          setError('Failed to fetch bank info.');
        }
      } else {
        setError(data?.error || 'User not found.');
      }
      setIsLoading(false); // Kết thúc loading
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    const generateQR = async () => {
      setIsLoading(true); // Bắt đầu loading
      setError(null); // Reset lỗi
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
          const { qr_code_data } = await res.json(); // Sửa thành qr_code_data
          setQrData(qr_code_data);
        } else {
          const errorData = await res.json();
          setError(errorData.error || 'Failed to generate QR code.');
        }
      }
      setIsLoading(false); // Kết thúc loading
    };
    if (bankAccount && bankCode && amount) {
      generateQR();
    }
  }, [bankAccount, bankCode, amount]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 4,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          QR Code Thanh Toán
        </Typography>

        {/* Hiển thị thông tin ngân hàng */}
        {bankName && (
          <Typography variant="body1" gutterBottom>
            Ngân hàng: {bankName}
          </Typography>
        )}
        {bankAccount && (
          <Typography variant="body1" gutterBottom>
            Số tài khoản: {bankAccount}
          </Typography>
        )}
        {amount && (
          <Typography variant="h6" component="h2" gutterBottom>
            Số tiền: {parseFloat(amount).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
          </Typography>
        )}

        {/* Hiển thị QR code hoặc loading indicator */}
        {isLoading ? (
          <CircularProgress sx={{ mt: 2 }} />
        ) : qrData ? (
          <QRResult qrData={qrData} />
        ) : (
          <Typography>Đang tạo mã QR...</Typography>
        )}

        {/* Hiển thị lỗi nếu có */}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        <Typography variant="body1" align="center" sx={{ mt: 2 }}>
          Vui lòng quét mã QR để thanh toán.
        </Typography>
      </Box>
    </Container>
  );
}