import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { key } = req.body;

    try {
      const cachedData = await redis.get(key);
      if (cachedData) {
        res.status(200).json(JSON.parse(cachedData));
      } else {
        res.status(404).json({ error: 'Cache not found' });
      }
    } catch (error) {
      console.error('Failed to get QR data from cache:', error);
      res.status(500).json({ error: 'Failed to get QR data from cache' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}