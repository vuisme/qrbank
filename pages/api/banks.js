import { getCachedBankList } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { bankCode } = req.query;

    try {
      const banks = await getCachedBankList();

      // Nếu có bankCode, trả về thông tin của ngân hàng cụ thể
      if (bankCode) {
        const bank = banks.find(
          (b) => b.code === bankCode || b.bin === bankCode
        );

        if (bank) {
          res.status(200).json({
            name: bank.name,
            shortName: bank.shortName,
            logo: bank.logo,
          });
        } else {
          res.status(404).json({ error: 'Bank not found.' });
        }
      } else {
        // Nếu không có bankCode, trả về danh sách tất cả ngân hàng
        res.status(200).json(banks);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch bank data.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}