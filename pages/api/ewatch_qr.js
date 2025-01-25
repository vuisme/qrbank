import { query } from '../../lib/db';
import { generateQR } from '../../lib/api'; // Hàm gọi API bên ngoài

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { bankAccount, bankCode, amount } = req.body;
    
    // lấy API key và API server từ bảng settings trong database
    const settings = await query({query: "SELECT * FROM settings WHERE id = 1"}); // Giả sử id 1 là settings chính
    const apiKey = settings[0].api_key;
    const apiServer = settings[0].api_server;

    try {
      // Gọi API bên ngoài để tạo QR
      const qrImageBase64 = await generateQR({
        apiKey,
        apiServer,
        bankAccount,
        bankCode,
        amount,
      });
      res.status(200).json({ qrImage: qrImageBase64 });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to generate QR code.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}