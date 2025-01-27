// pages/_app.js
import { useRouter } from 'next/router';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import '../styles/globals.css'; // Import file CSS global của bạn (nếu có)
import ReactGA from 'react-ga4';

const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const theme = createTheme({
  // Tùy chỉnh theme của bạn ở đây (nếu cần)
  // Ví dụ:
  palette: {
    primary: {
      main: '#1976d2', // Màu primary của bạn
    },
  },
});

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Chỉ khởi tạo Google Analytics nếu đang chạy ở client-side và đã có Measurement ID
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined' && MEASUREMENT_ID) {
      ReactGA.initialize(MEASUREMENT_ID);
    }
  }, []);

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined' && MEASUREMENT_ID) {
        ReactGA.send({ hitType: 'pageview', page: url });
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;