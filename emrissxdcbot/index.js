const http = require('http');
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const config = require('./botsettings');
const { deployCommands } = require('./util-deploy');

// Render ve UptimeRobot için web sunucusu (503 almamak için)
http.createServer((req, res) => {
  res.write("Bot 7/24 aktif!");
  res.end();
}).listen(process.env.PORT || 3000);

if (!config.TOKEN) {
  console.error('HATA: DISCORD_TOKEN bulunamadi.');
  console.error(`Aranan .env yolu: ${path.join(__dirname, '.env')}`);
  console.error(`.env dosyasi var mi: ${fs.existsSync(path.join(__dirname, '.env'))}`);
  console.error(`Bu klasordeki dosyalar: ${fs.readdirSync(__dirname).join(', ')}`);
  console.error('Kontrol et: dosya adi tam olarak ".env" olmali (DISCORD_TOKEN=xxxx satiri olmali).');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildModeration,
  ],
  partials: [Partials.Channel],
});

client.commands = new Collection();

// Komutlari yukle
const commandFiles = fs.readdirSync(__dirname).filter((f) => f.startsWith('cmd-') && f.endsWith('.js'));

for (const file of commandFiles) {
  const exported = require(path.join(__dirname, file));
  const commandList = Array.isArray(exported) ? exported : [exported];
  for (const command of commandList) {
    if (command?.data?.name) {
      client.commands.set(command.data.name, command);
    } else {
      console.warn(`Uyari: ${file} icinde gecersiz bir komut var.`);
    }
  }
}

console.log(`${client.commands.size} komut yuklendi.`);

// Olaylari yukle
const eventFiles = fs.readdirSync(__dirname).filter((f) => f.startsWith('evt-') && f.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(path.join(__dirname, file));
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// Discord'a otomatik bağlanma ve retry (503 koruması)
async function connectDiscord() {
  try {
    await client.login(config.TOKEN);
  } catch (error) {
    console.error("Discord API'ye baglanirken hata olustu, 10 saniye sonra tekrar deneniyor...", error.message);
    setTimeout(connectDiscord, 10000);
  }
}

(async () => {
  try {
    const commandsJSON = [...client.commands.values()].map((c) => c.data.toJSON());
    console.log('Komutlar Discord a kaydediliyor...');
    try {
      await deployCommands(commandsJSON);
    } catch (deployErr) {
      console.error('Komutlar kaydedilirken geçici Hata oluştu (devam ediliyor):', deployErr.message);
    }

    await connectDiscord();
  } catch (err) {
    console.error('Başlatma hatası:', err);
  }
})();

process.on('unhandledRejection', (err) => {
  console.error('Islenmemis hata:', err);
});
