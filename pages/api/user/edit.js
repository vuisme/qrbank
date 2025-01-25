import { query, hashPassword } from '../../../lib/db';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    // Lấy token từ header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      // Xác thực token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { userId } = decoded;

      const { bank_code, bank_account, name, password } = req.body;

      let updateQuery =
        'UPDATE members SET bank_code = $2, bank_account = $3, name = $4';
      let values = [userId, bank_code, bank_account, name];

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