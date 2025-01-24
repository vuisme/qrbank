import { getCachedBankList } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const banks = await getCachedBankList();
      res.status(200).json(banks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch bank list.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}