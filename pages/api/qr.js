import { generateQRCodeData } from '../../lib/api';
import { getCachedBankList } from '../../lib/db';
import QRCode from 'qrcode';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const {
      bankAccount,
      bankCode,
      amount,
      user,
      userName,
      bankName,
      bankLogo,
    } = req.body;

    // Tạo key cho Redis (user:amount)
    const redisKey = `${user}:${amount}`;

    try {
      // Kiểm tra cache trước
      const cachedData = await redis.get(redisKey);
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        res.status(200).json({ qr_code_data: parsedData.qrData });
        return; // Trả về dữ liệu từ cache
      }

      // Nếu không có trong cache, tiếp tục tạo QR code
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

      console.log("qrCodeData:", qrCodeData); // Log qrCodeData
      try {
        const qrCodeBase64 = await QRCode.toDataURL(qrCodeData);
        console.log("qrCodeBase64:", qrCodeBase64); // Log qrCodeBase64
      } catch (error) {
        console.error("Error converting to base64:", error);
        return res.status(500).json({ error: 'Failed to convert QR code to base64.' });
      }
      // Lưu thông tin vào Redis với thời hạn 1 ngày (86400 giây)
      console.log("Saving to cache:", { redisKey, data: { qrData: qrCodeBase64, bankName, bankLogo, userName, bankAccount, amount } });
      await redis.set(
        redisKey,
        JSON.stringify({
          qrData: qrCodeBase64,
          bankName: bankName,
          bankLogo: bankLogo,
          userName: userName,
          bankAccount: bankAccount,
          amount: amount.toString(),
        }),
        'EX',
        86400
      );

      // Khi đọc cache:
      const cachedData = await redis.get(redisKey);
      console.log("Cached data:", cachedData);
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