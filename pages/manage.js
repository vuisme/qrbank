import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, Box, Alert } from '@mui/material';
import UserLayout from '../components/UserLayout'; // Import UserLayout

export default function Manage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Chưa đăng nhập, chuyển hướng đến trang login
      router.push('/login?redirect=/manage'); // Truyền query parameter redirect
      return;
    }

    const fetchUserData = async () => {
      const res = await fetch('/api/getUserData', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to fetch user data');
        if (res.status === 401) {
          localStorage.removeItem('token');
          router.push('/login?redirect=/manage');
        }
      }
    };

    fetchUserData();
  }, [router]);

  return (
    <UserLayout>
      <Container maxWidth="sm">
        <Typography variant="h4" component="h1" gutterBottom>
          Quản lý tài khoản
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {user && (
          <Box>
            <Typography variant="body1">
              Tên: {user.name}
            </Typography>
            <Typography variant="body1">
              Số tài khoản: {user.bank_account}
            </Typography>
            {/* Hiển thị các thông tin khác của user */}
          </Box>
        )}
      </Container>
    </UserLayout>
  );
}