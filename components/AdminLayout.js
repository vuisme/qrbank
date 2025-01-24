import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AdminLayout({ children }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    router.push('/admin/login');
  };

  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link href="/admin">Dashboard</Link>
          </li>
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
      </nav>
      <main>{children}</main>
      <footer>{/* Footer content */}</footer>
    </div>
  );
}