import { Container, Typography, Box, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
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
                description="Công cụ Tạo và Gửi mã QR với số tiền tùy chọn cực kỳ nhanh chóng"
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
                        padding: { xs: 2, md: 0 }, // Padding for mobile
                    }}
                >
                    <Image
                        src="/qr-code-animation.gif"
                        alt="QR Code Animation"
                        width={300}
                        height={300}
                    />
                    <animated.div style={props}>
                        <Typography variant="h3" component="h1" gutterBottom sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
                            MãQR.TOP!
                        </Typography>
                        <Typography variant="h5" component="h2" gutterBottom sx={{ fontSize: { xs: '1.25rem', md: '2rem' } }}>
                            Gửi mã QR cực kỳ nhanh chóng và dễ dàng!
                        </Typography>
                        <Box sx={{ mt: 4 }}>
                            <Grid container spacing={2} justifyContent="center">
                                <Grid item>
                                    <Link href="/login" passHref>
                                        <Button variant="contained" color="primary" size="large" fullWidth={true} sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                                            Đăng nhập
                                        </Button>
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="/register" passHref>
                                        <Button variant="outlined" color="primary" size="large" fullWidth={true} sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                                            Đăng ký
                                        </Button>
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                        <animated.div style={linkProps}>
                            <Box
                                sx={{
                                    mt: 4,
                                    p: { xs: 2, md: 3 }, // Padding for mobile
                                    border: '1px solid #ccc',
                                    borderRadius: '8px',
                                    backgroundColor: '#f8f8f8',
                                    textAlign: { xs: 'left', md: 'center' }, // Align for mobile
                                }}
                            >
                                <Typography variant="body1" component="p">
                                    Chỉ cần gửi link sau để tạo mã QR:
                                </Typography>
                                <Typography
                                    variant="h6"
                                    component="p"
                                    sx={{ fontFamily: 'monospace', mt: 1, fontSize: { xs: '0.875rem', md: '1.25rem' } }}
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
                                    Trong đó, <Typography variant="inherit" component='span' sx={{ color: '#0d6efd', fontWeight: 'bold' }}>&lt;user&gt;</Typography> là tên người dùng của bạn và <Typography variant="inherit" component='span' sx={{ color: '#dc3545', fontWeight: 'bold' }}>&lt;số tiền&gt;</Typography> là số tiền cần thanh toán. Hệ thống sẽ tự động tạo mã QR tương ứng khi khách hàng truy cập liên kết và có thể quét mã thanh toán nhanh chóng.
                                </Typography>
                            </Box>
                        </animated.div>

                        {/* Bảng CÁC CẤP ĐỘ SỬ DỤNG */}
                        <Box sx={{ mt: 6, width: '100%' }}>
                            <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                                Các Gói Dịch Vụ
                            </Typography>
                            <TableContainer component={Paper} elevation={2}>
                                <Table aria-label="feature table" sx={{ minWidth: 650 }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', md: '1.1rem' } }}>MIỄN PHÍ</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', md: '1.1rem' } }}>NÂNG CAO</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', md: '1.1rem' } }}>DOANH NGHIỆP & SELF-HOST</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" sx={{ fontStyle: 'italic', color: 'textSecondary' }}>Liên kết tạo mã QR miễn phí <br /> nhanh chóng để gửi khách hàng</TableCell>
                                            <TableCell align="center" sx={{ fontStyle: 'italic', color: 'textSecondary' }}>Mở rộng với các tính năng <br /> cao cấp và tiện ích hơn</TableCell>
                                            <TableCell align="center" sx={{ fontStyle: 'italic', color: 'textSecondary' }}>Giải pháp toàn diện cho <br /> doanh nghiệp và tổ chức</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="center" sx={{ fontWeight: 'bold', color: 'success.main', fontSize: { xs: '1rem', md: '1.2rem' } }}>MIỄN PHÍ</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: { xs: '1rem', md: '1.2rem' } }}>TRẢ PHÍ</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: { xs: '1rem', md: '1.2rem' } }}>LIÊN HỆ</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="left">
                                                <Typography><span style={{ fontWeight: 'bold', marginRight: '5px' }}>✔</span>Tạo mã QR chuyển tiền</Typography>
                                                <Typography><span style={{ fontWeight: 'bold', marginRight: '5px' }}>✔</span>Số tiền tùy chọn</Typography>
                                                <Typography><span style={{ fontWeight: 'bold', marginRight: '5px' }}>✔</span>Nội dung chuyển khoản tùy chọn</Typography>
                                            </TableCell>
                                            <TableCell align="left">
                                                <Typography><span style={{ fontWeight: 'bold', marginRight: '5px' }}>✔</span>Lưu lịch sử giao dịch</Typography>
                                                <Typography><span style={{ fontWeight: 'bold', marginRight: '5px' }}>✔</span>Xác thực giao dịch tự dộng</Typography>
                                                <Typography><span style={{ fontWeight: 'bold', marginRight: '5px' }}>✔</span>Đang trong quá trình phát triển</Typography>
                                            </TableCell>
                                            <TableCell align="left">
                                                <Typography><span style={{ fontWeight: 'bold', marginRight: '5px' }}>✔</span>Self-Host</Typography>
                                                <Typography><span style={{ fontWeight: 'bold', marginRight: '5px' }}>✔</span>API tích hợp</Typography>
                                                <Typography><span style={{ fontWeight: 'bold', marginRight: '5px' }}>✔</span>Tùy biến tên miền</Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </animated.div>
                </Box>
            </Container>
        </>
    );
}
