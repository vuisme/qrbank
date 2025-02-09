import { query, comparePassword } from '../../../lib/db';
import jwt from 'jsonwebtoken';
import Redis from 'ioredis';

// Khởi tạo Redis client sử dụng ioredis và URL từ biến môi trường
const redis = new Redis(process.env.REDIS_URL);

const MAX_FAILED_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW = 3600; // 1 giờ (giây)
const BLOCK_DURATION = 86400; // 24 giờ (giây)

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { username, password } = req.body;
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        if (await isIpBlocked(ip)) {
            return res.status(429).json({ error: 'Tài khoản của bạn tạm thời bị khóa do quá nhiều lần thử đăng nhập thất bại. Vui lòng thử lại sau 24 giờ.' });
        }

        if (await isRateLimited(ip)) {
            return res.status(429).json({ error: 'Quá nhiều lần thử đăng nhập thất bại. Vui lòng thử lại sau.' });
        }

        try {
            const results = await query({
                query: 'SELECT * FROM superadmin WHERE username = $1',
                values: [username],
            });

            if (results.length > 0) {
                const admin = results[0];
                const match = await comparePassword(password, admin.password);
                if (match) {
                    const token = jwt.sign(
                        { userId: admin.id, role: 'admin' },
                        process.env.JWT_SECRET,
                        { expiresIn: '1h' }
                    );
                    await clearFailedAttempts(ip);
                    return res.status(200).json({ token });
                } else {
                    await recordFailedAttempt(ip);
                    return res.status(401).json({ error: 'Sai mật khẩu' });
                }
            } else {
                await recordFailedAttempt(ip);
                return res.status(404).json({ error: 'Không tìm thấy tài khoản quản trị' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Lỗi xác thực quản trị viên' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

async function isIpBlocked(ip) {
    const blockUntil = await redis.get(`block:${ip}`);
    return blockUntil && parseInt(blockUntil) > Math.floor(Date.now() / 1000);
}

async function isRateLimited(ip) {
    const attempts = await redis.get(`attempts:${ip}`);
    const blockUntil = await redis.get(`block:${ip}`); // Kiểm tra xem có bị block không
    return attempts && parseInt(attempts) >= MAX_FAILED_ATTEMPTS && !(blockUntil && parseInt(blockUntil) > Math.floor(Date.now() / 1000));
}


async function recordFailedAttempt(ip) {
    const attemptsKey = `attempts:${ip}`;
    const blockKey = `block:${ip}`;

    const attempts = (await redis.get(attemptsKey)) || 0;
    await redis.set(attemptsKey, parseInt(attempts) + 1, 'EX', RATE_LIMIT_WINDOW); // Sử dụng 'EX' để set TTL

    if (parseInt(attempts) + 1 >= MAX_FAILED_ATTEMPTS && !(await redis.get(blockKey))) {
        const blockExpiresAt = Math.floor(Date.now() / 1000) + BLOCK_DURATION;
        await redis.set(blockKey, blockExpiresAt, 'EX', BLOCK_DURATION);
        await redis.del(attemptsKey); // Xóa attempts key khi block
    }
}


async function clearFailedAttempts(ip) {
    await redis.del(`attempts:${ip}`);
    await redis.del(`block:${ip}`);
}