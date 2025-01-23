import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import QRForm from '../../components/QRForm';
import QRResult from '../../components/QRResult';

export default function GenerateQR() {
  const router = useRouter();
  const { user, amount } = router.query;
  const [qrData, setQrData] = useState(null);
  const [bankCode, setBankCode] = useState('');
  const [bankAccount, setBankAccount] = useState('');

    useEffect(() => {
      const fetchUserData = async () => {
        // Gọi API để lấy thông tin user từ database
        const res = await fetch(`/api/getUserData?user=${user}`);
        const data = await res.json();
        if (data) {
          setBankCode(data.bank_code);
          setBankAccount(data.bank_account);
        }
      };

      if (user) {
          fetchUserData();
      }
    }, [user]);

  useEffect(() => {
    const generateQR = async () => {
      if (bankAccount && bankCode && amount) {
          // Gửi request đến API Route để tạo QR
          const res = await fetch('/api/qr', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bankAccount, bankCode, amount: parseFloat(amount) }),
          });

          if (res.ok) {
            const { qrImage } = await res.json();
            setQrData(qrImage);
          } else {
              console.error("Failed to generate QR code.");
          }
        }
    };
    if (bankAccount && bankCode && amount) {
        generateQR();
    }
  }, [bankAccount, bankCode, amount]);

  return (
    <div>
      <h1>Generate QR Code for {user}</h1>
      <h2>Amount: {amount}</h2>
      {qrData ? (
        <QRResult qrData={qrData} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}