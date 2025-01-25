import { query } from '../../../lib/db';
import isAdmin from '../../../middleware/isAdmin';

async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            // Lấy danh sách thành viên từ database
            const results = await query({
            query:
                'SELECT userid, bank_code, bank_account, usertype, name FROM members ORDER BY userid', // Thêm name
            });
    
            res.status(200).json(results);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch members.' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default isAdmin(handler);