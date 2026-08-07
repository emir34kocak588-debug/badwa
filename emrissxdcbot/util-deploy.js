const { REST, Routes } = require('discord.js');
const config = require('./botsettings');

async function deployCommands(commandsJSON) {
  const rest = new REST({ version: '10' }).setToken(config.TOKEN);
  try {
    if (config.GUILD_ID) {
      await rest.put(Routes.applicationGuildCommands(config.CLIENT_ID, config.GUILD_ID), { body: commandsJSON });
      console.log(`${commandsJSON.length} komut sunucuya (GUILD_ID) kaydedildi, aninda gorunmeli.`);
    } else {
      await rest.put(Routes.applicationCommands(config.CLIENT_ID), { body: commandsJSON });
      console.log(`${commandsJSON.length} komut GLOBAL olarak kaydedildi (Discord'da yayilmasi birkac dakika ile 1 saat surebilir).`);
    }
  } catch (err) {
    console.error('HATA: Komutlar Discord a kaydedilemedi:', err.message);
    console.error('Genellikle CLIENT_ID yanlis oldugunda ya da token gecersiz oldugunda olur. .env dosyani kontrol et.');
  }
}

module.exports = { deployCommands };
