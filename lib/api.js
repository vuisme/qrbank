import { QRPay, Banks } from 'vietnam-qr-pay';

export async function generateQRCodeData({ bankBin, bankNumber, amount, purpose }) {
  try {
      const qrPay = QRPay.initVietQR({
        bankBin,
        bankNumber,
        amount,
        purpose,
      });
      const content = qrPay.build();
      return content;
  } catch (error) {
      console.error("Failed to generate QR Code:", error);
      throw new Error("Failed to generate QR Code");
  }
}

// ... các hàm khác