import { Container, Typography, Box, Button, Grid } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link'; // Import Link
import { useSpring, animated } from 'react-spring';

export default function Home() {
  const props = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    delay: 500,
  });

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
        }}
      >
        <Image
          src="/qr-code-animation.gif" // Thay bằng hình ảnh động của bạn
          alt="QR Code Animation"
          width={300}
          height={300}
        />
        <animated.div style={props}>
          <Typography variant="h3" component="h1" gutterBottom>
            Chào mừng đến với QuickQR!
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Tạo mã QR thanh toán ngân hàng nhanh chóng và dễ dàng!
          </Typography>
          <Typography variant="body1" paragraph>
            Dịch vụ của chúng tôi sẽ giúp bạn tạo mã QR cho các giao dịch ngân hàng
            một cách tiện lợi.
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <Link href="/login" passHref>
                  <Button variant="contained" color="primary" size="large">
                    Đăng nhập
                  </Button>
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register" passHref>
                  <Button variant="outlined" color="primary" size="large">
                    Đăng ký
                  </Button>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </animated.div>
      </Box>
    </Container>
  );
}