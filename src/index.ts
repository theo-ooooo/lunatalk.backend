import dotenv from 'dotenv';
import { healthRoutes } from './routes/health';
import { startServer } from './server';
// 환경 변수 로드
dotenv.config();

startServer();
