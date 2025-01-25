import { query, hashPassword } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userid, bank_code, bank_account, usertype, password, name } = req.body; // Thêm name

    try {
      // Hash mật khẩu trước khi lưu
      const hashedPassword = await hashPassword(password);

      // Thêm thành viên vào database
      await query({
        query:
          'INSERT INTO members (userid, bank_code, bank_account, usertype, password, name) VALUES ($1, $2, $3, $4, $5, $6)', // Thêm name
        values: [userid, bank_code, bank_account, usertype, hashedPassword, name], // Thêm name
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