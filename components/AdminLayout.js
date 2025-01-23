import Link from 'next/link';

export default function AdminLayout({ children }) {
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
        </ul>
      </nav>
      <main>{children}</main>
      <footer>{/* Footer content */}</footer>
    </div>
  );
}