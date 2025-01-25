import { QRPay, Banks } from 'vietnam-qr-pay';

export async function generateQRCodeData({ bankBin, bankNumber, amount, purpose }) {
  const qrPay = QRPay.initVietQR({
    bankBin: bankBin,
    bankNumber: bankNumber,
    amount: amount,
    purpose: purpose,
  });
  const content = qrPay.build();
  return content;
}