import { query, hashPassword } from '../../../lib/db';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { userId } = decoded;

      const { bank_code, bank_account, name, password } = req.body;

      // Lấy thông tin hiện tại của user từ database
      const currentUser = await query({
        query: 'SELECT bank_code, bank_account FROM members WHERE userid = $1',
        values: [userId],
      });

      if (currentUser.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      let updateQuery = 'UPDATE members SET name = $2';
      let values = [userId, name];

      // Chỉ cập nhật bank_code và bank_account nếu user chưa có thông tin này
      if (!currentUser[0].bank_code) {
          updateQuery += ', bank_code = $3';
          values.push(bank_code);
      }
      
      if (!currentUser[0].bank_account) {
          updateQuery += ', bank_account = $4';
          values.push(bank_account);
      }

      if (password) {
        const hashedPassword = await hashPassword(password);
        updateQuery += ', password = $5 WHERE userid = $1';
        values.push(hashedPassword);
      } else {
        updateQuery += ' WHERE userid = $1';
      }

      const result = await query({
        query: updateQuery,
        values: values,
      });

      if (result === 0) {
        return res.status(404).json({ error: 'Member not found.' });
      }

      res.status(200).json({ message: 'Member updated successfully.' });
    } catch (error) {
      console.error(error);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid token' });
      }
      res.status(500).json({ error: 'Failed to update member' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}