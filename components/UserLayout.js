import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';

export default function UserLayout({ children }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Xóa token khi logout
    router.push('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            User Panel
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 10 }}>
        <Container maxWidth="lg">{children}</Container>
      </Box>
    </Box>
  );
}