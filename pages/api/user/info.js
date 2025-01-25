import { query } from '../../../lib/db';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { userId } = decoded;

      // Lấy thông tin chi tiết của user từ database
      const results = await query({
        query: 'SELECT * FROM members WHERE userid = $1', // Lấy tất cả thông tin, trừ password
        values: [userId],
      });

      if (results.length > 0) {
        const user = results[0];
        delete user.password; // Xóa password khỏi response
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: 'User not found.' });
      }
    } catch (error) {
      console.error(error);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid token' });
      }
      res.status(500).json({ error: 'Failed to fetch user data.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}