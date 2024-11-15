import { verifyToken } from './auth.js';

export const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // 'Bearer 토큰값' 형식의 토큰에서 추출

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }

  // 검증된 사용자 정보 req 객체에 추가
  req.user = decoded;
  next();
};
