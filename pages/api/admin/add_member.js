import { query, hashPassword } from '../../../lib/db';
import isAdmin from '../../../middleware/isAdmin'; // Import middleware

async function handler(req, res) { // Không cần async function nếu không có await bên trong
  if (req.method === 'POST') {
    const { userid, bank_code, bank_account, usertype, password, name } = req.body;

    try {
      // Hash mật khẩu trước khi lưu
      const hashedPassword = await hashPassword(password);

      // Thêm thành viên vào database
      await query({
        query:
          'INSERT INTO members (userid, bank_code, bank_account, usertype, password, name) VALUES ($1, $2, $3, $4, $5, $6)',
        values: [userid, bank_code, bank_account, usertype, hashedPassword, name],
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

export default isAdmin(handler); // Wrap handler với isAdmin middleware