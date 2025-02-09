import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
    Container,
    Typography,
    Box,
    Alert,
    Button,
    Grid,
    Card,
    CardContent,
    Divider,
    Link as MUILink,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import UserLayout from '../components/UserLayout';
import Meta from '../components/Meta';
import Link from 'next/link';

export default function Manage() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [os, setOs] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login?redirect=/manage');
            return;
        }

        const fetchUserData = async () => {
            const res = await fetch('/api/user/info', {
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

    const detectOS = () => {
        if (typeof window !== 'undefined') {
            const userAgent = window.navigator.userAgent;
            if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
                setOs("iOS");
            } else if (/Android/.test(userAgent)) {
                setOs("Android");
            } else {
                setOs("Unknown");
            }
        }
    };

    useEffect(() => {
        detectOS();
    }, []);

    return (
        <UserLayout>
            <Meta
                title="Quản lý tài khoản gửi mã QR Thần Tốc - MãQR.TOP"
                description= "Trang quản lý của Công cụ Tạo và Gửi mã QR với số tiền tùy chọn cực kỳ nhanh chóng"
                keywords="quản lý, manage, quét mã qr, thanh toán, vietqr, ngân hàng, chuyển tiền, qr code, maqr"
                ogTitle="Quản lý tài khoản Gửi mã QR Thần Tốc - MãQR.TOP"
                ogDescription="Trang quản lý của Công cụ Tạo và Gửi mã QR với số tiền tùy chọn cực kỳ nhanh chóng"
                ogImage="/qr-code-animation.gif"
                ogUrl="https://maqr.top/manage"
            />
            <Container maxWidth="md">
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#333' }}> {/* Chỉnh heading */}
                    Quản lý tài khoản
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>} {/* Thêm margin bottom */}

                {user && (
                    <Grid container spacing={3}>
                        {/* Thông tin tài khoản */}
                        <Grid item xs={12} md={6}>
                            <Card elevation={2} sx={{  // Giảm elevation và chỉnh border
                                border: '1px solid #e0e0e0',
                                borderRadius: 1,
                            }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#444' }}> {/* Chỉnh tiêu đề card */}
                                        Thông tin tài khoản
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Typography variant="body1" sx={{ mb: 1 }}> {/* Thêm margin bottom cho từng dòng */}
                                        <span style={{ fontWeight: 600, color: '#555' }}>Tên:</span> {user.name} {/* Chỉnh màu label */}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 1 }}>
                                        <span style={{ fontWeight: 600, color: '#555' }}>User ID:</span> {user.userid}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 1 }}>
                                        <span style={{ fontWeight: 600, color: '#555' }}>Email:</span> {user.email}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 1 }}>
                                        <span style={{ fontWeight: 600, color: '#555' }}>Số tài khoản:</span>{" "}
                                        {user.bank_account}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}> {/* Tăng margin bottom dòng cuối */}
                                        <span style={{ fontWeight: 600, color: '#555' }}>Loại tài khoản:</span>{" "}
                                        {user.usertype}
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Link href="/user/edit" passHref>
                                            <Button variant="contained" color="primary">
                                                Chỉnh sửa thông tin
                                            </Button>
                                        </Link>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Hướng dẫn sử dụng */}
                        <Grid item xs={12} md={6}>
                            <Card elevation={2} sx={{  // Giảm elevation và chỉnh border
                                border: '1px solid #e0e0e0',
                                borderRadius: 1,
                            }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#444' }}> {/* Chỉnh tiêu đề card */}
                                        Hướng dẫn sử dụng
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Typography variant="body1" gutterBottom sx={{ color: '#666' }}> {/* Chỉnh màu text hướng dẫn */}
                                        Bạn có thể tạo link QR code để chia sẻ cho người khác thanh
                                        toán cho bạn một cách nhanh chóng.
                                    </Typography>
                                    <Typography variant="body1" gutterBottom sx={{ color: '#666' }}>
                                        <b>Cấu trúc link:</b>{" "}
                                        <code style={{ color: '#333', fontWeight: 'bold' }}>maqr.top/{user.userid}/<b>&lt;số tiền&gt;</b></code> {/* Chỉnh code text */}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 2, color: '#666' }}> {/* Chỉnh màu text ví dụ */}
                                        <b>Ví dụ:</b>
                                    </Typography>
                                    <Box sx={{ ml: 2 }}>
                                        <Typography variant="body2" sx={{ mb: 1, color: '#777' }}> {/* Chỉnh màu text ví dụ con */}
                                            -{" "}
                                            <MUILink
                                                href={`https://maqr.top/${user.userid}/100000`}
                                                target="_blank"
                                                sx={{ color: '#007bff' }} // Màu link
                                            >
                                                maqr.top/{user.userid}/100000
                                            </MUILink>{" "}
                                            (100,000 VND)
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 1, color: '#777' }}>
                                            -{" "}
                                            <MUILink
                                                href={`https://maqr.top/${user.userid}/50k`}
                                                target="_blank"
                                                sx={{ color: '#007bff' }} // Màu link
                                            >
                                                maqr.top/{user.userid}/50k
                                            </MUILink>{" "}
                                            (50,000 VND)
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 2, color: '#777' }}>
                                            -{" "}
                                            <MUILink
                                                href={`https://maqr.top/${user.userid}/2m`}
                                                target="_blank"
                                                sx={{ color: '#007bff' }} // Màu link
                                            >
                                                maqr.top/{user.userid}/2m
                                            </MUILink>{" "}
                                            (2,000,000 VND)
                                        </Typography>
                                    </Box>

                                    {/* Hướng dẫn tạo phím tắt */}
                                    <Accordion elevation={0} sx={{ boxShadow: 'none', border: `1px solid #e0e0e0`, borderRadius: 1 }}> {/* Chỉnh accordion */}
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography sx={{ fontWeight: 500, color: '#555' }}>Hướng dẫn tạo cụm từ thay thế</Typography> {/* Chỉnh text accordion summary */}
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Box sx={{ mb: 2 }}>
                                                {/* Button chọn hệ điều hành */}
                                                <Button
                                                    variant={os === "iOS" ? "contained" : "outlined"}
                                                    onClick={() => setOs("iOS")}
                                                    sx={{ mr: 1, mb: 1 }} // Thêm margin bottom
                                                >
                                                    iOS
                                                </Button>
                                                <Button
                                                    variant={
                                                        os === "Android" ? "contained" : "outlined"
                                                    }
                                                    onClick={() => setOs("Android")}
                                                >
                                                    Android
                                                </Button>
                                            </Box>
                                            {/* Hướng dẫn cho iOS */}
                                            {os === "iOS" && (
                                                <Box>
                                                    <Typography variant="body1" gutterBottom sx={{ fontWeight: 500, color: '#666' }}> {/* Chỉnh heading hướng dẫn */}
                                                        <b>Tạo cụm từ thay thế trên iOS:</b>
                                                    </Typography>
                                                    <Typography variant="body2" gutterBottom sx={{ color: '#777' }}> {/* Chỉnh text hướng dẫn */}
                                                        1. Mở <b>Cài đặt (Settings)</b>.
                                                    </Typography>
                                                    <Typography variant="body2" gutterBottom sx={{ color: '#777' }}>
                                                        2. Chọn <b>Cài đặt chung (General)</b>.
                                                    </Typography>
                                                    <Typography variant="body2" gutterBottom sx={{ color: '#777' }}>
                                                        3. Chọn <b>Bàn phím (Keyboard)</b>.
                                                    </Typography>
                                                    <Typography variant="body2" gutterBottom sx={{ color: '#777' }}>
                                                        4. Chọn <b>Thay thế văn bản (Text Replacement)</b>.
                                                    </Typography>
                                                    <Typography variant="body2" gutterBottom sx={{ color: '#777' }}>
                                                        5. Nhấn vào dấu <b>+</b> ở góc trên bên phải.
                                                    </Typography>
                                                    <Typography variant="body2" gutterBottom sx={{ color: '#777' }}>
                                                        6. Ở ô <b>Cụm từ (Phrase)</b>, nhập:{" "}
                                                        <code style={{ color: '#333', fontWeight: 'bold' }}>https://maqr.top/{user.userid}/</code>
                                                    </Typography>
                                                    <Typography variant="body2" gutterBottom sx={{ color: '#777' }}>
                                                        7. Ở ô <b>Phím tắt (Shortcut)</b>, nhập: <b>`myqr`</b>
                                                    </Typography>
                                                    <Typography variant="body2" gutterBottom sx={{ color: '#777' }}>
                                                        8. Nhấn <b>Lưu (Save)</b> ở góc trên bên phải.
                                                    </Typography>
                                                    <Typography variant="body2" gutterBottom sx={{ color: '#777' }}>
                                                        9. <b>Hướng dẫn:</b> từ sau khi gõ <b>myqr</b> và nhấn <b>dấu cách (space)</b> hệ thống sẽ tự điền cho bạn <b>`https://maqr.top/{user.userid}/`</b>
                                                    </Typography>
                                                </Box>
                                            )}

                                            {/* Hướng dẫn cho Android */}
                                            {os === "Android" && (
                                                <Box>
                                                    <Typography variant="body1" gutterBottom sx={{ fontWeight: 500, color: '#666' }}> {/* Chỉnh heading hướng dẫn */}
                                                        <b>Tạo cụm từ thay thế trên Android:</b>
                                                    </Typography>
                                                    <Typography variant="body2" gutterBottom sx={{ color: '#777' }}> {/* Chỉnh text hướng dẫn */}
                                                        Cách tạo cụm từ thay thế trên Android khác nhau tùy
                                                        thuộc vào nhà sản xuất và phiên bản Android (Samsung, Oppo, Xiaomi,...).
                                                    </Typography>
                                                    <Typography variant="body2" gutterBottom sx={{ color: '#777' }}>
                                                        <b>Hướng dẫn chung (tham khảo):</b>
                                                    </Typography>
                                                    <Typography variant="body2" gutterBottom sx={{ color: '#777' }}>
                                                        1. Mở <b>Cài đặt (Settings)</b>.
                                                    </Typography>
                                                    <Typography variant="body2" gutterBottom sx={{ color: '#777' }}>
                                                        2. Chọn <b>Hệ Thống (System)</b> hoặc <b>Quản lý chung (General Management)</b>.
                                                    </Typography>
                                                    <Typography variant="body2" gutterBottom sx={{ color: '#777' }}>
                                                        3. Chọn <b>Ngôn ngữ và bàn phím (Language & input)</b> hoặc <b>Bàn phím (Keyboard)</b>.
                                                    </Typography>
                                                    <Typography variant="body2" gutterBottom sx={{ color: '#777' }}>
                                                        4. Chọn <b>Bàn phím trên màn hình (On-screen keyboard)</b> hoặc <b>Bàn phím hiện tại (Current Keyboard)</b>.
                                                    </Typography>
                                                    <Typography variant="body2" gutterBottom sx={{ color: '#777' }}>
                                                        5. Chọn bàn phím bạn đang sử dụng (ví dụ: <b>Samsung Keyboard, Gboard</b>).
                                                    </Typography>
                                                    <Typography variant="body2" gutterBottom sx={{ color: '#777' }}>
                                                        6. Tìm và chọn <b>Từ điển cá nhân (Personal dictionary)</b> hoặc <b>Thay thế văn bản (Text replacement)</b>.
                                                    </Typography>
                                                    <Typography variant="body2" gutterBottom sx={{ color: '#777' }}>
                                                        7. Nhấn vào dấu <b>+</b> để tạo cụm từ thay thế mới.
                                                    </Typography>
                                                    <Typography variant="body2" gutterBottom sx={{ color: '#777' }}>
                                                        8. Ở ô <b>Cụm từ (Phrase)</b>, nhập:{" "}
                                                        <code style={{ color: '#333', fontWeight: 'bold' }}>https://maqr.top/{user.userid}/</code>
                                                    </Typography>
                                                    <Typography variant="body2" gutterBottom sx={{ color: '#777' }}>
                                                        9. Ở ô <b>Phím tắt (Shortcut)</b>, nhập: <b>`myqr`</b>
                                                    </Typography>
                                                    <Typography variant="body2" gutterBottom sx={{ color: '#777' }}>
                                                        10. Nhấn <b>Lưu/Thêm (Save/Add)</b>.
                                                    </Typography>
                                                    <Typography variant="body2" gutterBottom sx={{ color: '#777' }}>
                                                        11. <b>Hướng dẫn:</b> từ sau khi gõ <b>`myqr`</b> hệ thống sẽ gợi ý cho bạn cụm từ <b>`https://maqr.top/{user.userid}/`</b>
                                                    </Typography>
                                                </Box>
                                            )}
                                        </AccordionDetails>
                                    </Accordion>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                )}
            </Container>
        </UserLayout>
    );
}