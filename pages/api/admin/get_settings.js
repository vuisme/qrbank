import { query } from '../../../lib/db';
import isAdmin from '../../../middleware/isAdmin';

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Lấy thông tin người dùng từ database dựa vào userid
      const results = await query({
        query: 'SELECT api_key, api_server FROM settings WHERE id = 1',
      });

      if (results.length > 0) {
        res.status(200).json(results[0]);
      } else {
        res.status(404).json({ error: 'Settings not found.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch settings.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default isAdmin(handler);