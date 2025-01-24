import { Container, Typography, Box, Button } from '@mui/material';
import Image from 'next/image';
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
          src="/qr-code-animation.gif"
          alt="QR Code Animation"
          width={300}
          height={300}
        />
        <animated.div style={props}>
          <Typography variant="h3" component="h1" gutterBottom>
            Chào mừng đến với QR Bank!
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Tạo mã QR thanh toán ngân hàng nhanh chóng và dễ dàng!
          </Typography>
          <Typography variant="body1" paragraph>
            Dịch vụ của chúng tôi hiện đang trong giai đoạn phát triển và sẽ sớm ra mắt.
          </Typography>
          <Typography variant="body1" paragraph>
            Hãy theo dõi để cập nhật những thông tin mới nhất!
          </Typography>
          <Button variant="contained" color="primary" size="large" disabled>
            Coming Soon
          </Button>
        </animated.div>
      </Box>
    </Container>
  );
}