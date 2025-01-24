import { query } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { userid } = req.query;

    if (!userid) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    try {
      // Lấy thông tin người dùng từ database dựa vào userid
      const results = await query({
        query: 'SELECT userid, bank_code, bank_account, usertype FROM members WHERE userid = $1', // Không lấy password
        values: [userid],
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