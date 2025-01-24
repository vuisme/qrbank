import { Box } from '@mui/material';

export default function QRResult({ qrData }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 2,
      }}
    >
      <img src={`data:image/png;base64,${qrData}`} alt="QR Code" />
    </Box>
  );
}