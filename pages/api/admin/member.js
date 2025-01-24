import { query } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Lấy danh sách thành viên từ database
      const results = await query({
        query: 'SELECT userid, bank_code, bank_account, usertype FROM members ORDER BY userid', // Sắp xếp theo userid
      });

      res.status(200).json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch members.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}