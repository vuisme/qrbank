import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import withReCAPTCHA from '../components/withReCAPTCHA';
import Meta from '../components/Meta';

function Login({ recaptchaToken }) {
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { redirect } = router.query;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userid,
        password,
        recaptchaToken, // **Vẫn gửi recaptchaToken từ frontend (không bắt buộc, có thể bỏ qua)**
      }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      router.push(redirect || '/manage');
    } else {
      const data = await response.json();
      // **Đơn giản hóa xử lý lỗi, không cần kiểm tra lỗi reCAPTCHA nữa**
      if (response.status === 429) {
        setError(data.error || 'Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau.');
      }
       else {
        setError(data.error || 'User ID hoặc mật khẩu không hợp lệ');
      }
    }
  };

  return (
    <>
      <Meta
        title="Đăng nhập tài khoản gửi mã QR Thần Tốc - MãQR.TOP"
        description= "Trang đăng nhập sử dụng Công cụ Tạo và Gửi mã QR với số tiền tùy chọn cực kỳ nhanh chóng"
        keywords="quét mã qr, thanh toán, vietqr, ngân hàng, chuyển tiền, qr code, maqr, dang ky"
        ogTitle="Đăng nhập tài khoản gửi mã QR Thần Tốc - MãQR.TOP"
        ogDescription="Công cụ Tạo và Gửi mã QR với số tiền tùy chọn cực kỳ nhanh chóng"
        ogImage="/qr-code-animation.gif"
        ogUrl="https://maqr.top/login"
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
            Login
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
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Login
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default withReCAPTCHA(Login, 'login'); // Vẫn giữ lại HOC ở frontend để hiển thị reCAPTCHA