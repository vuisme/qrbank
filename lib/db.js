import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import Redis from 'ioredis';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Chú ý: Chỉ sử dụng cho môi trường development
  },
});

import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import Redis from 'ioredis';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Chú ý: Chỉ sử dụng cho môi trường development
  },
});

// Khởi tạo Redis client
const redis = new Redis(process.env.REDIS_URL);

const cacheTTL = 24 * 60 * 60; // 1 ngày (tính bằng giây)

export async function getCachedBankList() {
  try {
    // Thử đọc từ cache
    const cachedData = await redis.get('bankList');

    if (cachedData) {
      console.log('Using cached bank list.');
      return JSON.parse(cachedData);
    }
  } catch (error) {
    console.log('Bank list cache not found or error:', error);
  }

  // Nếu không có cache, gọi API
  const response = await fetch('https://api.vietqr.io/v2/banks');
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data = await response.json();

  if (data.code === '00' && data.data) {
    // Lưu vào cache
    await redis.set('bankList', JSON.stringify(data.data), 'EX', cacheTTL);
    console.log('Bank list fetched and cached.');
    return data.data;
  } else {
    throw new Error('Failed to fetch bank list.');
  }
}


export async function hashPassword(password) {
  const saltRounds = 10; // Độ mạnh của hash, càng cao càng an toàn nhưng chậm hơn
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

export async function query({ query, values = [] }) {
  try {
    const client = await pool.connect();
    console.log("Executing query:", query, values);
    const result = await client.query(query, values);
    console.log("Query result:", result);
    client.release();

    // Trả về result.rows nếu là SELECT, trả về result.rowCount nếu là các lệnh khác
    return query.trim().toUpperCase().startsWith('SELECT') ? result.rows : result.rowCount;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function initDatabase() {
  try {
    // Tạo bảng settings nếu chưa tồn tại
    await query({
      query: `
        CREATE TABLE IF NOT EXISTS settings (
          id SERIAL PRIMARY KEY,
          api_key TEXT NOT NULL,
          api_server TEXT NOT NULL
        );
      `,
    });

    // Tạo bảng members nếu chưa tồn tại
    await query({
      query: `
        CREATE TABLE IF NOT EXISTS members (
          userid TEXT PRIMARY KEY,
          bank_code TEXT NOT NULL,
          bank_account TEXT NOT NULL,
          usertype TEXT NOT NULL
        );
      `,
    });

    // Thêm dữ liệu mẫu nếu bảng settings trống
    const settingsCount = await query({
      query: 'SELECT count(*) as count FROM settings',
    });

    if (settingsCount[0].count === 0) {
      await query({
        query: 'INSERT INTO settings (api_key, api_server) VALUES ($1, $2)',
        values: ['your_default_api_key', 'your_default_api_server'],
      });
    }

    // Thêm dữ liệu mẫu nếu bảng members trống
    const membersCount = await query({
      query: 'SELECT count(*) as count FROM members',
    });

    if (membersCount[0].count === 0) {
      try {
        // Sửa lại câu lệnh INSERT để chèn nhiều dòng
        await query({
          query: `
            INSERT INTO members (userid, bank_code, bank_account, usertype) VALUES
            ($1, $2, $3, $4),
            ($5, $6, $7, $8),
            ($9, $10, $11, $12),
            ($13, $14, $15, $16),
            ($17, $18, $19, $20)
          `,
          values: [
            'user1', 'VCB', '001122334455', 'paid',
            'user2', 'TPB', '998877665544', 'free',
            'user3', 'BIDV', '112233445566', 'paid',
            'user4', 'ACB', '887766554433', 'free',
            'user5', 'MBB', '776655443322', 'paid',
          ],
        });
      } catch (error) {
        console.error('Lỗi khi chèn dữ liệu vào members:', error);
      }
    }
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

// Sửa lại: Thêm await khi gọi initDatabase()
(async () => {
  await initDatabase();
})();