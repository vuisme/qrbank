import { generateQRCodeData } from '../../lib/api';
import { getCachedBankList } from '../../lib/db';

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

      // Tạo mã QR
      const qrCodeData = await generateQRCodeData({
        bankBin: bank.bin,
        bankNumber: bankAccount,
        amount: amount,
        purpose: 'Done', // Bạn có thể thay đổi nội dung này
      });

      // Chuyển đổi mã QR thành base64 (nếu cần hiển thị dưới dạng ảnh)
      const base64Data = Buffer.from(qrCodeData).toString('base64');

      res.status(200).json({ qr_code_data: base64Data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to generate QR code.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}