import { query } from '../../../lib/db';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    try {
      // Lấy thông tin admin từ database
      const results = await query({
        query: 'SELECT * FROM superadmin WHERE user = $1',
        values: [username],
      });

      if (results.length > 0) {
        const admin = results[0];
        // So sánh mật khẩu đã hash
        const match = await bcrypt.compare(password, admin.password);
        if (match) {
          // Đăng nhập thành công
          res.status(200).json({ message: 'Login successful' });
        } else {
          res.status(401).json({ error: 'Invalid password' });
        }
      } else {
        res.status(404).json({ error: 'Admin user not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to authenticate admin' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}