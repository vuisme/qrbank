import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (isAdminLoggedIn === 'true') {
      router.push('/admin');
    }
  }, [router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Đây chỉ là ví dụ đơn giản, chưa có xác thực thực tế
    if (username === 'admin' && password === 'password') {
      // Lưu trạng thái đăng nhập vào localStorage
      localStorage.setItem('isAdminLoggedIn', 'true');
      router.push('/admin');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div>
      <h1>Admin Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}