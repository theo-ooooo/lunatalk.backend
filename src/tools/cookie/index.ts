import { CookieSerializeOptions } from '@fastify/cookie';
import { FastifyReply } from 'fastify';

function getDomains(): any[] {
  const isProduction = process.env.ENVIRONMENT === 'production';

  if (isProduction) return ['.lunatalk.co.kr'];
  return ['location', undefined];
}

export function getCookie(reply: FastifyReply, name: string): any {
  return reply.cookies[name];
}

export function setCookie(
  reply: FastifyReply,
  name: string,
  value: string,
  options?: CookieSerializeOptions
): void {
  getDomains().forEach((domain) => {
    reply.cookie(name, value, {
      httpOnly: true,
      domain,
      path: '/',
      ...options,
    });
  });
}

export function clearCookie(reply: FastifyReply, name: string): void {
  getDomains().forEach((domain) => {
    reply.clearCookie(name, { domain, maxAge: 0, httpOnly: true });
  });
}
