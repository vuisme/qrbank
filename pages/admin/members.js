import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Members() {
  const [members, setMembers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const tokenAdmin = localStorage.getItem('tokenAdmin');
    if (!tokenAdmin) {
      router.push('/admin/login');
    }

    const fetchMembers = async () => {
      const response = await fetch('/api/admin/members', {
        headers: {
          Authorization: `Bearer ${tokenAdmin}`, // Gửi token trong header
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      } else {
        console.error('Failed to fetch members.');
      }
    };

    fetchMembers();
  }, [router]);

  const handleDelete = async (userid) => {
    if (confirm(`Bạn có chắc chắn muốn xóa thành viên ${userid}?`)) {
      const tokenAdmin = localStorage.getItem('tokenAdmin'); // Lấy token
      const response = await fetch('/api/admin/delete_member', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenAdmin}`, // Gửi token trong header
        },
        body: JSON.stringify({ userid }),
      });

      if (response.ok) {
        // Xóa thành viên khỏi danh sách hiển thị
        setMembers(members.filter((member) => member.userid !== userid));
        alert('Member deleted successfully.');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to delete member.');
      }
    }
  };

  return (
    <AdminLayout>
      <h1>Members</h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Bank Code</TableCell>
              <TableCell>Bank Account</TableCell>
              <TableCell>User Type</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.userid}>
                <TableCell component="th" scope="row">
                  {member.userid}
                </TableCell>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.bank_code}</TableCell>
                <TableCell>{member.bank_account}</TableCell>
                <TableCell>{member.usertype}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    href={`/admin/edit-member?id=${member.userid}`}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(member.userid)}
                    startIcon={<DeleteIcon />}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </AdminLayout>
  );
}