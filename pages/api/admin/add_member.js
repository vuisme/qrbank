import { query, hashPassword } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userid, bank_code, bank_account, usertype, password } = req.body;

    try {
      // Thêm thành viên vào database
      const hashedPassword = await hashPassword(password);
      await query({
        query: 'INSERT INTO members (userid, bank_code, bank_account, usertype, password) VALUES ($1, $2, $3, $4, $5)',
        values: [userid, bank_code, bank_account, usertype, hashedPassword],
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