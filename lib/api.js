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
      return data;
    } else {
      console.error('Failed to get QR data from cache');
      return null;
    }
  } catch (error) {
    console.error('Error while fetching QR data from cache:', error);
    return null;
  }
}

// Thêm 2 function mới vào lib/api.js
export async function saveUserDataToCache(userKey, userData) {
    await redis.set(userKey, JSON.stringify(userData), 'EX', 86400); // Hết hạn sau 1 ngày
}
  
export async function getUserDataFromCache(userKey) {
    const cachedData = await redis.get(userKey);
    if (cachedData) {
        return JSON.parse(cachedData);
    } else {
        return null;
    }
}