import { query } from '../../../lib/db';
import isAdmin from '../../../middleware/isAdmin';

async function handler(req, res) {
    // Middleware isAdmin sẽ kiểm tra nếu là admin thì mới tiếp tục
    if (req.method === 'POST') {
      const { userid } = req.body; // Xóa theo userid
  
      try {
        // Xóa thành viên khỏi database
        const result = await query({
          query: 'DELETE FROM members WHERE userid = $1',
          values: [userid],
        });
        if (result > 0) {
            res.status(200).json({ message: 'Member deleted successfully.' });
        } else {
            res.status(404).json({ message: 'Member not found.' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete member.' });
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }

export default isAdmin(handler);