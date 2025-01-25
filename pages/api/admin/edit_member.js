import { query, hashPassword } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { userid, bank_code, bank_account, usertype, password, name } = req.body; // Thêm name

    try {
      let updateQuery =
        'UPDATE members SET bank_code = $2, bank_account = $3, usertype = $4, name = $5'; // Thêm name
      let values = [userid, bank_code, bank_account, usertype, name]; // Thêm name

      // Kiểm tra xem có cập nhật mật khẩu không
      if (password) {
        const hashedPassword = await hashPassword(password);
        updateQuery += ', password = $6 WHERE userid = $1';
        values.push(hashedPassword);
      } else {
        updateQuery += ' WHERE userid = $1';
      }

      // Cập nhật thông tin thành viên
      const result = await query({
        query: updateQuery,
        values: values,
      });

      if (result === 0) {
        return res.status(404).json({ error: 'Member not found.' });
      }

      res.status(200).json({ message: 'Member updated successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update member.' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}