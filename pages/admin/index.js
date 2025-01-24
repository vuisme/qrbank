import AdminLayout from '../../components/AdminLayout';
import { Typography, Button } from '@mui/material';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (isAdminLoggedIn !== 'true') {
      router.push('/admin/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    router.push('/admin/login');
  };

  return (
    <AdminLayout>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>
      <ul>
        <li>
          <Link href="/admin/settings">Settings</Link>
        </li>
        <li>
          <Link href="/admin/add-member">Add Member</Link>
        </li>
        <li>
          <Link href="/admin/delete-member">Delete Member</Link>
        </li>
        <li>
          <Link href="/admin/members">Members</Link> {/* Thêm link này */}
        </li>
      </ul>
      <button onClick={handleLogout}>Logout</button>
    </AdminLayout>
  );
}


