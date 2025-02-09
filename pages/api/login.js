import { query } from '../../lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Redis from 'ioredis';

// Khởi tạo Redis client
const redis = new Redis(process.env.REDIS_URL);

const MAX_FAILED_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW = 3600; // 1 giờ (giây)
const BLOCK_DURATION = 86400; // 24 giờ (giây)

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { userid, password } = req.body; // **Không còn lấy recaptchaToken nữa**
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        // **Bước 1: Kiểm tra giới hạn tần suất và chặn IP (chống brute-force)**
        if (await isIpBlocked(ip)) {
            return res.status(429).json({ error: 'Tài khoản của bạn tạm thời bị khóa do quá nhiều lần thử đăng nhập thất bại. Vui lòng thử lại sau 24 giờ.' });
        }
        if (await isRateLimited(ip)) {
            return res.status(429).json({ error: 'Quá nhiều lần thử đăng nhập thất bại. Vui lòng thử lại sau.' });
        }

        try {
            // **Bước 2: KHÔNG CÒN XÁC THỰC reCAPTCHA Ở BACKEND NỮA**

            // **Bước 3: Xác thực User ID và mật khẩu**
            const results = await query({
                query: 'SELECT * FROM members WHERE userid = $1',
                values: [userid],
            });

            if (results.length > 0) {
                const member = results[0];
                const match = await bcrypt.compare(password, member.password);
                if (match) {
                    const token = jwt.sign(
                        { userId: member.userid, name: member.name },
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
                return res.status(404).json({ error: 'Không tìm thấy User ID' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Lỗi xác thực người dùng' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

async function isIpBlocked(ip) {
    const blockUntil = await redis.get(`member_block:${ip}`);
    return blockUntil && parseInt(blockUntil) > Math.floor(Date.now() / 1000);
}

async function isRateLimited(ip) {
    const attempts = await redis.get(`member_attempts:${ip}`);
    const blockUntil = await redis.get(`member_block:${ip}`);
    return attempts && parseInt(attempts) >= MAX_FAILED_ATTEMPTS && !(blockUntil && parseInt(blockUntil) > Math.floor(Date.now() / 1000));
}


async function recordFailedAttempt(ip) {
    const attemptsKey = `member_attempts:${ip}`;
    const blockKey = `member_block:${ip}`;

    const attempts = (await redis.get(attemptsKey)) || 0;
    await redis.set(attemptsKey, parseInt(attempts) + 1, 'EX', RATE_LIMIT_WINDOW);

    if (parseInt(attempts) + 1 >= MAX_FAILED_ATTEMPTS && !(await redis.get(blockKey))) {
        const blockExpiresAt = Math.floor(Date.now() / 1000) + BLOCK_DURATION;
        await redis.set(blockKey, blockExpiresAt, 'EX', BLOCK_DURATION);
        await redis.del(attemptsKey);
    }
}


async function clearFailedAttempts(ip) {
    await redis.del(`member_attempts:${ip}`);
    await redis.del(`member_block:${ip}`);
}

// **Hàm verifyRecaptcha ĐÃ BỊ LOẠI BỎ HOÀN TOÀN**
// async function verifyRecaptcha(token) {
//     const secretKey = process.env.RECAPTCHA_SECRET_KEY;
//     const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

//     const response = await fetch(verificationUrl, { method: 'POST' });
//     const result = await response.json();
//     return result;
// }