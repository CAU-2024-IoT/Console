import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const { JWT_SECRET, JWT_EXPIRATION } = process.env;

/**
 * JWT 토큰 생성 함수
 * @param {Object} payload - 토큰에 포함할 데이터 (예: 사용자 ID)
 * @returns {string} - 생성된 JWT 토큰
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

/**
 * JWT 토큰 검증 함수
 * @param {string} token - 클라이언트에서 보낸 JWT 토큰
 * @returns {Object|null} - 검증된 사용자 데이터 또는 null
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null; // 검증 실패 시 null 반환
  }
};
