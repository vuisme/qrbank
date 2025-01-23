import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Welcome to the QR Code Generator</h1>
      <p>
        <Link href="/admin/login">Admin Login</Link>
      </p>
      {/* Thêm hướng dẫn sử dụng hoặc giới thiệu về dịch vụ */}
    </div>
  );
}