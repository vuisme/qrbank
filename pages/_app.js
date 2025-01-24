// pages/_app.js
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import '../styles/globals.css'; // Import file CSS global của bạn (nếu có)

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
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;