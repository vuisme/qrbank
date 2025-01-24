import { query } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { apiKey, apiServer } = req.body;

    try {
      // Kiểm tra xem bảng settings có dữ liệu chưa
      const settingsCount = await query({
        query: 'SELECT count(*) as count FROM settings',
      });

      if (settingsCount[0].count === 0) {
        // Nếu bảng trống, thực hiện INSERT
        console.log("Inserting new settings...");
        await query({
          query: 'INSERT INTO settings (api_key, api_server) VALUES ($1, $2)',
          values: [apiKey, apiServer],
        });
      } else {
        // Nếu bảng có dữ liệu, thực hiện UPDATE
        console.log("Updating existing settings...");
        await query({
          query: 'UPDATE settings SET api_key = $1, api_server = $2 WHERE id = 1', // Giả định id của settings là 1
          values: [apiKey, apiServer],
        });
      }

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