import { query } from '../../lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; // Sử dụng jsonwebtoken

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userid, password } = req.body;

    try {
      // Lấy thông tin thành viên từ database
      const results = await query({
        query: 'SELECT * FROM members WHERE userid = $1',
        values: [userid],
      });

      if (results.length > 0) {
        const member = results[0];
        // So sánh mật khẩu đã hash
        const match = await bcrypt.compare(password, member.password);
        if (match) {
          // Tạo JWT token
          const token = jwt.sign(
            { userId: member.userid, name: member.name },
            process.env.JWT_SECRET, // Lưu secret key trong biến môi trường
            { expiresIn: '1h' } // Token hết hạn sau 1 giờ
          );

          res.status(200).json({ token });
        } else {
          res.status(401).json({ error: 'Invalid password' });
        }
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to authenticate user' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}