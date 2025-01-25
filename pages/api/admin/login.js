import { query } from '../../lib/db';
import { comparePassword } from '../../lib/api';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    try {
      // Lấy thông tin admin từ database (bảng superadmin)
      const results = await query({
        query: 'SELECT * FROM superadmin WHERE user = $1',
        values: [username],
      });

      if (results.length > 0) {
        const admin = results[0];
        // So sánh mật khẩu đã hash
        const match = await comparePassword(password, admin.password);
        if (match) {
          // Tạo JWT token, thêm role: 'admin'
          const token = jwt.sign(
            { userId: admin.id, role: 'admin' }, // Thêm role
            process.env.JWT_SECRET, // Sử dụng JWT_SECRET chung
            { expiresIn: '1h' } // Token hết hạn sau 1 giờ
          );

          res.status(200).json({ token });
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