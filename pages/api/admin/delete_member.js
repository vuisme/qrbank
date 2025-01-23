import { query } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userid } = req.body; // Xóa theo userid

    try {
      // Xóa thành viên khỏi database
      await query({
        query: 'DELETE FROM members WHERE userid = ?',
        values: [userid],
      });
      res.status(200).json({ message: 'Member deleted successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete member.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}