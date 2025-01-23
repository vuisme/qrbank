import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useRouter } from 'next/router';

export default function DeleteMember() {
  const [userid, setUserid] = useState('');
  const router = useRouter();

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (isAdminLoggedIn !== 'true') {
        router.push('/admin/login');
    }
  }, [router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Gửi request xóa thành viên lên server (thông qua API route)
    const response = await fetch('/api/admin/delete_member', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userid }),
    });

    if (response.ok) {
      alert('Member deleted successfully!');
      // Reset form
      setUserid('');
    } else {
      alert('Failed to delete member.');
    }
  };

  return (
    <AdminLayout>
      <h1>Delete Member</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="userid">User ID:</label>
          <input
            type="text"
            id="userid"
            value={userid}
            onChange={(e) => setUserid(e.target.value)}
          />
        </div>
        <button type="submit">Delete Member</button>
      </form>
    </AdminLayout>
  );
}