import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

export async function query({ query, values = [] }) {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const [results] = await connection.execute(query, values);
    return results;
  } finally {
    connection.end();
  }
}