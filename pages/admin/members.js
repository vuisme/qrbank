import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Members() {
  const [members, setMembers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (isAdminLoggedIn !== 'true') {
        router.push('/admin/login');
    }
    const fetchMembers = async () => {
      const response = await fetch('/api/admin/members');
      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      } else {
        console.error('Failed to fetch members.');
      }
    };

    fetchMembers();
  }, [router]);

  return (
    <AdminLayout>
      <h1>Members</h1>
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Bank Code</th>
            <th>Bank Account</th>
            <th>User Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.userid}>
              <td>{member.userid}</td>
              <td>{member.bank_code}</td>
              <td>{member.bank_account}</td>
              <td>{member.usertype}</td>
              <td>
                <Link href={`/admin/edit_member?id=${member.userid}`}>
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}