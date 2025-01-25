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
      <img src={qrData} alt="QR Code" width={250} height={250} />
    </Box>
  );
}