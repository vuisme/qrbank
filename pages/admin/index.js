import AdminLayout from '../../components/AdminLayout';
import Link from 'next/link';
import {useEffect} from 'react';
import {useRouter} from 'next/router';

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
      <h1>Admin Dashboard</h1>
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
          <Link href="/admin/edit-member">Edit Member</Link> 
        </li>
      </ul>
        <button onClick={handleLogout}>Logout</button>
    </AdminLayout>
  );
}