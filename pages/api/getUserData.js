import { query } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') { // Thay đổi thành POST
    const { user } = req.body; // Lấy user từ body

    if (!user) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    try {
      const results = await query({
        query: 'SELECT bank_code, bank_account, name FROM members WHERE userid = $1',
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
    res.setHeader('Allow', ['POST']); // Thay đổi thành POST
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}