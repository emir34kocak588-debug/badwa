const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

module.exports = {
  TOKEN: process.env.DISCORD_TOKEN,
  CLIENT_ID: process.env.CLIENT_ID || '1518885820247965756',
  OWNER_ID: process.env.OWNER_ID || '1518024737551417587',
  GUILD_ID: process.env.GUILD_ID || null, // dolu ise komutlar sadece bu sunucuya aninda kaydedilir
  MAX_WARNINGS: 3,
  CURSE_MAX_WARNINGS: 3,
  MUTE_HOURS_ON_CURSE_LIMIT: 3, // saat
  HOLY_WORDS_BAN: ['allah', 'atatürk', 'ataturk'], // kutsal küfür tetikleyicileri (asagida ayrica kufur ile birlikte kontrol edilir)
};
