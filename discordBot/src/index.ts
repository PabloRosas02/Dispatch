import { Bot } from './bot';


const bot = new Bot();

bot.start().catch((error) => {
  console.error('❌ Error al iniciar el bot:', error);
  process.exit(1);
});

process.on('SIGINT', () => bot.stop());
process.on('SIGTERM', () => bot.stop());
