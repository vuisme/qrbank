import { generateQRCodeData } from '../../lib/api';
import { getCachedBankList } from '../../lib/db';
import QRCode from 'qrcode';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { bankAccount, bankCode, amount, user } = req.body;

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
        amount: amount,
        purpose: 'Thanh toan QR',
      });

      // Chuyển đổi QR code text thành data URL của ảnh PNG
      const qrCodeBase64 = await QRCode.toDataURL(qrCodeData);

      // Tạo key cho Redis (user:amount)
      const redisKey = `${user}:${req.body.amount}`;

      // Lấy thông tin người dùng và ngân hàng để lưu vào cache
      const userDataRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getUserData`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: user }),
      });

      const userData = await userDataRes.json();
      const userName = userData.name;

      const bankInfoRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/banks?bankCode=${bankCode}`
      );
      const bankInfo = await bankInfoRes.json();
      const bankName = bankInfo.shortName || bankInfo.name;
      const bankLogo = bankInfo.logo;

      // Lưu thông tin vào Redis với thời hạn 1 ngày (86400 giây)
      await redis.set(
        redisKey,
        JSON.stringify({
          qrData: qrCodeBase64,
          bankName: bankName,
          bankLogo: bankLogo,
          userName: userName,
          bankAccount: bankAccount,
          amount: req.body.amount, // Lưu amount gốc dạng string
        }),
        'EX',
        86400
      );

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