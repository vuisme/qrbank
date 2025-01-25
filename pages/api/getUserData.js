import { query } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { user } = req.query;

    if (!user) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    try {
      // Lấy thông tin người dùng từ database dựa vào userid
      const results = await query({
        query: 'SELECT bank_code, bank_account, name FROM members WHERE userid = $1', // Thay đổi câu truy vấn
        values: [user],
      });

      if (results.length > 0) {
        res.status(200).json(results[0]);
      } else {
        res.status(404).json({ error: 'User not found.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch user data.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}