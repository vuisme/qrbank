import { query } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { apiKey, apiServer } = req.body;

    try {
      // Cập nhật API key và API server vào database
      await query({
        query: 'UPDATE settings SET api_key = ?, api_server = ? WHERE id = 1', // Giả sử id 1 là settings chính
        values: [apiKey, apiServer],
      });
      res.status(200).json({ message: 'Settings updated successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update settings.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}