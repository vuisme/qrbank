import { query } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { apiKey, apiServer } = req.body;

    try {
        console.log("Upserting settings...");
        const settingsUpdated = await query({
          query: `INSERT INTO settings (id, api_key, api_server) VALUES (1, $1, $2)
          ON CONFLICT (id) 
          DO 
            UPDATE SET api_key = $1, api_server = $2`,
          values: [apiKey, apiServer],
        });

        // Kiểm tra xem có dòng nào bị ảnh hưởng không
        if (settingsUpdated === 0) {
          return res.status(404).json({ error: 'Settings not found.' });
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