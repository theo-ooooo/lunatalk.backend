import { FastifyReply } from 'fastify';
import { clearCookie } from '../../tools/cookie';

export async function logout(reply: FastifyReply) {
  try {
    clearCookie(reply, 'accessToken');
    clearCookie(reply, 'refreshToken');
    return {
      message: 'OK',
    };
  } catch (e) {
    console.error('logout error :', e);
    return {
      message: 'FAIL',
    };
  }
}
