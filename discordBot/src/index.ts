import dotenv from 'dotenv';
import { Bot } from './bot';

dotenv.config();

const requiredEnvVars = ['DISCORD_TOKEN', 'CLIENT_ID', 'ADMIN_CHANNEL_ID'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Faltan variables de entorno:', missingVars.join(', '));
  process.exit(1);
}

const bot = new Bot();

bot.start().catch((error) => {
  console.error('❌ Error al iniciar el bot:', error);
  process.exit(1);
});

process.on('SIGINT', () => bot.stop());
process.on('SIGTERM', () => bot.stop());
