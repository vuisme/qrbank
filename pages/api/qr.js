import { generateQRCodeData } from '../../lib/api';
import { getCachedBankList } from '../../lib/db';
import QRCode from 'qrcode';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { bankAccount, bankCode, amount } = req.body;

    try {
      // Lấy danh sách ngân hàng từ cache để tìm bankBin
      const banks = await getCachedBankList();
      const bank = banks.find((b) => b.bin === bankCode);

      if (!bank) {
        return res.status(400).json({ error: 'Invalid bank code.' });
      }

      // Tạo mã QR data (text)
      const qrCodeData = await generateQRCodeData({
        bankBin: bank.bin,
        bankNumber: bankAccount,
        amount,
        purpose: 'QuetQR',
      });

      // Chuyển đổi QR code text thành base64 image
      const qrCodeBase64 = await QRCode.toDataURL(qrCodeData);

      res.status(200).json({ qr_code_data: qrCodeBase64 });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to generate QR code.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}