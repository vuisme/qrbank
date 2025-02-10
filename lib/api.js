import { QRPay, Banks } from 'vietnam-qr-pay';

export async function generateQRCodeData({ bankBin, bankNumber, amount, purpose }) {
    try {
        console.log("Input:", { bankBin, bankNumber, amount, purpose }); // Log đầu vào

        // Tạo cấu hình ban đầu với bankBin và bankNumber
        const qrConfig = {
            bankBin,
            bankNumber,
        };

        // Thêm amount và purpose vào cấu hình nếu amount khác 0 và có giá trị
        if (amount && amount !== "0" && amount !== 0) { // Kiểm tra amount khác 0 và không phải chuỗi "0"
            qrConfig.amount = amount;
            if (purpose) { // Chỉ thêm purpose nếu có giá trị
                qrConfig.purpose = purpose;
            }
        }

        const qrPay = QRPay.initVietQR(qrConfig); // Khởi tạo VietQR với cấu hình động
        console.log("qrpay:", qrPay);
        const content = qrPay.build();
        console.log("content:", content);
        return content;
    } catch (error) {
        console.error("Failed to generate QR Code:", error);
        throw new Error("Failed to generate QR Code");
    }
}

export async function getCachedQRData(key) {
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