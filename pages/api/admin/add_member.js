import { query } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userid, bank_code, bank_account, usertype } = req.body;

    try {
      // Thêm thành viên vào database
      await query({
        query: 'INSERT INTO members (userid, bank_code, bank_account, usertype) VALUES ($1, $2, $3, $4)', // Đã sửa thành $1, $2, $3, $4
        values: [userid, bank_code, bank_account, usertype],
      });
      res.status(200).json({ message: 'Member added successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to add member.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}