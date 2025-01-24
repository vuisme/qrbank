import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useRouter } from 'next/router';

export default function AddMember() {
  const [userid, setUserid] = useState('');
  const [bank_code, setBankCode] = useState('');
  const [bank_account, setBankAccount] = useState('');
  const [usertype, setUsertype] = useState('free');
  const [password, setPassword] = useState(''); // Thêm state cho password
  const router = useRouter();

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (isAdminLoggedIn !== 'true') {
        router.push('/admin/login');
    }
  }, [router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Gửi request thêm thành viên lên server (thông qua API route)
    const response = await fetch('/api/admin/add_member', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userid, bank_code, bank_account, usertype, password }), // Thêm password vào request body
    });

    if (response.ok) {
      alert('Member added successfully!');
      // Reset form
      setUserid('');
      setBankCode('');
      setBankAccount('');
      setUsertype('free');
      setPassword(''); // Reset password
    } else {
      const errorData = await response.json();
      alert(`Failed to add member. Error: ${errorData.error}`);
    }
  };

  return (
    <AdminLayout>
      <h1>Add Member</h1>
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
        <div>
          <label htmlFor="bank_code">Bank Code:</label>
          <input
            type="text"
            id="bank_code"
            value={bank_code}
            onChange={(e) => setBankCode(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="bank_account">Bank Account:</label>
          <input
            type="text"
            id="bank_account"
            value={bank_account}
            onChange={(e) => setBankAccount(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="usertype">User Type:</label>
          <select id="usertype" value={usertype} onChange={(e) => setUsertype(e.target.value)}>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
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
        <button type="submit">Add Member</button>
      </form>
    </AdminLayout>
  );
}