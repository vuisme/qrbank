import { Container, Typography, Box, Button, Grid } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useSpring, animated } from 'react-spring';
import Meta from '../components/Meta';

export default function Home() {
  const props = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    delay: 500,
  });

  const linkProps = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    delay: 1000,
    config: { tension: 200, friction: 20 },
  });

  return (
    <>
      <Meta
        title="Gửi mã QR Thần Tốc - MãQR.TOP"
        description= "Công cụ Tạo và Gửi mã QR với số tiền tùy chọn cực kỳ nhanh chóng"
        keywords="quét mã qr, thanh toán, vietqr, ngân hàng, chuyển tiền, qr code, maqr"
        ogTitle="Gửi mã QR Thần Tốc - MãQR.TOP"
        ogDescription="Công cụ Tạo và Gửi mã QR với số tiền tùy chọn cực kỳ nhanh chóng"
        ogImage="/qr-code-animation.gif"
        ogUrl="https://maqr.top"
      />
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
          src="/qr-code-animation.gif"
          alt="QR Code Animation"
          width={300}
          height={300}
        />
        <animated.div style={props}>
          <Typography variant="h3" component="h1" gutterBottom>
            MãQR.TOP!
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Gửi mã QR cực kỳ nhanh chóng và dễ dàng!
          </Typography>

          <animated.div style={linkProps}>
            <Box
              sx={{
                mt: 4,
                p: 3,
                border: '1px solid #ccc',
                borderRadius: '8px',
                backgroundColor: '#f8f8f8',
              }}
            >
              <Typography variant="body1" component="p">
                Chỉ cần gửi link sau để tạo mã QR:
              </Typography>
              <Typography
                variant="h6"
                component="p"
                sx={{ fontFamily: 'monospace', mt: 1 }}
              >
                maqr.top/
                <Typography
                  variant="inherit"
                  component="span"
                  sx={{ color: '#0d6efd' }}
                >
                  &lt;user&gt;
                </Typography>
                /
                <Typography
                  variant="inherit"
                  component="span"
                  sx={{ color: '#dc3545' }}
                >
                  &lt;số tiền&gt;
                </Typography>
              </Typography>
              <Typography variant="body1" component="p" sx={{ mt: 2 }}>
                Trong đó, <Typography variant="inherit" component='span' sx={{color: '#0d6efd', fontWeight: 'bold'}}>&lt;user&gt;</Typography> là tên người dùng của bạn và <Typography variant="inherit" component='span' sx={{color: '#dc3545', fontWeight: 'bold'}}>&lt;số tiền&gt;</Typography> là số tiền cần thanh toán. Hệ thống sẽ tự động tạo mã QR tương ứng để khách hàng của bạn có thể quét và thanh toán nhanh chóng.
              </Typography>
            </Box>
          </animated.div>

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
    </>
  );
}