import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import QRResult from '../../components/QRResult';
import {
    Container,
    Typography,
    Box,
    CircularProgress,
    Alert,
    Divider,
    Paper,
} from '@mui/material';
import { getCachedQRData } from '../../lib/api';
import ReactGA from 'react-ga4';
import Head from 'next/head';

export default function GenerateQR() {
    const router = useRouter();
    const { user, amount, slug } = router.query; // Lấy thêm 'slug' từ router.query
    const [qrData, setQrData] = useState(null);
    const [bankCode, setBankCode] = useState('');
    const [bankAccount, setBankAccount] = useState('');
    const [bankName, setBankName] = useState('');
    const [userName, setUserName] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [bankLogo, setBankLogo] = useState(null);
    const [purpose, setPurpose] = useState(''); // State mới cho purpose

    // Hàm xử lý chuỗi amount (thay thế k, m)
    const formatAmountString = (amountStr) => {
        if (!amountStr) return '';
        let formattedAmount = amountStr.toLowerCase();
        formattedAmount = formattedAmount.replace(/,/g, ''); // Xóa dấu phẩy
        formattedAmount = formattedAmount.replace(/k/g, '000');
        formattedAmount = formattedAmount.replace(/m/g, '000000');
        return formattedAmount;
    };

    // Hàm định dạng số tiền để hiển thị
    const formatAmountDisplay = (amountStr) => {
        if (!amountStr) return '';
        const numAmount = Number(formatAmountString(amountStr)); // Chuyển đổi sang số để định dạng
        return numAmount.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
        });
    };

    useEffect(() => {
      const fetchData = async () => {
          setIsLoading(true);
          setError(null);
  
          const currentAmount = amount || "0";
          const formattedAmount = formatAmountString(currentAmount);
          const redisKey = `${user}:${formattedAmount}:${slug || ''}`;
  
          // **Xử lý purpose từ slug (nếu có), gán mặc định "Chuyen tien QR" nếu không có**
          let currentPurpose = 'Chuyen tien QR'; // **Giá trị mặc định là "Chuyen tien QR"**
          if (slug) {
              currentPurpose = decodeURIComponent(slug).replace(/_/g, ' ');
              setPurpose(currentPurpose);
          } else {
              setPurpose('Chuyen tien QR'); // **Set state purpose mặc định khi không có slug**
          }
  
          try {
              // Thử lấy dữ liệu từ Redis
              const cachedData = await getCachedQRData(redisKey);
              if (cachedData) {
                  setQrData(cachedData.qrData);
                  setBankName(cachedData.bankName);
                  setBankLogo(cachedData.bankLogo);
                  setBankAccount(cachedData.bankAccount);
                  setUserName(cachedData.userName);
                  setPurpose(cachedData.purpose || 'Chuyen tien QR'); // Lấy purpose từ cache hoặc mặc định
                  setIsLoading(false);
                  return; // Kết thúc nếu lấy được từ cache
              }
  
              // Nếu không có trong cache, fetch từ API
              const res = await fetch(`/api/getUserData`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ user: user }),
              });
              const data = await res.json();
              if (res.ok && data) {
                  setBankCode(data.bank_code);
                  setBankAccount(data.bank_account);
                  setUserName(data.name);
  
                  let bankInfo = { shortName: '', name: '', logo: '' };
  
                  const bankInfoRes = await fetch(
                      `/api/banks?bankCode=${data.bank_code}`
                  );
                  if (bankInfoRes.ok) {
                      bankInfo = await bankInfoRes.json();
                      setBankName(bankInfo.shortName || bankInfo.name);
                      setBankLogo(bankInfo.logo);
                  } else {
                      setError('Failed to fetch bank info.');
                  }
  
                  if (data.bank_account && data.bank_code) {
                      const qrRes = await fetch('/api/qr', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                              bankAccount: data.bank_account,
                              bankCode: data.bank_code,
                              amount: formattedAmount,
                              user,
                              userName: data.name,
                              bankName: bankInfo.shortName || bankInfo.name,
                              bankLogo: bankInfo.logo,
                              purpose: currentPurpose, // Truyền purpose vào API (sẽ là "Chuyen tien QR" nếu không có slug)
                          }),
                      });
  
                      if (qrRes.ok) {
                          const { qr_code_data } = await qrRes.json();
                          setQrData(qr_code_data);
                          // ... (gtag event) ...
                      } else {
                          const errorData = await qrRes.json();
                          setError(errorData.error || 'Failed to generate QR code.');
                      }
                  }
              } else {
                  setError(data?.error || 'User not found.');
              }
          } catch (error) {
              console.error(error);
              setError('Failed to load data.');
          } finally {
              setIsLoading(false);
          }
      };
  
      if (user) {
          fetchData();
      }
  }, [user, amount, slug]);

    return (
        <>
            <Head>
                <title>Quét mã QR để thanh toán - {userName ? userName : 'MaQR.TOP'}</title>
                <meta name="description" content={`Quét mã QR để thanh toán cho ${userName ? userName : 'người dùng'} với số tiền ${amount ? formatAmountDisplay(amount) : ''}${purpose ? ` với nội dung: ${purpose}` : ''} qua ngân hàng ${bankName ? bankName : ''}`} />
                <meta name="keywords" content="quét mã qr, thanh toán, vietqr, ngân hàng, chuyển tiền, qr code, maqr.top" />
                <meta property="og:title" content={`Quét mã QR để thanh toán - ${user ? user : 'MaQR.TOP'}`} />
                <meta property="og:image" content={bankLogo || '/qr-code-animation.gif'} />
                <meta property="og:description" content={`Quét mã QR để thanh toán cho ${userName ? userName : 'người dùng'} với số tiền ${amount ? formatAmountDisplay(amount) : ''}${purpose ? ` với nội dung: ${purpose}` : ''} qua ngân hàng ${bankName ? bankName : ''}`} />
                <meta property="og:type" content="website" />
            </Head>
            <Container component="main" maxWidth="xs">
                <Paper elevation={4} sx={{ p: 3, mt: 4, borderRadius: 2 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography
                            component="h1"
                            variant="h5"
                            sx={{ fontWeight: 'bold', mb: 2 }}
                        >
                            Quét Mã QR Để Thanh Toán
                        </Typography>

                        <Box
                            sx={{
                                border: '1px solid #ccc',
                                borderRadius: 2,
                                p: 2,
                                mb: 2,
                                width: '100%',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mb: 1,
                                }}
                            >
                                {/* Hiển thị logo ngân hàng */}
                                {bankLogo ? (
                                    <img src={bankLogo} alt={bankName} width={80} />
                                ) : isLoading ? (
                                    <CircularProgress size={24} />
                                ) : (
                                    <Typography variant="body1">&nbsp;</Typography>
                                )}
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            {isLoading ? (
                                <CircularProgress sx={{ mt: 2 }} />
                            ) : qrData ? (
                                <QRResult qrData={qrData} />
                            ) : (
                                <Typography>Đang tạo mã QR...</Typography>
                            )}
                            <Divider sx={{ mt: 2 }} />
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    mt: 1,
                                }}
                            >
                                <Typography variant="subtitle2" color="textSecondary">
                                    Tên chủ TK:
                                </Typography>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                    {userName ? userName.toUpperCase() : ''}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Typography variant="subtitle2" color="textSecondary">
                                    Số tài khoản:
                                </Typography>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                    {bankAccount}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Typography variant="subtitle2" color="textSecondary">
                                    Số tiền:
                                </Typography>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                    {formatAmountDisplay(amount)}
                                </Typography>
                            </Box>
                            {/* Hiển thị purpose nếu có */}
                            {purpose && (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mt: 1,
                                    }}
                                >
                                    <Typography variant="caption" color="textSecondary" align="center">
                                        {purpose}
                                    </Typography>
                                </Box>
                            )}
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mt: 1,
                                }}
                            >
                                <Typography variant="caption" color="textSecondary">
                                    {bankName && `(${bankName})`}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Hiển thị lỗi nếu có */}
                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <Typography variant="caption" color="textSecondary" align="center">
                            Cung cấp bởi MaQR.Top
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </>
    );
}