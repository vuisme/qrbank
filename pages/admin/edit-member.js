import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useRouter } from 'next/router';

export default function EditMember() {
  const [userid, setUserid] = useState('');
  const [bank_code, setBankCode] = useState('');
  const [bank_account, setBankAccount] = useState('');
  const [usertype, setUsertype] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { id } = router.query; // Sửa lại: Lấy userid từ query parameter

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (isAdminLoggedIn !== 'true') {
      router.push('/admin/login');
    }

    // Hàm fetch thông tin thành viên dựa vào userid
    const fetchMember = async () => {
      if (id) {
        const response = await fetch(`/api/admin/get_member?userid=${id}`); // Sửa lại: Truyền userid vào query parameter
        if (response.ok) {
          const data = await response.json();
          setUserid(data.userid);
          setBankCode(data.bank_code);
          setBankAccount(data.bank_account);
          setUsertype(data.usertype);
          // Không set password vào state
        } else {
          const errorData = await response.json();
          alert(`Failed to fetch member. Error: ${errorData.error}`);
        }
      }
    };

    fetchMember();
  }, [id, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Gửi request cập nhật lên server (thông qua API route)
    const response = await fetch('/api/admin/edit_member', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userid, bank_code, bank_account, usertype, password }), // Bao gồm password
    });

    if (response.ok) {
      alert('Member updated successfully!');
      // Có thể redirect về trang danh sách thành viên
      router.push('/admin/members'); 
    } else {
      const errorData = await response.json();
      alert(`Failed to update member. Error: ${errorData.error}`);
    }
  };

  return (
    <AdminLayout>
      <h1>Edit Member: {userid}</h1>
      <form onSubmit={handleSubmit}>
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
          <label htmlFor="password">Password (leave blank to keep unchanged):</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Update Member</button>
      </form>
    </AdminLayout>
  );
}