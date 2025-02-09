import Link from 'next/link';
import { useRouter } from 'next/router';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Container,
    IconButton, // Import IconButton
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout'; // Import Logout Icon

export default function UserLayout({ children }) {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token'); // Xóa token khi logout
        router.push('/login');
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" elevation={1} sx={{ // Thêm elevation và chỉnh màu nền
                backgroundColor: '#f8f9fa', // Màu nền xám nhạt hiện đại
                borderBottom: `1px solid #e0e0e0`, // Đường kẻ dưới thanh appbar
            }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#333' }}> {/* Đổi màu chữ */}
                        User Panel
                    </Typography>
                    <IconButton // Thay thế Button bằng IconButton để dùng icon
                        color="inherit"
                        onClick={handleLogout}
                        sx={{ color: '#555' }} // Chỉnh màu icon
                    >
                        <LogoutIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 10, backgroundColor: '#f5f5f5' }}> {/* Thêm màu nền trang */}
                <Container maxWidth="lg">{children}</Container>
            </Box>
        </Box>
    );
}