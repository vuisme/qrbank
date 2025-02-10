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

                        {/* **Bảng CÁC CẤP ĐỘ SỬ DỤNG** */}
                        <Box sx={{ mt: 6, width: '100%' }}>
                            <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                                CÁC CẤP ĐỘ SỬ DỤNG
                            </Typography>
                            <TableContainer component={Paper} elevation={2}>
                                <Table aria-label="feature table" sx={{ minWidth: 650 }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>PUBLIC ACCESS</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>REGISTERED</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>VERIFIED COMPANY</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>SELF-HOSTED</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" sx={{ fontStyle: 'italic', color: 'textSecondary' }}>Sử dụng ngay các API của VietQRic mà <br/> không cần đăng kí</TableCell>
                                            <TableCell align="center" sx={{ fontStyle: 'italic', color: 'textSecondary' }}>Đăng kí tài khoản để sử dụng các API <br/> một cách cá nhân hóa, nhiều tùy biến</TableCell>
                                            <TableCell align="center" sx={{ fontStyle: 'italic', color: 'textSecondary' }}>Các tính năng đặc thù dành riêng cho <br/> doanh nghiệp</TableCell>
                                            <TableCell align="center" sx={{ fontStyle: 'italic', color: 'textSecondary' }}>Các doanh nghiệp lớn làm chủ công <br/> nghệ cổng thanh toán ở mức độ cao nhất.</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="center" sx={{ fontWeight: 'bold', color: 'success.main', fontSize: '1.2rem' }}>MIỄN PHÍ</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 'bold', color: 'success.main', fontSize: '1.2rem' }}>MIỄN PHÍ</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>LIÊN HỆ</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>LIÊN HỆ</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="left">
                                                <Typography><span style={{ fontWeight: 'bold', marginRight: '5px' }}>✔</span>Bank Database</Typography>
                                                <Typography><span style={{ fontWeight: 'bold', marginRight: '5px' }}>✔</span>Quicklink</Typography>
                                                <Typography><span style={{ fontWeight: 'bold', marginRight: '5px' }}>✔</span>Deeplink</Typography>
                                                <Typography><span style={{ fontWeight: 'bold', marginRight: '5px' }}>✔</span>SLA 99.5%</Typography>
                                            </TableCell>
                                            <TableCell align="left">
                                                <Typography><span style={{ fontWeight: 'bold', marginRight: '5px' }}>✔</span>Bao gồm tất cả tính năng của Public Access và</Typography>
                                                <Typography><span style={{ fontWeight: 'bold', marginRight: '5px' }}>✔</span>My VietQR</Typography>
                                                <Typography><span style={{ fontWeight: 'bold', marginRight: '5px' }}>✔</span>Integration</Typography>
                                                <Typography><span style={{ fontWeight: 'bold', marginRight: '5px' }}>✔</span>Account Number Lookup</Typography>
                                                <Typography><span style={{ fontWeight: 'bold', marginRight: '5px' }}>✔</span>SLA 99.9%</Typography>
                                            </TableCell>
                                            <TableCell align="left">
                                                <Typography><span style={{ fontWeight: 'bold', marginRight: '5px' }}>✔</span>Bao gồm tất cả tính năng của Registered và</Typography>
                                                <Typography><span style={{ fontWeight: 'bold', marginRight: '5px' }}>✔</span>Custom Domain</Typography>
                                                <Typography><span style={{ fontWeight: 'bold', marginRight: '5px' }}>✔</span>Payment Initialize</Typography>
                                                <Typography><span style={{ fontWeight: 'bold', marginRight: '5px' }}>✔</span>Counter Account Enrich</Typography>
                                                <Typography><span style={{ fontWeight: 'bold', marginRight: '5px' }}>&checkmark;</span> SLA 99.95%</Typography>
                                            </TableCell>
                                            <TableCell align="left">
                                                <Typography><span style={{ fontWeight: 'bold', marginRight: '5px' }}>✔</span>Bao gồm tất cả tính năng của Verified Company và</Typography>
                                                <Typography><span style={{ fontWeight: 'bold', marginRight: '5px' }}>✔</span>Self-Host</Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                        {/* **Self-Hosting Contact Section** */}
                        <Box sx={{ mt: 6, width: '100%', textAlign: 'left' }}>
                            <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                                Self-Hosting và Giải pháp Doanh nghiệp
                            </Typography>
                            <Typography variant="body1" paragraph>
                                Bạn có nhu cầu self-host MãQR.TOP trên máy chủ riêng hoặc cần các giải pháp tùy chỉnh cho doanh nghiệp?
                            </Typography>
                            <Typography variant="body1" paragraph>
                                Hãy liên hệ với chúng tôi để được tư vấn và hỗ trợ:
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                Email: <Link href="mailto:your-email@example.com" passHref><Typography variant="inherit" color="primary">your-email@example.com</Typography></Link>
                            </Typography>
                            {/* You can add other contact methods here, like phone number, contact form link, etc. */}
                        </Box>

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