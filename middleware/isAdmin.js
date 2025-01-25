// middleware/isAdmin.js
import jwt from 'jsonwebtoken';

function isAdmin(handler) {
  return async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Kiểm tra role phải là 'admin'
      if (decoded.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
      }

      req.user = decoded; // Gắn thông tin user vào req object
      return handler(req, res); // Cho phép request đi tiếp đến API route handler
    } catch (error) {
      console.error(error);
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
}

export default isAdmin;