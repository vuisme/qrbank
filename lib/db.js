import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const dbFile = './database.db'; // Đường dẫn đến file SQLite

export async function query({ query, values = [] }) {
    const db = await open({
      filename: dbFile,
      driver: sqlite3.Database
    });
    try {
      if (query.trim().startsWith('SELECT')) {
          return await db.all(query, values);
      } else {
        return await db.run(query, values);
      }
    } finally {
      db.close();
    }
}

// Hàm khởi tạo database (nếu file database chưa tồn tại)
export async function initDatabase() {
  const db = await open({
    filename: dbFile,
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      api_key TEXT NOT NULL,
      api_server TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS members (
      userid TEXT PRIMARY KEY,
      bank_code TEXT NOT NULL,
      bank_account TEXT NOT NULL,
      usertype TEXT NOT NULL
    );
  `);

  // Thêm dữ liệu mẫu nếu bảng settings trống
  const settingsCount = await db.get('SELECT count(*) as count FROM settings');
  if (settingsCount.count === 0) {
    await db.run(
      'INSERT INTO settings (api_key, api_server) VALUES (?, ?)',
      ['your_default_api_key', 'your_default_api_server']
    );
  }
    
    // Thêm dữ liệu mẫu nếu bảng members trống
  const membersCount = await db.get('SELECT count(*) as count FROM members');
  if (membersCount.count === 0) {
      await db.run(
        `INSERT INTO members (userid, bank_code, bank_account, usertype) VALUES
        ('user1', 'VCB', '001122334455', 'paid'),
        ('user2', 'TPB', '998877665544', 'free'),