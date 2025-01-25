import { query, hashPassword } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userid, password, email, name, bank_code, bank_account } = req.body;

    try {
      // Kiểm tra xem userid đã tồn tại chưa
      const existingUser = await query({
        query: 'SELECT * FROM members WHERE userid = $1',
        values: [userid],
      });

      if (existingUser.length > 0) {
        return res.status(400).json({ error: 'User ID already exists.' });
      }

      // Hash mật khẩu
      const hashedPassword = await hashPassword(password);

      // Thêm thành viên mới vào database
      await query({
        query:
          'INSERT INTO members (userid, password, email, name, bank_code, bank_account, usertype) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        values: [userid, hashedPassword, email, name, bank_code, bank_account, 'free'], // Mặc định usertype là free
      });

      res.status(200).json({ message: 'Registration successful.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to register user.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}