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
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Name</TableCell> {/* Thêm cột name */}
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
                <TableCell>{member.name}</TableCell> {/* Hiển thị name */}
                <TableCell>{member.bank_code}</TableCell>
                <TableCell>{member.bank_account}</TableCell>
                <TableCell>{member.usertype}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    href={`/admin/edit_member?id=${member.userid}`}
                  >
                    Edit
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