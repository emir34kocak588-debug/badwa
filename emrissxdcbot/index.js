const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const config = require('./botsettings');
const { deployCommands } = require('./util-deploy');

if (!config.TOKEN) {
  console.error('HATA: DISCORD_TOKEN bulunamadi.');
  console.error(`Aranan .env yolu: ${path.join(__dirname, '.env')}`);
  console.error(`.env dosyasi var mi: ${fs.existsSync(path.join(__dirname, '.env'))}`);
  console.error(`Bu klasordeki dosyalar: ${fs.readdirSync(__dirname).join(', ')}`);
  console.error('Kontrol et: dosya adi tam olarak ".env" olmali (".env.txt" degil), icinde DISCORD_TOKEN=xxxx satiri olmali (bosluk/tirnak olmadan). Alternatif olarak Katabump panelindeki "Startup/Variables" sekmesinden DISCORD_TOKEN degiskenini tanimlayabilirsin.');
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

// Komutlari yukle (bu klasordeki "cmd-" ile baslayan her .js dosyasi bir komut dizisi export eder)
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

// Olaylari yukle (bu klasordeki "evt-" ile baslayan her .js dosyasi bir olay export eder)
const eventFiles = fs.readdirSync(__dirname).filter((f) => f.startsWith('evt-') && f.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(path.join(__dirname, file));
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

(async () => {
  // Bot her acildiginda komutlari otomatik olarak Discord'a kaydet.
  // Boylece ayrica "npm run deploy" calistirmaya gerek kalmiyor.
  const commandsJSON = [...client.commands.values()].map((c) => c.data.toJSON());
  console.log('Komutlar Discord a kaydediliyor...');
  await deployCommands(commandsJSON);

  await client.login(config.TOKEN);
})();

process.on('unhandledRejection', (err) => {
  console.error('Islenmemis hata:', err);
});
