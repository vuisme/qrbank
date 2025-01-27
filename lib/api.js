import { QRPay, Banks } from 'vietnam-qr-pay';

export async function generateQRCodeData({ bankBin, bankNumber, amount, purpose }) {
  try {
    console.log("Input:", { bankBin, bankNumber, amount, purpose }); // Log đầu vào
    const qrPay = QRPay.initVietQR({
      bankBin,
      bankNumber,
      amount, // Đảm bảo amount là số
      purpose,
    });
    console.log("qrpay:", qrPay);
    const content = qrPay.build();
    console.log("content:", content);
    return content;
  } catch (error) {
    console.error("Failed to generate QR Code:", error);
    throw new Error("Failed to generate QR Code");
  }
}

export async function getQRFromCache(key) {
  try {
    const response = await fetch('/api/get-qr-cache', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.error ? null : data; // Trả về null nếu có lỗi
    } else {
      console.error('Failed to get QR data from cache');
      return null;
    }
  } catch (error) {
    console.error('Error while fetching QR data from cache:', error);
    return null;
  }
}