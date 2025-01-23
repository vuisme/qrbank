import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useRouter } from 'next/router';

export default function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [apiServer, setApiServer] = useState('');
  const router = useRouter();

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (isAdminLoggedIn !== 'true') {
        router.push('/admin/login');
    }
    // Lấy dữ liệu cài đặt hiện tại từ database (thông qua API route)
    const fetchSettings = async () => {
      const res = await fetch('/api/admin/get_settings');
      if (res.ok) {
        const data = await res.json();
        setApiKey(data.api_key);
        setApiServer(data.api_server);
      }
    };
    fetchSettings();
  }, [router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Gửi request cập nhật lên server (thông qua API route)
    const response = await fetch('/api/admin/update_settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey, apiServer }),
    });

    if (response.ok) {
      alert('Settings updated successfully!');
    } else {
      alert('Failed to update settings.');
    }
  };

  return (
    <AdminLayout>
      <h1>Settings</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="apiKey">API Key:</label>
          <input
            type="text"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="apiServer">API Server:</label>
          <input
            type="text"
            id="apiServer"
            value={apiServer}
            onChange={(e) => setApiServer(e.target.value)}
          />
        </div>
        <button type="submit">Save</button>
      </form>
    </AdminLayout>
  );
}