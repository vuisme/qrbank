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
import Link from 'next/link';

export default function Manage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [os, setOs] = useState(null); // State để lưu hệ điều hành
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

  // Hàm xác định hệ điều hành
  const detectOS = () => {
    if (typeof window !== 'undefined') {
      const userAgent = window.navigator.userAgent;
      if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        setOs("iOS");
      } else if (/Android/.test(userAgent)) {
        setOs("Android");
      } else {
        setOs("Unknown"); // Hệ điều hành khác hoặc không xác định được
      }
    }
  };

  useEffect(() => {
    detectOS(); // Gọi hàm xác định hệ điều hành khi component mount
  }, []);

  return (
    <UserLayout>
      <Container maxWidth="md">
        <Typography variant="h4" component="h1" gutterBottom>
          Quản lý tài khoản
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        {user && (
          <Grid container spacing={3}>
            {/* Thông tin tài khoản */}
            <Grid item xs={12} md={6}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Thông tin tài khoản
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body1">
                    <span style={{ fontWeight: 600 }}>Tên:</span> {user.name}
                  </Typography>
                  <Typography variant="body1">
                    <span style={{ fontWeight: 600 }}>User ID:</span> {user.userid}
                  </Typography>
                  <Typography variant="body1">
                    <span style={{ fontWeight: 600 }}>Email:</span> {user.email}
                  </Typography>
                  <Typography variant="body1">
                    <span style={{ fontWeight: 600 }}>Số tài khoản:</span>{" "}
                    {user.bank_account}
                  </Typography>
                  <Typography variant="body1">
                    <span style={{ fontWeight: 600 }}>Loại tài khoản:</span>{" "}
                    {user.usertype}
                  </Typography>
                  {/* Thêm các thông tin khác của user */}
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
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Hướng dẫn sử dụng
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body1" gutterBottom>
                    Bạn có thể tạo link QR code để chia sẻ cho người khác thanh
                    toán cho bạn một cách nhanh chóng.
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <b>Cấu trúc link:</b>{" "}
                    <code>maqr.top/&lt;username&gt;/&lt;số tiền&gt;</code>
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    <b>Ví dụ:</b>
                  </Typography>
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="body2">
                      -{" "}
                      <MUILink
                        href={`https://maqr.top/${user.userid}/100000`}
                        target="_blank"
                      >
                        maqr.top/{user.userid}/100000
                      </MUILink>{" "}
                      (100,000 VND)
                    </Typography>
                    <Typography variant="body2">
                      -{" "}
                      <MUILink
                        href={`https://maqr.top/${user.userid}/50k`}
                        target="_blank"
                      >
                        maqr.top/{user.userid}/50k
                      </MUILink>{" "}
                      (50,000 VND)
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      -{" "}
                      <MUILink
                        href={`https://maqr.top/${user.userid}/2m`}
                        target="_blank"
                      >
                        maqr.top/{user.userid}/2m
                      </MUILink>{" "}
                      (2,000,000 VND)
                    </Typography>
                  </Box>

                  {/* Hướng dẫn tạo phím tắt */}
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>Hướng dẫn tạo cụm từ thay thế</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Box sx={{ mb: 2 }}>
                        {/* Button chọn hệ điều hành */}
                        <Button
                          variant={os === "iOS" ? "contained" : "outlined"}
                          onClick={() => setOs("iOS")}
                          sx={{ mr: 1 }}
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
                          <Typography variant="body1" gutterBottom>
                            <b>Tạo cụm từ thay thế trên iOS:</b>
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            1. Mở <b>Cài đặt (Settings)</b>.
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            2. Chọn <b>Cài đặt chung (General)</b>.
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            3. Chọn <b>Bàn phím (Keyboard)</b>.
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            4. Chọn <b>Thay thế văn bản (Text Replacement)</b>.
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            5. Nhấn vào dấu <b>+</b> ở góc trên bên phải.
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            6. Ở ô <b>Cụm từ (Phrase)</b>, nhập:{" "}
                            <code>https://maqr.top/{user.userid}/</code>
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            7. Ở ô <b>Phím tắt (Shortcut)</b>, nhập: <b>`myqr`</b>
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            8. Nhấn <b>Lưu (Save)</b> ở góc trên bên phải.
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                          9. <b>Hướng dẫn:</b> từ sau khi gõ <b>myqr</b> và nhấn <b>dấu cách (space)</b> hệ thống sẽ tự điền cho bạn <b>`https://maqr.top/{user.userid}/`</b>
                          </Typography>
                        </Box>
                      )}

                      {/* Hướng dẫn cho Android */}
                      {os === "Android" && (
                        <Box>
                          <Typography variant="body1" gutterBottom>
                            <b>Tạo cụm từ thay thế trên Android:</b>
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            Cách tạo cụm từ thay thế trên Android khác nhau tùy
                            thuộc vào nhà sản xuất và phiên bản Android (Samsung, Oppo, Xiaomi,...).
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            <b>Hướng dẫn chung (tham khảo):</b>
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            1. Mở <b>Cài đặt (Settings)</b>.
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            2. Chọn <b>Hệ Thống (System)</b> hoặc <b>Quản lý chung (General Management)</b>.
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            3. Chọn <b>Ngôn ngữ và bàn phím (Language & input)</b> hoặc <b>Bàn phím (Keyboard)</b>.
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            4. Chọn <b>Bàn phím trên màn hình (On-screen keyboard)</b> hoặc <b>Bàn phím hiện tại (Current Keyboard)</b>.
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            5. Chọn bàn phím bạn đang sử dụng (ví dụ: <b>Samsung Keyboard, Gboard</b>).
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            6. Tìm và chọn <b>Từ điển cá nhân (Personal dictionary)</b> hoặc <b>Thay thế văn bản (Text replacement)</b>.
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            7. Nhấn vào dấu <b>+</b> để tạo cụm từ thay thế mới.
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                          8. Ở ô <b>Cụm từ (Phrase)</b>, nhập:{" "}
                            <code>https://maqr.top/{user.userid}/</code>
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            9. Ở ô <b>Phím tắt (Shortcut)</b>, nhập: <b>`myqr`</b>
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            10. Nhấn <b>Lưu/Thêm (Save/Add)</b>.
                          </Typography>
                          <Typography variant="body2" gutterBottom>
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